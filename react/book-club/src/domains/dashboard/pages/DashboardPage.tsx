import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookContext } from '../../books/book.context';
import styles from './styles/DashboardPage.module.css';

export function DashboardPage() {
  const { books, updateStatus } = useBookContext();
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
      {/* 👋 Saudação */}
      <header className={styles.header}>
        <h2>Olá 👋</h2>
        <p>Bem-vinda ao Clube do Livro</p>
      </header>

      {/* 📖 Livro atual */}
      <section
        className={`${styles.card} ${currentBook ? styles.cardHighlight : ''}`}
      >
        <h3>📖 Livro atual</h3>

        {currentBook ? (
          <div className={styles.currentBook}>
            <div>
              <strong>{currentBook.title}</strong>
              <p>{currentBook.author}</p>

              <span className={styles.badge}>Lendo agora</span>

              <button
                className={styles.secondaryButton}
                onClick={() => updateStatus(currentBook.id, 'LIDO')}
              >
                Marcar como lido
              </button>
            </div>

            {currentBook.thumbnail && (
              <img
                src={currentBook.thumbnail}
                alt={currentBook.title}
                className={styles.cover}
              />
            )}
          </div>
        ) : (
          <p className={styles.muted}>
            Nenhum livro em leitura no momento 📭
          </p>
        )}
      </section>

      {/* 📊 Métricas */}
      <section className={styles.stats}>
        <StatCard label="Total de livros" value={summary.total} />
        <StatCard label="Livros lidos" value={summary.lidos} />
        <StatCard label="Lendo agora" value={summary.lendo} />
      </section>

      {/* 🎲 Sorteio */}
      <section className={styles.card}>
        <h3>🎲 Sorteio</h3>

        <p>
          Status:{' '}
          <strong
            className={
              hasReading
                ? styles.warning
                : hasSuggested
                  ? styles.success
                  : styles.muted
            }
          >
            {raffleStatus}
          </strong>
        </p>

        {!hasReading && hasSuggested && (
          <button
            className={styles.primaryButton}
            onClick={() => navigate('/raffle')}
          >
            Ir para sorteio
          </button>
        )}

        {hasReading && (
          <p className={styles.muted}>
            Finalize o livro atual para liberar um novo sorteio.
          </p>
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
