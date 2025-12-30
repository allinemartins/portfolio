import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookContext } from '../../books/book.context';
import styles from './styles/DashboardPage.module.css';

export function DashboardPage() {
  const { books, markAsReadByMember } = useBookContext();
  const navigate = useNavigate();

  const summary = useMemo(() => ({
    total: books.length,
    lidos: books.filter(b => b.status === 'LIDO').length,
    lendo: books.filter(b => b.status === 'LENDO').length,
  }), [books]);

  const currentBook = useMemo(
    () => books.find(b => b.status === 'LENDO'),
    [books]
  );

  const hasSuggested = books.some(b => b.status === 'SUGERIDO');
  const hasReading = summary.lendo > 0;

  const raffleStatus = hasReading
    ? 'Livro em leitura'
    : hasSuggested
      ? 'Pronto para sorteio'
      : 'Aguardando sugestões';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Olá 👋</h2>
        <p>Bem-vinda ao Clube do Livro</p>
      </header>

      <section className={styles.card}>
        <h3>📖 Livro atual</h3>

        {currentBook ? (
          <>
            <strong>{currentBook.title}</strong>
            <p>{currentBook.author}</p>

            <button
              className={styles.secondaryButton}
              onClick={() => markAsReadByMember(currentBook.id)}
            >
              Marquei como lido
            </button>
          </>
        ) : (
          <p className={styles.muted}>Nenhum livro em leitura</p>
        )}
      </section>

      <section className={styles.stats}>
        <StatCard label="Total" value={summary.total} />
        <StatCard label="Lidos" value={summary.lidos} />
        <StatCard label="Lendo" value={summary.lendo} />
      </section>

      <section className={styles.card}>
        <h3>🎲 Sorteio</h3>
        <p>Status: <strong>{raffleStatus}</strong></p>

        {!hasReading && hasSuggested && (
          <button
            className={styles.primaryButton}
            onClick={() => navigate('/raffle')}
          >
            Ir para sorteio
          </button>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.statCard}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
