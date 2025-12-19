import type { Book, BookStatus } from '../Book';
import { useBookContext } from '../book.context';

export function BookCard({ book }: { book: Book }) {
  const { updateStatus, removeBook } = useBookContext();

  /*function allowedOptions(): BookStatus[] {
    if (book.status === 'SUGERIDO') return ['LENDO', 'LIDO'];
    if (book.status === 'LENDO') return ['LIDO'];
    return ['LIDO'];
  }*/

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        border: '1px solid #e5e7eb',
        padding: 12,
        alignItems: 'center',
      }}
    >
      {book.thumbnail && (
        <img src={book.thumbnail} alt={book.title} width={60} />
      )}

      <div style={{ flex: 1 }}>
        <strong>{book.title}</strong>
        <p>{book.author}</p>

        <select
          value={book.status}
          onChange={e =>
            updateStatus(book.id, e.target.value as BookStatus)
          }
        >
          <option value="SUGERIDO">Sugerido</option>
          <option value="LENDO">Lendo</option>
          <option value="LIDO">Lido</option>
        </select>
      </div>
      
      <button
        onClick={() => removeBook(book.id)}
        aria-label="Excluir livro"
        disabled={book.status === 'LENDO' || book.status === 'LIDO'}
      >
        🗑️
      </button>
    </div>
  );
}
