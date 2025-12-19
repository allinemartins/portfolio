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
        // não é o livro alvo
        if (book.id !== id) {
          // se alguém virar LENDO, finaliza o outro que estava lendo
          if (nextStatus === 'LENDO' && book.status === 'LENDO') {
            return { ...book, status: 'LIDO' };
          }
          return book;
        }

        // 🔒 REGRA 1: livro LIDO nunca volta para SUGERIDO
        if (book.status === 'LIDO' && nextStatus === 'SUGERIDO') {
          return book;
        }

        return { ...book, status: nextStatus };
      });
    });

    // 🧹 Limpa sorteio SOMENTE quando a leitura é finalizada
    if (nextStatus === 'LIDO') {
      clearRaffle();
    }
  }

  function removeBook(id: string) {
    setBooks(prev => {
      const bookToRemove = prev.find(book => book.id === id);

      // 🔒 REGRA: não permitir excluir livro em leitura
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
