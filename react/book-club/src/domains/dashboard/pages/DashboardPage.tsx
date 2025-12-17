import { useMemo } from 'react';
import { useBookContext } from '../../books/book.context';
import styles from './styles/DashboardPage.module.css';

export function DashboardPage() {
  const { books } = useBookContext();

  const summary = useMemo(() => ({
    total: books.length,
    lidos: books.filter(b => b.status === 'LIDO').length,
    lendo: books.filter(b => b.status === 'LENDO').length,
  }), [books]);

  const currentBook = useMemo(
    () => books.find(b => b.status === 'LENDO'),
    [books]
  );

  return (
    <div className={styles.container}>
      {/* 👋 Saudação */}
      <header className={styles.header}>
        <h2>Olá 👋</h2>
        <p>Bem-vinda ao Clube do Livro</p>
      </header>

      {/* 📖 Livro atual */}
      <section className={styles.card}>
        <h3>📖 Livro atual</h3>

        {currentBook ? (
          <div className={styles.currentBook}>
            <div>
              <strong>{currentBook.title}</strong>
              <p>{currentBook.author}</p>
              <span className={styles.badge}>Em leitura</span>
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
          <p className={styles.muted}>Nenhum livro em leitura</p>
        )}
      </section>

      {/* 📊 Métricas */}
      <section className={styles.stats}>
        <StatCard label="Livros no clube" value={summary.total} />
        <StatCard label="Livros lidos" value={summary.lidos} />
        <StatCard label="Em leitura" value={summary.lendo} />
      </section>

      {/* 🎲 Sorteio */}
      <section className={styles.card}>
        <h3>🎲 Sorteio</h3>
        <p>Status: <strong>Aguardando sugestões</strong></p>

        <button className={styles.primaryButton}>
          Ir para sorteio
        </button>
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
