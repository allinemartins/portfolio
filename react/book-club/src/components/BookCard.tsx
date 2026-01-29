import type { BookProgressSummaryResponse, BookResponse } from "../api/books";
import { UI_TEXTS } from "../constants/uiTexts";
import styles from "./BookCard.module.css";
import { StarRating } from "./StarRating";

export function BookCard(props: {
  book: BookResponse;
  summary?: BookProgressSummaryResponse;
  busy: boolean;
  onFinish: () => void;
  onDelete: () => void;
  onRate: (rating: number) => void;

  className?: string;
  hideDelete?: boolean;
  extra?: React.ReactNode;
}) {
  const {
    book: b,
    summary,
    busy,
    onFinish,
    onDelete,
    onRate,
    className,
    hideDelete,
    extra,
  } = props;

  const isSuggested = b.status === "SUGGESTED";
  const isReading = b.status === "READING";
  const isRead = b.status === "READ";

  const canDelete = isSuggested && !hideDelete;

  const summaryReady = !isReading && !isRead ? true : !!summary;
  const canFinish = isReading && summaryReady && summary?.hasFinished !== true;

  const canRate =
    summaryReady && summary?.hasFinished === true && summary?.hasRated !== true;

  const ratingsCount = b.ratingsCount ?? 0;
  const totalMembers = summary?.totalMembers ?? 0;
  const ratingsPct =
    summaryReady && totalMembers > 0
      ? Math.round((ratingsCount / totalMembers) * 100)
      : 0;

  const avgText = b.avgRating == null ? "—" : b.avgRating.toFixed(1);

  return (
    <div className={[styles.card, className ?? ""].join(" ").trim()}>
      <div className={styles.left}>
        {b.imageUrl ? (
          <img className={styles.cover} src={b.imageUrl} alt={b.title} />
        ) : (
          <div className={styles.coverFallback} aria-hidden />
        )}

        <div className={styles.meta}>
          <div className={styles.title}>{b.title}</div>
          <div className={styles.author}>{b.author}</div>

          <div className={styles.badges}>
            <span className={styles.badge}>
              {UI_TEXTS.book.status}: <b>{b.status}</b>
            </span>

            {isRead && <span className={styles.badge}>⭐ {avgText}</span>}

            {(isRead || isReading) && summaryReady && totalMembers > 0 && (
              <span className={styles.badge}>
                🧑‍🤝‍🧑 {ratingsCount}/{totalMembers} {UI_TEXTS.book.ratings} •{" "}
                {ratingsPct}%
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        {(isRead || isReading) && (
          <div className={styles.rateBox}>
            <StarRating
              disabled={busy || !summaryReady || !canRate}
              busy={busy}
              onRate={onRate}
            />

            {!summaryReady && (
              <div className={styles.muted}>{UI_TEXTS.messages.loading}</div>
            )}

            {summaryReady && summary?.hasRated && (
              <div className={styles.muted}>
                {UI_TEXTS.messages.clickToUpdateRate}
              </div>
            )}

            {summaryReady && !summary?.hasFinished && (
              <div className={styles.muted}>{UI_TEXTS.book.finishBook}</div>
            )}
          </div>
        )}

        {isReading && (
          <button
            className={styles.btn}
            disabled={busy || !summaryReady || !canFinish}
            onClick={onFinish}
          >
            {busy ? "…" : summary?.hasFinished ? "✔️" : UI_TEXTS.book.finish}
          </button>
        )}

        {canDelete && (
          <button
            className={`${styles.btn} ${styles.danger}`}
            disabled={busy}
            onClick={onDelete}
          >
            {busy ? "…" : UI_TEXTS.buttons.delete}
          </button>
        )}
      </div>

      {extra ? <div>{extra}</div> : null}
    </div>
  );
}
