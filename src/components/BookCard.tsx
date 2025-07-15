"use client";

import { Book, BookStatus } from "@/lib/types";
import { useBooks } from "@/contexts/BookProvider";
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
import { MoreVertical } from "lucide-react";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { updateBookStatus } = useBooks();

  const handleStatusChange = (status: BookStatus) => {
    updateBookStatus(book.id, status);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="relative">
        <CardTitle className="pr-10 font-headline">{book.title}</CardTitle>
        <CardDescription>by {book.author}</CardDescription>
        <div className="absolute top-4 right-4">
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
      </CardHeader>
      <CardContent className="flex-grow">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Synopsis</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {book.synopsis}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
