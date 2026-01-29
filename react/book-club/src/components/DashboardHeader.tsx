import styles from "./DashboardHeader.module.css";
import { useAuth } from "../auth/AuthProvider";
import { UI_TEXTS } from "../constants/uiTexts";

export function DashboardHeader({ clubName }: { clubName: string }) {  
  const welcomeMessage = getWelcomeMessage();  
  return (
    <header className={styles.header}>
      <h2 className={styles.title}>{welcomeMessage} 👋</h2>
      <p className={styles.subtitle}>        
        {UI_TEXTS.club.currentClub}: <b>{clubName}</b>
      </p>
    </header>
  );
}

function getWelcomeMessage() {
  const { user } = useAuth();
  return UI_TEXTS.club.messageMember.replace("{name}", 
    user?.name ?? user?.username ?? UI_TEXTS.club.user
  );
}
