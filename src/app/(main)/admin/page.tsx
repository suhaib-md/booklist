"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useBooks } from "@/contexts/BookProvider";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BookForm } from "@/components/BookForm";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Book } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleAddBook = (values: { title: string; author: string; synopsis: string; }) => {
    addBook(values);
    setAddDialogOpen(false);
  };

  const handleEditBook = (values: { title: string; author: string; synopsis: string; }) => {
    if (selectedBook) {
      updateBook({ ...selectedBook, ...values });
    }
    setEditDialogOpen(false);
    setSelectedBook(null);
  };

  const openEditDialog = (book: Book) => {
    setSelectedBook(book);
    setEditDialogOpen(true);
  };

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="container mx-auto">
        <PageHeader
          title="Admin Panel"
          description="Manage your book collection."
        />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-36" />
          </div>
          <div className="border rounded-lg">
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Admin Panel"
          description="Manage your book collection."
        />
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Book
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a New Book</DialogTitle>
            </DialogHeader>
            <BookForm onSubmit={handleAddBook} onClose={() => setAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{book.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                   <Button variant="ghost" size="icon" onClick={() => openEditDialog(book)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                   </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="ghost" size="icon">
                         <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                       </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the book "{book.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteBook(book.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setEditDialogOpen(open); if (!open) setSelectedBook(null); }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Book</DialogTitle>
            </DialogHeader>
            <BookForm
              onSubmit={handleEditBook}
              defaultValues={selectedBook ?? undefined}
              onClose={() => setEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

    </div>
  );
}
