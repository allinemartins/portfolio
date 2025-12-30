import { createContext, useContext, useState } from 'react';
import type{ Book, BookStatus } from './Book';
import { clearRaffle } from '../raffle/raffle.service';
import { useMemberContext } from '../members/member.context';

type BookContextType = {
  books: Book[];
  updateStatus: (id: string, nextStatus: BookStatus) => void;
  removeBook: (id: string) => void;
  markAsReadByMember: (bookId: string) => void; // 🆕
};

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const { currentMember } = useMemberContext();

  function updateStatus(id: string, nextStatus: BookStatus) {
    setBooks(prev =>
      prev.map(book => {
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
      })
    );

    if (nextStatus === 'LIDO') {
      clearRaffle();
    }
  }

  function removeBook(id: string) {
    setBooks(prev => {
      const book = prev.find(b => b.id === id);
      if (book?.status === 'LENDO') return prev;
      return prev.filter(b => b.id !== id);
    });
  }

    function markAsReadByMember(bookId: string) {
    if (!currentMember) return;

    setBooks(prev =>
      prev.map(book => {
        if (book.id !== bookId) return book;

        const progress = book.progress ?? [];

        const alreadyFinished = progress.some(
          p => p.memberEmail === currentMember.email
        );

        if (alreadyFinished) return book;

        return {
          ...book,
          progress: [
            ...progress,
            {
              memberEmail: currentMember.email,
              finished: true,
            },
          ],
        };
      })
    );
  }

  return (
    <BookContext.Provider
      value={{
        books,
        updateStatus,
        removeBook,
        markAsReadByMember,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBookContext() {
  const ctx = useContext(BookContext);
  if (!ctx) {
    throw new Error('useBookContext must be used within BookProvider');
  }
  return ctx;
}
