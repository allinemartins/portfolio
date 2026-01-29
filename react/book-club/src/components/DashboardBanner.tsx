import styles from "./DashboardBanner.module.css";

export function DashboardBanner({ text }: { text: string | null }) {
  if (!text) return null;
  return <div className={styles.banner}>{text}</div>;
}
