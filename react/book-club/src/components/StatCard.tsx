import styles from "./StatCard.module.css";

export function StatCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{loading ? "…" : value}</div>
    </div>
  );
}
