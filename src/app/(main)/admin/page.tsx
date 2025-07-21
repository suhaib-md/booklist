"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useBooks } from "@/contexts/BookProvider";
import { generateBookCover } from "@/ai/flows/generate-book-cover";
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
import { BookSearch } from "@/components/BookSearch";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Wand2, Loader2 } from "lucide-react";
import { Book } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function AdminPage() {
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [generatingCoverBookId, setGeneratingCoverBookId] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleAddBook = (values: { title: string; author: string; synopsis: string; coverImage: string; genre: string; }) => {
    addBook(values);
    setAddDialogOpen(false);
  };

  const handleEditBook = (values: { title: string; author: string; synopsis: string; coverImage: string; genre: string; }) => {
    if (selectedBook) {
      updateBook({ ...selectedBook, ...values });
    }
    setEditDialogOpen(false);
    setSelectedBook(null);
  };

  const handleGenerateCover = async (book: Book) => {
    setGeneratingCoverBookId(book.id);
    try {
      const result = await generateBookCover({
        title: book.title,
        synopsis: book.synopsis,
      });
      if (result.coverImage) {
        updateBook({ ...book, coverImage: result.coverImage });
        toast({
          title: "Cover generated!",
          description: `AI cover for "${book.title}" has been created.`,
        });
      } else {
        throw new Error("AI did not return an image.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Cover Generation Failed",
        description: "Sorry, I couldn't generate a cover at this time.",
      });
    } finally {
      setGeneratingCoverBookId(null);
    }
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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add a New Book</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="manual">Manual</TabsTrigger>
              </TabsList>
              <TabsContent value="search">
                <BookSearch onBookSelect={(book) => {
                  addBook(book);
                  setAddDialogOpen(false);
                }} />
              </TabsContent>
              <TabsContent value="manual">
                <BookForm onSubmit={handleAddBook} onClose={() => setAddDialogOpen(false)} />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>
                  <Image
                    src={book.coverImage || "https://placehold.co/100x150.png"}
                    alt={`Cover of ${book.title}`}
                    width={50}
                    height={75}
                    className="rounded-sm object-cover"
                    data-ai-hint="book cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{book.status}</Badge>
                </TableCell>
                <TableCell>
                  {book.genre && <Badge variant="outline">{book.genre}</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleGenerateCover(book)}
                      disabled={generatingCoverBookId === book.id}
                      title="Generate AI Cover"
                    >
                      {generatingCoverBookId === book.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                      <span className="sr-only">Generate AI Cover</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(book)} title="Edit Book">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" title="Delete Book">
                          <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the book "{book.title}".
                          </Description>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteBook(book.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
