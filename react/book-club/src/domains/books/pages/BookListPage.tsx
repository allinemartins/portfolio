import { useEffect, useMemo, useState } from 'react';
import { BookForm } from '../components/BookForm';
import { BookList } from '../components/BookList';
import { BookStatusTabs } from '../components/BookStatusTabs';
import type { BookStatus } from '../Book';
import { useBookContext } from '../book.context';
import { loadBookFilter, saveBookFilter } from '../book.storage';

type BookFilter = 'ALL' | BookStatus;

export function BookListPage() {
  const { books } = useBookContext();
  const [filter, setFilter] = useState<BookFilter>('ALL');
  
  useEffect(() => {
    setFilter(loadBookFilter() as BookFilter);
  }, []);
  
  useEffect(() => {
    saveBookFilter(filter);
  }, [filter]);
  const counters = useMemo(() => {
    return {
      ALL: books.length,
      SUGERIDO: books.filter(b => b.status === 'SUGERIDO').length,
      LENDO: books.filter(b => b.status === 'LENDO').length,
      LIDO: books.filter(b => b.status === 'LIDO').length,
    };
  }, [books]);

  return (
    <>
      <h2>📚 Livros do Clube</h2>

      <BookForm />

      <BookStatusTabs
        value={filter}
        onChange={setFilter}
        counters={counters}
      />

      <BookList filter={filter} />
    </>
  );
}
