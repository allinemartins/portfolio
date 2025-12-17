import type { Book } from './Book';

const BOOKS_KEY = 'clubinho_books';
const BOOK_FILTER_KEY = 'clubinho_books_filter';

/* =======================
   BOOKS
======================= */

export function loadBooks(): Book[] {
  const data = localStorage.getItem(BOOKS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveBooks(books: Book[]) {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

/* =======================
   FILTER
======================= */

export function loadBookFilter() {
  return localStorage.getItem(BOOK_FILTER_KEY) ?? 'ALL';
}

export function saveBookFilter(filter: string) {
  localStorage.setItem(BOOK_FILTER_KEY, filter);
}
