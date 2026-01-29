import { useEffect, useMemo, useState } from "react";
import {
  deleteSuggestedBook,
  finishBook,
  listBooks,
  rateBook,
  type BookResponse,
} from "../api/books";
import type { BooksSort, BooksTab } from "../components/BooksFilters";
import { UI_TEXTS } from "../constants/uiTexts";

type ViewSingle = { mode: "single"; title: string; items: BookResponse[] };
type ViewMulti = { mode: "multi"; groups: { title: string; items: BookResponse[] }[] };
export type BooksView = ViewSingle | ViewMulti;

export function useBooksData(params: { clubId?: string; isLoadingClub: boolean }) {
  const { clubId, isLoadingClub } = params;

  const [books, setBooks] = useState<BookResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const [tab, setTab] = useState<BooksTab>("READ");
  const [sort, setSort] = useState<BooksSort>("RATING_DESC");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function load() {
    if (!clubId) return;
    setLoading(true);
    setError("");
    try {
      const data = await listBooks(clubId);
      setBooks(data);
    } catch (e: any) {
      setError(e?.message ?? UI_TEXTS.messages.errorLoadingBooks);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoadingClub) return;
    if (!clubId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingClub, clubId]);

  async function act(bookId: string, fn: () => Promise<any>) {
    if (!clubId) return;
    setBusyId(bookId);
    setError("");
    try {
      await fn();
      await load();
    } catch (e: any) {
      setError(e?.message ?? UI_TEXTS.messages.errorGeneric);
    } finally {
      setBusyId(null);
    }
  }

  const actions = useMemo(() => {
    return {
      reload: load,
      finish: (bookId: string) => act(bookId, () => finishBook(clubId!, bookId)),
      deleteSuggested: (bookId: string) =>
        act(bookId, () => deleteSuggestedBook(clubId!, bookId)),
      rate: (bookId: string, rating: number) =>
        act(bookId, () => rateBook(clubId!, bookId, rating)),
      onCreated: async () => {
        setShowForm(false);
        await load();
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId]);

  
  const view: BooksView = useMemo(() => {
    const norm = (s: string) =>
      s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

    const q = norm(query.trim());
    const matchesQuery = (b: BookResponse) => {
      if (!q) return true;
      const hay = norm(`${b.title} ${b.author}`);
      return hay.includes(q);
    };

    const suggested = books.filter((b) => b.status === "SUGGESTED").filter(matchesQuery);
    const reading = books.filter((b) => b.status === "READING").filter(matchesQuery);
    const read = books.filter((b) => b.status === "READ").filter(matchesQuery);

    const getRatingAvg = (b: any): number | null =>
      (typeof b.ratingAverage === "number" && b.ratingAverage) ||
      (typeof b.avgRating === "number" && b.avgRating) ||
      null;

    const sortRead = (arr: BookResponse[]) => {
      if (sort === "TITLE_ASC") return [...arr].sort((a, b) => a.title.localeCompare(b.title));
      if (sort === "TITLE_DESC") return [...arr].sort((a, b) => b.title.localeCompare(a.title));

      return [...arr].sort((a: any, b: any) => {
        const ra = getRatingAvg(a) ?? -1;
        const rb = getRatingAvg(b) ?? -1;
        if (rb !== ra) return rb - ra;
        return a.title.localeCompare(b.title);
      });
    };

    const sortBasic = (arr: BookResponse[]) => {
      if (sort === "TITLE_DESC") return [...arr].sort((a, b) => b.title.localeCompare(a.title));
      return [...arr].sort((a, b) => a.title.localeCompare(b.title));
    };

    const sorted = {
      suggested: sortBasic(suggested),
      reading: sortBasic(reading),
      read: sortRead(read),
    };

    if (tab === "SUGGESTED") return { mode: "single", title: UI_TEXTS.book.suggested, items: sorted.suggested };
    if (tab === "READING") return { mode: "single", title: UI_TEXTS.book.reading, items: sorted.reading };
    if (tab === "READ") return { mode: "single", title: UI_TEXTS.book.read, items: sorted.read };

    return {
      mode: "multi",
      groups: [
        { title: UI_TEXTS.book.read, items: sorted.read },
        { title: UI_TEXTS.book.suggested, items: sorted.suggested },
        { title: UI_TEXTS.book.reading, items: sorted.reading },
      ],
    };
  }, [books, tab, sort, query]);

  const counts = useMemo(() => {
    const suggested = books.filter((b) => b.status === "SUGGESTED").length;
    const reading = books.filter((b) => b.status === "READING").length;
    const read = books.filter((b) => b.status === "READ").length;
    return { suggested, reading, read, total: books.length };
  }, [books]);

  return {
    state: {
      books,
      loading,
      busyId,
      error,
      tab,
      sort,
      query,
      showForm,
      view,
      counts,
    },
    set: { setTab, setSort, setQuery, setShowForm, setError },
    actions,
  };
}
