import styles from "./StatsSection.module.css";
import { StatCard } from "./StatCard";
import { UI_TEXTS } from "../constants/uiTexts";

export function StatsSection({
  stats,
  isLoading,
}: {
  stats: { total: number; read: number; reading: number };
  isLoading: boolean;
}) {
  return (
    <section className={styles.grid}>
      <StatCard label={UI_TEXTS.dashboard.total} value={stats.total} loading={isLoading} />
      <StatCard label={UI_TEXTS.dashboard.read} value={stats.read} loading={isLoading} />      
    </section>
  );
}
