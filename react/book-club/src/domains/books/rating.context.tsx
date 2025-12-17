import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

export interface Rating {
  bookId: string;
  memberId: string;
  score: number;
}

interface RatingContextData {
  ratings: Rating[];
  rateBook(bookId: string, memberId: string, score: number): void;
}

const RatingContext = createContext<RatingContextData | null>(null);

export function RatingProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<Rating[]>([]);

  function rateBook(bookId: string, memberId: string, score: number) {
    setRatings(prev => {
      const existing = prev.find(
        r => r.bookId === bookId && r.memberId === memberId
      );

      if (existing) {
        return prev.map(r =>
          r === existing ? { ...r, score } : r
        );
      }

      return [...prev, { bookId, memberId, score }];
    });
  }

  return (
    <RatingContext.Provider value={{ ratings, rateBook }}>
      {children}
    </RatingContext.Provider>
  );
}

export function useRatings() {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error('useRatings must be used within RatingProvider');
  }
  return context;
}