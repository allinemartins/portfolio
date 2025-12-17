import type { ReactNode } from 'react';
import styles from '../styles/components/Badge.module.css';

type Variant = 'read' | 'suggested' | 'next';

export function Badge({
  children,
  variant,
}: {
  children: ReactNode;
  variant: Variant;
}) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );
}