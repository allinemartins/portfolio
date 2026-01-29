import { useEffect, useMemo, useState } from "react";
import {
  type BookProgressSummaryResponse,
  type BookResponse,
  finishBook,
  getBookProgressSummary,
  getCurrentReadingBook,
  listBooks,
  rateBook,
} from "../api/books";
import { UI_TEXTS } from "../constants/uiTexts";

type BusyAction = "finish" | "rate" | null;

export function useDashboardData({
  clubId,
  isLoadingClub,
}: {
  clubId?: string;
  isLoadingClub: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [current, setCurrent] = useState<BookResponse | null>(null);
  const [summary, setSummary] = useState<BookProgressSummaryResponse | undefined>();
  const [error, setError] = useState<string>("");
  const [busyAction, setBusyAction] = useState<BusyAction>(null);

  const [banner, setBanner] = useState<string | null>(null);
  
  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 3500);
    return () => clearTimeout(t);
  }, [banner]);

  async function refreshDashboard(opts?: { signalCancelled?: () => boolean }) {
    if (!clubId) return;

    const [list, curr] = await Promise.all([
      listBooks(clubId),
      getCurrentReadingBook(clubId).catch(() => undefined),
    ]);

    if (opts?.signalCancelled?.()) return;

    setBooks(list ?? []);

    const currBook = curr ?? null;
    setCurrent(currBook);

    if (currBook) {
      const s = await getBookProgressSummary(clubId, currBook.id);
      if (opts?.signalCancelled?.()) return;
      setSummary(s);
    } else {
      setSummary(undefined);
    }
  }

  useEffect(() => {
    if (isLoadingClub) return;
    if (!clubId) return;

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError("");

      try {
        await refreshDashboard({ signalCancelled: () => cancelled });
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? UI_TEXTS.dashboard.error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingClub, clubId]);

  const stats = useMemo(() => {
    const total = books.length;
    const read = books.filter((b) => b.status === "READ").length;
    const reading = books.filter((b) => b.status === "READING").length;
    return { total, read, reading };
  }, [books]);

  async function onFinish() {
    if (!clubId || !current) return;

    const finishingBookId = current.id;

    try {
      setBusyAction("finish");

      await finishBook(clubId, finishingBookId);
     
      await refreshDashboard();
      
      setTimeout(() => {
        setCurrent((curr) => {
          if (!curr) setBanner("🎉 " + UI_TEXTS.book.finished);
          return curr;
        });
      }, 0);
    } finally {
      setBusyAction(null);
    }
  }

  async function onRate(rating: number) {
    if (!clubId || !current) return;

    try {
      setBusyAction("rate");
      await rateBook(clubId, current.id, rating);

      await refreshDashboard();
    } finally {
      setBusyAction(null);
    }
  }

  return {
    isLoading,
    error,
    banner,
    current,
    summary,
    busyAction,
    stats,
    onFinish,
    onRate,
  };
}
