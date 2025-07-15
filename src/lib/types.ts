export type BookStatus = "To Read" | "Currently Reading" | "Read";

export interface Book {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  status: BookStatus;
  coverImage?: string;
  genre?: string;
  finishedDate?: Date | null;
}
