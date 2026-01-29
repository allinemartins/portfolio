import { useState } from "react";
import styles from "./BooksFilters.module.css";
import { UI_TEXTS } from "../constants/uiTexts";

export type BooksTab = "READ" | "SUGGESTED" | "READING" | "TOTAL";
export type BooksSort = "RATING_DESC" | "TITLE_ASC" | "TITLE_DESC";

export function BooksFilters(props: {
  tab: BooksTab;
  sort: BooksSort;
  query: string;
  counts: { read: number; suggested: number; reading: number; total: number };
  onTabChange: (t: BooksTab) => void;
  onSortChange: (s: BooksSort) => void;
  onQueryChange: (q: string) => void;
}) {
  const { tab, sort, query, counts, onTabChange, onSortChange, onQueryChange } = props;

  const [openAdvanced, setOpenAdvanced] = useState(false);
  const hasFilters = !!query.trim() || sort !== "RATING_DESC";

  function clearAdvanced() {
    onQueryChange("");
    onSortChange("RATING_DESC");
  }

  return (
    <section className={styles.wrap}>
      <div className={styles.headerRow}>
        <div className={styles.tabs}>
          <Tab active={tab === "READ"} onClick={() => onTabChange("READ")} label={`${UI_TEXTS.filters.read} (${counts.read})`} />
          <Tab active={tab === "SUGGESTED"} onClick={() => onTabChange("SUGGESTED")} label={`${UI_TEXTS.filters.suggested} (${counts.suggested})`} />
          <Tab active={tab === "READING"} onClick={() => onTabChange("READING")} label={`${UI_TEXTS.filters.reading} (${counts.reading})`} />
          <Tab active={tab === "TOTAL"} onClick={() => onTabChange("TOTAL")} label={`${UI_TEXTS.filters.total} (${counts.total})`} />
        </div>

        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.advancedBtn}
            onClick={() => setOpenAdvanced((v) => !v)}
            aria-expanded={openAdvanced}
          >
            {openAdvanced ? UI_TEXTS.filters.closeAdvancedSearch : UI_TEXTS.filters.advancedSearch}
            {hasFilters ? <span className={styles.badge}>●</span> : null}
          </button>

          {hasFilters && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={clearAdvanced}
            >
              {UI_TEXTS.filters.clearFilters}
            </button>
          )}
        </div>
      </div>

      {openAdvanced && (
        <div className={styles.advancedPanel}>
          <div className={styles.control}>
            <label className={styles.label}>{UI_TEXTS.filters.searchPlaceholder}</label>
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={UI_TEXTS.filters.searchPlaceholder}
              className={styles.input}
            />
          </div>

          <div className={styles.control}>
            <label className={styles.label}>{UI_TEXTS.filters.sortBy}</label>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as BooksSort)}
              className={styles.select}
            >
              <option value="RATING_DESC">{UI_TEXTS.filters.sortRatingDesc}</option>
              <option value="TITLE_ASC">{UI_TEXTS.filters.sortTitleAsc}</option>
              <option value="TITLE_DESC">{UI_TEXTS.filters.sortTitleDesc}</option>
            </select>
          </div>
        </div>
      )}
    </section>
  );
}

function Tab(props: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`${styles.tab} ${props.active ? styles.tabActive : ""}`}
    >
      {props.label}
    </button>
  );
}
