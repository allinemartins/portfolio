import styles from "./UserBar.module.css";
import { UI_TEXTS } from "../../constants/uiTexts";

type Props = {
  displayName: string;
  onLogout: () => void;
};

export function UserBar({ displayName, onLogout }: Props) {
  return (
    <div className={styles.headerUserBar} aria-label={UI_TEXTS.aria.userArea}>
      <span className={styles.headerUserName}>{displayName}</span>
      <button className={styles.headerLogoutBtn} type="button" onClick={onLogout}>
        {UI_TEXTS.buttons.logout}
      </button>
    </div>
  );
}