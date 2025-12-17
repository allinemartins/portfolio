import { useBookContext } from '../book.context';
import { BookCard } from './BookCard';
import type { BookFilter } from '../Book';

export function BookList({ filter }: { filter: BookFilter }) {
  const { books } = useBookContext();

  const filteredBooks =
    filter === 'ALL'
      ? books
      : books.filter(book => book.status === filter);

  if (filteredBooks.length === 0) {
    return <p>Nenhum livro encontrado.</p>;
  }

  return (
    <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
      {filteredBooks.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}