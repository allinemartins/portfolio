import { useState } from "react";
import styles from "./StarRating.module.css";
import { UI_TEXTS } from "../constants/uiTexts";

export function StarRating({
  disabled,
  onRate,
  busy,
}: {
  disabled: boolean;
  onRate: (rating: number) => void;
  busy: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className={styles.stars} aria-label={UI_TEXTS.aria.starRating}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hover ?? 0) >= n;

        return (
          <button
            key={n}
            type="button"
            className={`${styles.starBtn} ${
              filled ? styles.starFilled : styles.starEmpty
            }`}
            disabled={disabled}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onRate(n)}
            title={`${n} estrela${n > 1 ? "s" : ""}`}
            aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
          >
            {busy ? "…" : "★"}
          </button>
        );
      })}
    </div>
  );
}
