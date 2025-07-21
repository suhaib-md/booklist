"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, BookPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { debounce } from "lodash";

type BookSearchResult = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    categories?: string[];
  };
};

type BookSearchProps = {
  onBookSelect: (book: {
    title: string;
    author: string;
    synopsis: string;
    coverImage: string;
    genre: string;
  }) => void;
};

export function BookSearch({ onBookSelect }: BookSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBooks = async (searchQuery: string) => {
    if (searchQuery.trim() === "") {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/book-search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch book results");
      }
      const data = await response.json();
      setResults(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(searchBooks, 500), []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const handleSelectBook = (result: BookSearchResult) => {
    const bookData = {
      title: result.volumeInfo.title,
      author: result.volumeInfo.authors?.join(", ") ?? "Unknown Author",
      synopsis: result.volumeInfo.description ?? "No synopsis available.",
      coverImage: result.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') ?? "",
      genre: result.volumeInfo.categories?.[0] ?? "",
    };
    onBookSelect(bookData);
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by title or author..."
          value={query}
          onChange={handleQueryChange}
          className="pl-10"
        />
      </div>

      <ScrollArea className="h-64">
        <div className="space-y-2 pr-4">
          {loading && (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
          {!loading && !error && results.length === 0 && query && (
             <p className="text-muted-foreground text-sm text-center pt-4">No books found for "{query}".</p>
          )}
          {results.map((result) => (
            <div
              key={result.id}
              className="flex items-start gap-4 p-2 rounded-md hover:bg-accent"
            >
              <Image
                src={result.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || "https://placehold.co/100x150.png"}
                alt={result.volumeInfo.title}
                width={50}
                height={75}
                className="object-cover rounded-sm"
                data-ai-hint="book cover"
              />
              <div className="flex-grow">
                <p className="font-semibold text-sm">{result.volumeInfo.title}</p>
                <p className="text-xs text-muted-foreground">
                  {result.volumeInfo.authors?.join(", ")}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleSelectBook(result)}>
                <BookPlus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
