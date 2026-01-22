import styles from "./ClubSelect.module.css";
import { UI_TEXTS } from "../../constants/uiTexts";

type Props = {
  isLoading: boolean;
  value: string;
  options: { clubId: string; clubName: string }[];
  onChange: (clubId: string) => void;
};

export function ClubSelect({ isLoading, value, options, onChange }: Props) {
  if (isLoading) return <span className={styles.muted}>{UI_TEXTS.messages.loading}</span>;

  return (
    <select
      className={styles.select}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={UI_TEXTS.aria.selectClub}
    >
      {options.map((m) => (
        <option key={m.clubId} value={m.clubId}>
          {m.clubName}
        </option>
      ))}
    </select>
  );
}
