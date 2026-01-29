import { useEffect, useMemo, useRef, useState } from "react";
import { useClub } from "../clubs/ClubProvider";
import {
  type BookResponse,
  listBooks,
  getCurrentReadingBook,
  startReadingBook,
} from "../api/books";
import { BooksList } from "../components/BooksList";
import styles from "./styles/Raffle.module.css";
import { UI_TEXTS } from "../constants/uiTexts";

type Phase = "idle" | "rolling" | "winner" | "saving";

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function Raffle() {
  const { selectedClub, isLoading: isLoadingClub } = useClub();
  const clubId = selectedClub?.clubId;

  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [current, setCurrent] = useState<BookResponse | null>(null);
  const [error, setError] = useState("");

  const [phase, setPhase] = useState<Phase>("idle");
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [winner, setWinner] = useState<BookResponse | null>(null);

  const rollingTimer = useRef<number | null>(null);
  const rollingStopTimer = useRef<number | null>(null);

  const suggested = useMemo(
    () => books.filter((b) => b.status === "SUGGESTED"),
    [books]
  );

  const hasCurrent = !!current;

  const isSaving = phase === "saving";

  async function refresh() {
    if (!clubId) return;

    setError("");
    setIsLoading(true);
    try {
      const [all, cur] = await Promise.all([
        listBooks(clubId),
        getCurrentReadingBook(clubId).catch(() => undefined),
      ]);

      setBooks(all);
      setCurrent(cur ?? null);

      if (cur) {
        setPhase("idle");
        setWinner(null);
        setHighlightId(null);
      }
    } catch (e: any) {
      setError(e?.message ?? UI_TEXTS.messages.failedToLoadData);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!clubId) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId]);

  useEffect(() => {
    return () => {
      if (rollingTimer.current) window.clearInterval(rollingTimer.current);
      if (rollingStopTimer.current) window.clearTimeout(rollingStopTimer.current);
    };
  }, []);

  function startRoll() {
    if (!suggested.length) return;
    if (hasCurrent) return;
    if (phase === "rolling" || phase === "saving") return;

    setError("");
    setWinner(null);
    setPhase("rolling");

    let i = 0;
    setHighlightId(suggested[0].id);

    rollingTimer.current = window.setInterval(() => {
      i = (i + 1) % suggested.length;
      setHighlightId(suggested[i].id);
    }, 90);

    rollingStopTimer.current = window.setTimeout(() => {
      if (rollingTimer.current) window.clearInterval(rollingTimer.current);

      const selected = pickRandom(suggested);
      setWinner(selected);
      setHighlightId(selected.id);
      setPhase("winner");
    }, 2200);
  }

  async function confirmStartReading() {
    if (!clubId || !winner) return;

    setPhase("saving");
    setError("");

    try {
      await startReadingBook(clubId, winner.id);
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? UI_TEXTS.messages.impossibleAction);
      setPhase("winner");
    }
  }

  const canRoll =
    !isLoading &&
    !isLoadingClub &&
    !hasCurrent &&
    suggested.length > 0 &&
    phase !== "saving";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>{UI_TEXTS.menus.raffle}</h2>
          <p className={styles.subtitle}>
            Sorteie 1 livro entre os <strong>sugeridos</strong> e mova para{" "}
            <strong>READING</strong>.
          </p>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.rollButton}
            onClick={startRoll}
            disabled={!canRoll || phase === "rolling"}
            aria-busy={phase === "rolling" || phase === "saving"}
          >
            {phase === "rolling" ? UI_TEXTS.messages.raffing : UI_TEXTS.buttons.raffleBook}
          </button>

          <button
            className={styles.secondaryButton}
            onClick={refresh}
            disabled={isLoading || isLoadingClub || phase === "saving"}
          >
            {UI_TEXTS.buttons.refresh}
          </button>
        </div>
      </header>

      {error ? <div className={styles.alertError}>{error}</div> : null}

      {!isLoading && !isLoadingClub && hasCurrent ? (
        <div className={styles.alertInfo}>
          {UI_TEXTS.messages.alreadyInReading}:
          <strong className={styles.alertStrong}>
            {" "}
            {current?.title} — {current?.author}
          </strong>
          . {UI_TEXTS.messages.warningStartReading}
        </div>
      ) : null}

      <BooksList
        clubId={clubId ?? ""}
        title={UI_TEXTS.book.suggested}
        items={suggested}
        busyId={phase === "saving" ? winner?.id ?? null : null}
        onFinish={() => {}}
        onRate={() => {}}
        onDelete={() => {}}
        withSummaries={false}
        hideDelete={true}
        getItemClassName={(b) => {
          if (phase === "idle") return undefined;
          if (b.id === winner?.id && phase === "winner") return styles.cardWinner;
          if (b.id === highlightId) return styles.cardHighlight;
          return undefined;
        }}
        renderExtra={(b) => {
          const isWinner = b.id === winner?.id && phase === "winner";
          if (!isWinner) return null;

          return (
            <div className={styles.winnerBar}>
              <div className={styles.winnerText}>🎉 {UI_TEXTS.messages.startingReading}</div>
              <button
                className={styles.startButton}
                onClick={confirmStartReading}
                disabled={isSaving}
              >
                {isSaving ? UI_TEXTS.messages.saving : UI_TEXTS.book.finish}
              </button>
            </div>
          );
        }}
      />
    </div>
  );
}
