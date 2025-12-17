import type { BookFilter } from '../Book';
import styles from './styles/BookStatusTabs.module.css';

type Counters = {
  ALL: number;
  SUGERIDO: number;
  LENDO: number;
  LIDO: number;
};


type Props = {
  value: BookFilter;
  onChange: (value: BookFilter) => void;
  counters: Counters;
};

export function BookStatusTabs({ value, onChange, counters }: Props) {
  return (
    <div className={styles.container}>
      <Tab label={`Todos (${counters.ALL})`} active={value === 'ALL'} onClick={() => onChange('ALL')} />
      <Tab
        label={`Sugeridos (${counters.SUGERIDO})`}
        active={value === 'SUGERIDO'}
        onClick={() => onChange('SUGERIDO')}
      />
      <Tab
        label={`Lendo (${counters.LENDO})`}
        active={value === 'LENDO'}
        onClick={() => onChange('LENDO')}
      />
      <Tab
        label={`Lidos (${counters.LIDO})`}
        active={value === 'LIDO'}
        onClick={() => onChange('LIDO')}
      />
    </div>
  );
}

function Tab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`${styles.tab} ${active ? styles.active : ''}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
