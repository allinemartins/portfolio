import styles from "./BookSuggestForm.module.css";
import { useBookSuggestForm } from "../hooks/useBookSuggestForm";
import { UI_TEXTS } from "../constants/uiTexts";

export function BookSuggestForm(props: {
  clubId: string;
  onCreated: () => void;
  onError: (msg: string) => void;
}) {
  
  const form = useBookSuggestForm(props);

  return (
    <section className={styles.card}>
      <h3 className={styles.h3}>{UI_TEXTS.bookSuggestForm.title}</h3>

      <div className={styles.searchBox}>
        <label className={styles.label}>{UI_TEXTS.bookSuggestForm.searchLabel}</label>
        <input
          value={form.q}
          onChange={(e) => form.setQ(e.target.value)}
          placeholder={UI_TEXTS.bookSuggestForm.searchPlaceholder}
          className={styles.input}
        />

        {form.sLoading && (
          <div className={styles.muted}>{UI_TEXTS.bookSuggestForm.searchLoading}</div>
        )}

        {!!form.suggestions.length && (
          <div className={styles.suggestions}>
            {form.suggestions.map((s, idx) => (
              <button
                key={`${s.title}-${idx}`}
                type="button"
                onClick={() => form.applySuggestion(s)}
                className={styles.suggestionBtn}
              >
                <div className={styles.sTitle}>{s.title}</div>
                <div className={styles.sAuthor}>{s.author}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.submit();
        }}
        className={styles.form}
      >
        <input
          value={form.title}
          onChange={(e) => form.setTitle(e.target.value)}
          placeholder={UI_TEXTS.bookSuggestForm.titleBook}
          required
          className={styles.input}
        />
        <input
          value={form.author}
          onChange={(e) => form.setAuthor(e.target.value)}
          placeholder={UI_TEXTS.bookSuggestForm.author}
          required
          className={styles.input}
        />
        <input
          value={form.imageUrl ?? ""}
          onChange={(e) =>
            form.setImageUrl(e.target.value || null)
          }
          placeholder={UI_TEXTS.bookSuggestForm.imageUrl}
          className={styles.input}
        />

        <button
          type="submit"
          className={styles.submit}
          disabled={form.submitting}
        >
          {form.submitting ? UI_TEXTS.bookSuggestForm.submitting : UI_TEXTS.bookSuggestForm.submit}
        </button>
      </form>
    </section>
  );
}
