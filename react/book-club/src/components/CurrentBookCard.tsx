import { useMemo } from "react";
import { UI_TEXTS } from "../constants/uiTexts";
import styles from "./CurrentBookCard.module.css";
import type { BookProgressSummaryResponse, BookResponse, BusyAction } from "../api/books";

import { BookCover } from "./BookCover";
import { BookMeta } from "./BookMeta";
import { BookActions } from "./BookActions";

type Props = {
  book: BookResponse;
  summary?: BookProgressSummaryResponse;
  onFinish: () => void;
  onRate: (rating: number) => void;
  busyAction: BusyAction;
  disableFinish: boolean;
  disableRate: boolean;
};

export function CurrentBookCard({
  book,
  summary,
  onFinish,
  onRate,
  busyAction,
  disableFinish,
  disableRate,
}: Props) {
  const finishedCount = summary?.finishedCount ?? 0;
  const totalMembers = summary?.totalMembers ?? 0;

  const ratingText =
    book.avgRating == null
      ? UI_TEXTS.book.noRating
      : `${book.avgRating.toFixed(1)} (${book.ratingsCount ?? 0})`;

  const progressPct = useMemo(() => {
    if (!totalMembers) return 0;
    return Math.round((finishedCount / totalMembers) * 100);
  }, [finishedCount, totalMembers]);

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <BookCover imageUrl={book.imageUrl} title={book.title} />

        <BookMeta
          title={book.title}
          author={book.author}
          ratingText={ratingText}
          finishedCount={finishedCount}
          totalMembers={totalMembers}
          progressPct={progressPct}
        />
      </div>

      <BookActions
        summary={summary}
        onFinish={onFinish}
        onRate={onRate}
        busyAction={busyAction}
        disableFinish={disableFinish}
        disableRate={disableRate}
      />
    </article>
  );
}
