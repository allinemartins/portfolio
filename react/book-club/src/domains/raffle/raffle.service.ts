import type { Book } from '../books/Book';

const STORAGE_KEY = 'bookclub:raffle';

export type RaffleResult = {
  book: Book;
  date: string;
};

export function getRaffleResult(): RaffleResult | null {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function runRaffle(books: Book[]): RaffleResult {
  const suggestedBooks = books.filter(
    (book) => book.status === 'SUGERIDO'
  );

  if (suggestedBooks.length === 0) {
    throw new Error('No suggested books available');
  }

  const winner =
    suggestedBooks[Math.floor(Math.random() * suggestedBooks.length)];

  const result: RaffleResult = {
    book: winner,
    date: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  return result;
}

export function clearRaffle() {
  localStorage.removeItem(STORAGE_KEY);
}
