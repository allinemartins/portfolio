import { createContext, useContext, useEffect, useState } from 'react';
import type { Book, BookStatus } from './Book';
import { loadBooks, saveBooks } from './book.storage';

type BookContextType = {
  books: Book[];
  addBook: (book: Omit<Book, 'id'>) => void;
  updateStatus: (id: string, status: BookStatus) => void;
  removeBook: (id: string) => void;
};

const BookContext = createContext({} as BookContextType);

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(loadBooks());
  }, []);

  useEffect(() => {
    saveBooks(books);
  }, [books]);

  function addBook(book: Omit<Book, 'id'>) {
    setBooks(prev => [...prev, { ...book, id: crypto.randomUUID() }]);
  }

  function updateStatus(id: string, nextStatus: BookStatus) {
    setBooks(prev => {
      // se alguém virar LENDO
      if (nextStatus === 'LENDO') {
        return prev.map(book => {
          if (book.id === id) {
            return { ...book, status: 'LENDO' };
          }

          // se já estava lendo outro, finaliza
          if (book.status === 'LENDO') {
            return { ...book, status: 'LIDO' };
          }

          return book;
        });
      }

      // outros fluxos normais
      return prev.map(book =>
        book.id === id ? { ...book, status: nextStatus } : book
      );
    });
  }

  function removeBook(id: string) {
    setBooks(prev => prev.filter(book => book.id !== id));
  }

  return (
    <BookContext.Provider
      value={{ books, addBook, updateStatus, removeBook }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBookContext() {
  return useContext(BookContext);
}
