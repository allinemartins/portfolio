import { BookCard } from "./BookCard";
import type { BookResponse } from "../api/books";
import styles from "./BooksList.module.css";
import { UI_TEXTS } from "../constants/uiTexts";
import { useBooksProgressSummaries } from "../hooks/useBooksProgressSummaries";

export function BooksList(props: {
  clubId: string;
  title: string;
  items: BookResponse[];
  busyId: string | null;
  onFinish: (id: string) => void;
  onDelete: (id: string) => void;
  onRate: (id: string, rating: number) => void;

  withSummaries?: boolean;
  getItemClassName?: (book: BookResponse) => string | undefined;
  renderExtra?: (book: BookResponse) => React.ReactNode;
  hideDelete?: boolean;
}) {
  const {
    clubId,
    title,
    items,
    busyId,
    onFinish,
    onDelete,
    onRate,
    withSummaries = true,
    getItemClassName,
    renderExtra,
    hideDelete,
  } = props;

  const { summariesByBookId } = useBooksProgressSummaries(
    clubId,
    withSummaries ? items : []
  );

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.count}>
          {items.length} {UI_TEXTS.book.books}
        </span>
      </header>

      <div className={styles.list}>
        {items.length === 0 ? (
          <div className={styles.empty}>{UI_TEXTS.book.noBooksInCategory}</div>
        ) : (
          items.map((b) => (
            <BookCard
              key={b.id}
              book={b}
              summary={withSummaries ? summariesByBookId[b.id] : undefined}
              busy={busyId === b.id}
              onFinish={() => onFinish(b.id)}
              onDelete={() => onDelete(b.id)}
              onRate={(rating) => onRate(b.id, rating)}
              className={getItemClassName?.(b)}
              extra={renderExtra?.(b)}
              hideDelete={hideDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}
