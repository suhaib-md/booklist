"use client";

import { useState } from "react";
import { useBooks } from "@/contexts/BookProvider";
import { generateReadingSuggestions } from "@/ai/flows/generate-reading-suggestions";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SuggestionsPage() {
  const { books } = useBooks();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setSuggestions("");
    
    const readingList = books
      .map((book) => `${book.title} by ${book.author}`)
      .join(", ");
      
    if (!readingList) {
        setSuggestions("Your reading list is empty. Add some books to get suggestions.");
        setLoading(false);
        return;
    }

    try {
      const result = await generateReadingSuggestions({ readingList });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error(error);
      setSuggestions("Sorry, I couldn't generate suggestions at this time. Please try again later.");
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
      <div className="flex flex-col items-start gap-6">
        <Button onClick={handleGenerate} disabled={loading} size="lg">
          <Sparkles className="mr-2 h-5 w-5" />
          {loading ? "Thinking..." : "Generate Suggestions"}
        </Button>

        {(loading || suggestions) && (
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="font-headline">Your Personalized Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/6" />
                        </div>
                    ) : (
                        <p className="whitespace-pre-line text-foreground/90">{suggestions}</p>
                    )}
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
