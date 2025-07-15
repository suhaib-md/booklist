"use client";

import { useBooks } from "@/contexts/BookProvider";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCheck, CalendarDays } from "lucide-react";

export default function StatsPage() {
  const { books } = useBooks();

  const currentYear = new Date().getFullYear();

  const booksReadThisYear = books.filter((book) => {
    if (book.status !== "Read" || !book.finishedDate) {
      return false;
    }
    const finishedYear = new Date(book.finishedDate).getFullYear();
    return finishedYear === currentYear;
  });
  
  const totalBooksRead = books.filter(b => b.status === 'Read').length

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Reading Statistics"
        description="A look at your reading habits."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Books Read ({currentYear})</CardTitle>
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{booksReadThisYear.length}</div>
            <p className="text-xs text-muted-foreground">
              You're on a roll this year!
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Books Read</CardTitle>
            <BookCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooksRead}</div>
            <p className="text-xs text-muted-foreground">
              An impressive collection of stories.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
