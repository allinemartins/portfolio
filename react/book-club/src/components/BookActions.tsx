import { UI_TEXTS } from "../constants/uiTexts";
import styles from "./BookActions.module.css";
import { StarRating } from "./StarRating";
import type { BookProgressSummaryResponse, BusyAction } from "../api/books";

type Props = {
  summary?: BookProgressSummaryResponse;
  onFinish: () => void;
  onRate: (rating: number) => void;
  busyAction: BusyAction;
  disableFinish: boolean;
  disableRate: boolean;
};

function getRateHint(summary?: BookProgressSummaryResponse) {
  if (!summary?.hasFinished) return UI_TEXTS.messages.firstFinishBook;
  if (summary?.hasRated) return UI_TEXTS.messages.clickToUpdateRate;
  return UI_TEXTS.messages.clickToRate;
}

export function BookActions({
  summary,
  onFinish,
  onRate,
  busyAction,
  disableFinish,
  disableRate,
}: Props) {
  return (
    <div className={styles.actions}>
      {summary?.hasFinished ? (
        <div className={`${styles.badge} ${styles.badgeDone}`}>
          ✅ {UI_TEXTS.book.finishBookMsg}
        </div>
      ) : (
        <button
          className={styles.primaryBtn}
          onClick={onFinish}
          disabled={disableFinish}
        >
          {busyAction === "finish" ? UI_TEXTS.messages.saving : UI_TEXTS.book.finish}
        </button>
      )}

      <div className={styles.rateBox}>
        <div className={styles.rateHeader}>
          <span className={styles.rateLabel}>{UI_TEXTS.book.rate}</span>
          {summary?.hasRated && (
            <span className={`${styles.badge} ${styles.badgeMuted}`}>
              {UI_TEXTS.messages.alreadyRated}
            </span>
          )}
        </div>

        <StarRating
          disabled={disableRate}
          onRate={onRate}
          busy={busyAction === "rate"}
        />

        <small className={styles.hint}>{getRateHint(summary)}</small>
      </div>
    </div>
  );
}
