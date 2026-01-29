import type { ReactNode } from "react";
import { UI_TEXTS } from "../constants/uiTexts";
import styles from "./ClubGuard.module.css";

type Props = {
  isLoading: boolean;
  hasClub: boolean;
  children: ReactNode;
};

export function ClubGuard({ isLoading, hasClub, children }: Props) {
  if (isLoading) {
    return <div className={styles.muted}>{UI_TEXTS.messages.loadingClub}</div>;
  }

  if (!hasClub) {
    return <div className={styles.muted}>{UI_TEXTS.messages.noClubSelected}</div>;
  }

  return <>{children}</>;
}
