import styles from "./DashboardError.module.css";
import { UI_TEXTS } from "../constants/uiTexts";

export function DashboardError({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className={styles.box}>
      <b>{UI_TEXTS.messages.errorGeneric}</b> {message}
    </div>
  );
}
