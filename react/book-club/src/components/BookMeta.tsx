import { UI_TEXTS } from "../constants/uiTexts";
import styles from "./BookMeta.module.css";

type Props = {
  title: string;
  author: string;
  ratingText: string;
  finishedCount: number;
  totalMembers: number;
  progressPct: number;
};

export function BookMeta({
  title,
  author,
  ratingText,
  finishedCount,
  totalMembers,
  progressPct,
}: Props) {
  return (
    <div className={styles.meta}>
      <div className={styles.titleRow}>
        <h3 className={styles.title} title={title}>
          {title}
        </h3>
      </div>

      <p className={styles.author}>{author}</p>

      <div className={styles.chips}>
        <span className={styles.chip} title={UI_TEXTS.book.ratingClub}>
          ⭐ {ratingText}
        </span>
        <span className={styles.chip} title={UI_TEXTS.book.finishClub}>
          ✅ {finishedCount}/{totalMembers || "—"} {UI_TEXTS.book.finished}
        </span>
      </div>

      <div className={styles.progressWrap} aria-label={UI_TEXTS.club.progress}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>{UI_TEXTS.club.progress}</span>
          <span className={styles.progressValue}>
            {totalMembers ? `${progressPct}%` : "—"}
          </span>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
