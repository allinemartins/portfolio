import type { Book } from './Book';

const STORAGE_KEY = 'clubinho_books';

export function loadBooks(): Book[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveBooks(books: Book[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}