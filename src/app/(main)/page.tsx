"use client";

import { useBooks } from "@/contexts/BookProvider";
import { BookCard } from "@/components/BookCard";
import { PageHeader } from "@/components/PageHeader";
import { BookCheck, BookOpen, BookPlus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function MyBooksPage() {
  const { books } = useBooks();

  const currentlyReading = books.filter(
    (book) => book.status === "Currently Reading"
  );
  const toRead = books.filter((book) => book.status === "To Read");
  const read = books.filter((book) => book.status === "Read");

  return (
    <div className="container mx-auto">
      <PageHeader
        title="My Books"
        description="Track your reading journey."
      />

      <div className="space-y-12">
        <section>
          <h2 className="flex items-center gap-3 mb-6 text-2xl font-semibold font-headline">
            <BookOpen className="w-6 h-6 text-accent" />
            Currently Reading
          </h2>
          {currentlyReading.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence>
                {currentlyReading.map((book, index) => (
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <BookCard book={book} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <p className="text-muted-foreground">No books in this section. Start reading!</p>
          )}
        </section>

        <section>
          <h2 className="flex items-center gap-3 mb-6 text-2xl font-semibold font-headline">
            <BookPlus className="w-6 h-6 text-accent" />
            To Read
          </h2>
          {toRead.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence>
                {toRead.map((book, index) => (
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <BookCard book={book} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <p className="text-muted-foreground">Your reading list is empty. Add some books in the admin panel.</p>
          )}
        </section>

        <section>
          <h2 className="flex items-center gap-3 mb-6 text-2xl font-semibold font-headline">
            <BookCheck className="w-6 h-6 text-accent" />
            Read
          </h2>
          {read.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence>
                {read.map((book, index) => (
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <BookCard book={book} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <p className="text-muted-foreground">You haven't finished any books yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
