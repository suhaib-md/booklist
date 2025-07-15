"use client";

import { useBooks } from "@/contexts/BookProvider";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookCheck, CalendarDays, ThumbsUp } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function StatsPage() {
  const { books } = useBooks();

  const currentYear = new Date().getFullYear();

  const readBooks = books.filter((book) => book.status === "Read");

  const booksReadThisYear = readBooks.filter((book) => {
    if (!book.finishedDate) {
      return false;
    }
    const finishedYear = new Date(book.finishedDate).getFullYear();
    return finishedYear === currentYear;
  });

  const totalBooksRead = readBooks.length;

  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(currentYear, i).toLocaleString("default", { month: "short" }),
    books: 0,
  }));

  booksReadThisYear.forEach((book) => {
    if (book.finishedDate) {
      const monthIndex = new Date(book.finishedDate).getMonth();
      monthlyData[monthIndex].books += 1;
    }
  });

  const genreCounts = readBooks.reduce((acc, book) => {
    if (book.genre) {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <div className="container mx-auto">
      <PageHeader
        title="Reading Statistics"
        description="A look at your reading habits."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Books Read ({currentYear})
            </CardTitle>
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
         <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Favorite Genre</CardTitle>
            <ThumbsUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favoriteGenre}</div>
            <p className="text-xs text-muted-foreground">
              Your most read genre of all time.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Monthly Reading ({currentYear})</CardTitle>
                <CardDescription>Number of books you finished each month this year.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ChartContainer config={{}} className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <XAxis
                                dataKey="month"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                cursor={false}
                                content={<ChartTooltipContent
                                    labelKey="month"
                                    nameKey="books"
                                    indicator="dot"
                                    formatter={(value) => [`${value} books`, '']}
                                    labelClassName="font-bold"
                                />}
                            />
                            <Bar dataKey="books" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}