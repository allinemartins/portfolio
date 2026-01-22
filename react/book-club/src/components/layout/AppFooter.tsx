import { UI_TEXTS } from "../../constants/uiTexts";
import { formatLastAccess } from "../../helpers";
import styles from "./AppFooter.module.css";

type Props = { lastAccess?: string };

export function AppFooter({ lastAccess }: Props) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeft}>
        <span className={styles.footerBrand}>{UI_TEXTS.app.title}</span>
        <span className={styles.footerMuted}>© {new Date().getFullYear()}</span>
      </div>

      <div className={styles.footerRight}>
        <span className={styles.footerMuted}>
          {lastAccess ? `${UI_TEXTS.messages.lastAccess.replace("{dateTime}", formatLastAccess(lastAccess))}` : ""}
        </span>
      </div>
    </footer>
  );
}