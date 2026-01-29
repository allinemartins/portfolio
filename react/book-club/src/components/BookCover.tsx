import { UI_TEXTS } from "../constants/uiTexts";
import styles from "./BookCover.module.css";

export function BookCover({
  imageUrl,
  title,
}: {
  imageUrl?: string | null;
  title: string;
}) {
  return (
    <div className={styles.cover}>
      {imageUrl ? (
        <img
          className={styles.coverImg}
          src={imageUrl}
          alt={`${UI_TEXTS.book.cover} ${title}`}
        />
      ) : (
        <div className={styles.coverFallback} aria-label={UI_TEXTS.book.noCover}>
          <span className={styles.coverIcon}>📘</span>
        </div>
      )}
    </div>
  );
}
