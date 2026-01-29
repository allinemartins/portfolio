import styles from "./CurrentBookSection.module.css";
import type { BookProgressSummaryResponse, BookResponse, BusyAction } from "../api/books";
import { CurrentBookCard } from "./CurrentBookCard";
import { UI_TEXTS } from "../constants/uiTexts";

export function CurrentBookSection({
  isLoading,
  current,
  summary,
  busyAction,
  onFinish,
  onRate,
}: {
  isLoading: boolean;
  current: BookResponse | null;
  summary?: BookProgressSummaryResponse;
  busyAction: BusyAction;
  onFinish: () => Promise<void>;
  onRate: (rating: number) => Promise<void>;
}) {
  const hasFinished = summary?.hasFinished ?? false;

  return (
    <section className={styles.card}>
      <h3 className={styles.title}>📖 {UI_TEXTS.book.currentBook}</h3>

      {isLoading ? (
        <p className={styles.muted}>{UI_TEXTS.messages.loading}</p>
      ) : current ? (
        <div className={styles.body}>
          <CurrentBookCard
            book={current}
            summary={summary}
            onFinish={onFinish}
            onRate={onRate}
            busyAction={busyAction}
            disableFinish={hasFinished || busyAction !== null}
            disableRate={!hasFinished || busyAction !== null}
          />
        </div>
      ) : (
        <p className={styles.muted}>{UI_TEXTS.book.noReadBooks}</p>
      )}
    </section>
  );
}
