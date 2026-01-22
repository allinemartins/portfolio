import { UI_TEXTS } from "../../constants/uiTexts";
import styles from "./Brand.module.css";

export function Brand() {
  return (
    <div className={styles.brand}>
      <span className={styles.brandMark} aria-hidden>
        <img src="/book.svg" alt="" />
      </span>
      <div>
        <div className={styles.brandName}>{UI_TEXTS.app.title}</div>
        <div className={styles.brandHint}>{UI_TEXTS.app.subtitle}</div>
      </div>
    </div>
  );
}