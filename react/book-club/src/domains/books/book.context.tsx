import { createContext, useContext, useEffect, useState } from 'react';
import type { Book, BookStatus } from './Book';
import { loadBooks, saveBooks } from './book.storage';
import { clearRaffle } from '../raffle/raffle.service';

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
      return prev.map(book => {        
        if (book.id !== id) {          
          if (nextStatus === 'LENDO' && book.status === 'LENDO') {
            return { ...book, status: 'LIDO' };
          }
          return book;
        }
        
        if (book.status === 'LIDO' && nextStatus === 'SUGERIDO') {
          return book;
        }

        return { ...book, status: nextStatus };
      });
    });
    
    if (nextStatus === 'LIDO') {
      clearRaffle();
    }
  }

  function removeBook(id: string) {
    setBooks(prev => {
      const bookToRemove = prev.find(book => book.id === id);
      
      if (bookToRemove?.status === 'LENDO' || bookToRemove?.status === 'LIDO') {
        return prev;
      }

      return prev.filter(book => book.id !== id);
    });
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
