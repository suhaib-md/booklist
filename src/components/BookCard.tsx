"use client";

import Image from "next/image";
import { Book, BookStatus } from "@/lib/types";
import { useBooks } from "@/contexts/BookProvider";
import { useAuth } from "@/contexts/AuthProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { updateBookStatus } = useBooks();
  const { isAuthenticated } = useAuth();

  const handleStatusChange = (status: BookStatus) => {
    updateBookStatus(book.id, status);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={book.coverImage || "https://placehold.co/400x600.png"}
          alt={`Cover of ${book.title}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority
          data-ai-hint="book cover"
        />
      </div>
      <CardHeader className="relative pt-4">
        <CardTitle className="pr-10 font-headline leading-tight">{book.title}</CardTitle>
        <CardDescription>by {book.author}</CardDescription>
        {isAuthenticated && (
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(["To Read", "Currently Reading", "Read"] as BookStatus[]).map(
                  (status) => (
                    <DropdownMenuItem
                      key={status}
                      onSelect={() => handleStatusChange(status)}
                      disabled={book.status === status}
                    >
                      Move to {status}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-2">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm">Synopsis</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {book.synopsis}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="pt-0">
        {book.genre && <Badge variant="secondary">{book.genre}</Badge>}
      </CardFooter>
    </Card>
  );
}
