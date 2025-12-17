import type { ReactNode } from 'react';
import styles from '../../domains/books/components/styles/BookCard.module.css';

export function Card({ children }: { children: ReactNode }) {
  return <div className={styles.card}>{children}</div>;
}