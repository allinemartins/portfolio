import type { BookResponse } from "../api/books";
import { BooksList } from "./BooksList";

export function BooksListBlock(props: {
  clubId: string;
  title: string;
  items: BookResponse[];
  busyId: string | null;
  onFinish: (id: string) => void;
  onDelete: (id: string) => void;
  onRate: (id: string, rating: number) => void;
}) {
  return <BooksList {...props} />;
}