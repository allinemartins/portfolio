import { useClub } from "../clubs/ClubProvider";
import styles from "./styles/Books.module.css";
import { UI_TEXTS } from "../constants/uiTexts";

import { BooksFilters } from "../components/BooksFilters";
import { BookSuggestForm } from "../components/BookSuggestForm";
import { useBooksData } from "../hooks/useBooksData";
import { ClubGuard } from "../components/ClubGuard";
import { BooksListBlock } from "../components/BooksListBlock";

export function Books() {
  const { selectedClub, isLoading: isLoadingClub } = useClub();
  const clubId = selectedClub?.clubId;

  const { state, set, actions } = useBooksData({ clubId, isLoadingClub });

  return (
    <ClubGuard isLoading={isLoadingClub} hasClub={!!selectedClub}>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>{UI_TEXTS.menus.books}</h2>
            <p className={styles.subtitle}>
              {UI_TEXTS.club.clubTitle.replace(
                "{clubName}",
                selectedClub?.clubName || ""
              )}
            </p>
          </div>

          <button
            className={styles.toggleFormBtn}
            onClick={() => set.setShowForm((v) => !v)}
            type="button"
          >
            {state.showForm
              ? UI_TEXTS.buttons.closeSuggestForm
              : UI_TEXTS.buttons.suggestBook}
          </button>
        </header>

        {state.error && (
          <div className={styles.errorBox}>
            <b>{UI_TEXTS.messages.errorGeneric}</b> {state.error}
          </div>
        )}

        {state.showForm && clubId && (
          <BookSuggestForm
            clubId={clubId}
            onCreated={actions.onCreated}
            onError={(msg) => set.setError(msg)}
          />
        )}

        <BooksFilters
          tab={state.tab}
          sort={state.sort}
          query={state.query}
          counts={state.counts}
          onTabChange={set.setTab}
          onSortChange={set.setSort}
          onQueryChange={set.setQuery}
        />

        <section className={styles.listSection}>
          {state.loading ? (
            <div className={styles.muted}>{UI_TEXTS.messages.loadingBooks}</div>
          ) : state.view.mode === "single" ? (
            <BooksListBlock
              clubId={clubId!}
              title={state.view.title}
              items={state.view.items}
              busyId={state.busyId}
              onFinish={actions.finish}
              onDelete={actions.deleteSuggested}
              onRate={actions.rate}
            />
          ) : (
            <div className={styles.groups}>
              {state.view.groups.map((g) => (
                <BooksListBlock
                  key={g.title}
                  clubId={clubId!}
                  title={g.title}
                  items={g.items}
                  busyId={state.busyId}
                  onFinish={actions.finish}
                  onDelete={actions.deleteSuggested}
                  onRate={actions.rate}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </ClubGuard>
  );
}
