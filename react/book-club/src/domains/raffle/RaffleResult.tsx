import { useEffect, useState } from 'react';
import { useBookContext } from '../books/book.context';
import {
  getRaffleResult,
  runRaffle,
  type RaffleResult as RaffleResultType,
} from './raffle.service';

export function RaffleResult() {
  const { books, updateStatus } = useBookContext();
  const [result, setResult] = useState<RaffleResultType | null>(null);
  const [error, setError] = useState('');

  const hasReadingBook = books.some(
    (book) => book.status === 'LENDO'
  );

  useEffect(() => {
    setResult(getRaffleResult());
  }, []);

  function handleRaffle() {
    if (hasReadingBook) return;

    try {
      const newResult = runRaffle(books);
      updateStatus(newResult.book.id, 'LENDO');
      setResult(newResult);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (hasReadingBook && !result) {
    return (
      <div>
        <h2>📘 Livro em leitura</h2>
        <p>
          Já existe um livro em leitura no momento.
          Finalize-o antes de realizar um novo sorteio.
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <div>
        <h2>🎉 Livro Sorteado</h2>

        <p><strong>{result.book.title}</strong></p>
                
      </div>
    );
  }

  return (
    <div>
      <h2>🎲 Sorteio do Livro</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleRaffle}>
        Sortear livro
      </button>
    </div>
  );
}
