"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Book, BookStatus } from "@/lib/types";
import { initialBooks } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface BookContextType {
  books: Book[];
  addBook: (book: Omit<Book, "id" | "status" | "finishedDate">) => void;
  updateBook: (updatedBook: Book) => void;
  deleteBook: (id: string) => void;
  updateBookStatus: (id: string, status: BookStatus) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const { toast } = useToast();

  const addBook = (book: Omit<Book, "id" | "status" | "finishedDate">) => {
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      status: "To Read",
      finishedDate: null,
    };
    setBooks((prevBooks) => [newBook, ...prevBooks]);
    toast({
      title: "Book added!",
      description: `"${book.title}" has been added to your 'To Read' list.`,
    });
  };

  const updateBook = (updatedBook: Book) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
    toast({
      title: "Book updated!",
      description: `"${updatedBook.title}" has been updated.`,
    });
  };

  const deleteBook = (id: string) => {
    const bookToDelete = books.find(b => b.id === id);
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
     if(bookToDelete) {
      toast({
        title: "Book deleted",
        description: `"${bookToDelete.title}" has been removed.`,
        variant: "destructive",
      });
    }
  };

  const updateBookStatus = (id: string, status: BookStatus) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id
          ? {
              ...book,
              status,
              finishedDate: status === "Read" ? new Date() : book.finishedDate,
            }
          : book
      )
    );
    const book = books.find(b => b.id === id);
    if(book) {
      toast({
        title: "Status updated!",
        description: `"${book.title}" moved to '${status}'.`,
      });
    }
  };

  return (
    <BookContext.Provider
      value={{ books, addBook, updateBook, deleteBook, updateBookStatus }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
};
