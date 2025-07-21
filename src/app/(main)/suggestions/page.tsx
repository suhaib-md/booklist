"use client";

import { useState } from "react";
import { useBooks } from "@/contexts/BookProvider";
import {
  generateReadingSuggestions,
  GenerateReadingSuggestionsOutput,
} from "@/ai/flows/generate-reading-suggestions";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Sparkles, BookHeart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SuggestionsPage() {
  const { books } = useBooks();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<
    GenerateReadingSuggestionsOutput["suggestions"] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setSuggestions(null);
    setError(null);

    const readingList = books
      .map((book) => `${book.title} by ${book.author}`)
      .join(", ");

    if (!readingList) {
      setError(
        "Your reading list is empty. Add some books to get suggestions."
      );
      setLoading(false);
      return;
    }

    try {
      const result = await generateReadingSuggestions({ readingList });
      if (result.suggestions && result.suggestions.length > 0) {
        setSuggestions(result.suggestions);
      } else {
        setError("I couldn't come up with any suggestions right now. Try again in a moment.");
      }
    } catch (error) {
      console.error(error);
      setError(
        "Sorry, I couldn't generate suggestions at this time. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <PageHeader
        title="AI Reading Suggestions"
        description="Discover your next favorite book based on your current collection."
      />
      <div className="flex flex-col items-start gap-8">
        <Button onClick={handleGenerate} disabled={loading} size="lg">
          <Sparkles className="mr-2 h-5 w-5" />
          {loading ? "Thinking..." : "Generate Suggestions"}
        </Button>

        {loading && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                </Card>
            ))}
          </div>
        )}

        {error && (
            <Alert variant="destructive" className="max-w-xl">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {suggestions && (
          <div className="w-full">
            <h2 className="flex items-center gap-3 mb-6 text-2xl font-semibold font-headline">
              <BookHeart className="w-6 h-6 text-accent" />
              Here's What I Found For You
            </h2>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="font-headline">{suggestion.title}</CardTitle>
                    <CardDescription>by {suggestion.author}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
