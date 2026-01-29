import { useEffect, useMemo, useState } from "react";
import { getBookProgressSummary, type BookProgressSummaryResponse } from "../api/books";

export function useBooksProgressSummaries(
  clubId: string | undefined,
  books: { id: string; status?: string }[]
) {
  const [map, setMap] = useState<Record<string, BookProgressSummaryResponse>>({});
  const [loading, setLoading] = useState(false);

  const idsToFetch = useMemo(() => {    
    return books
      .filter((b) => b.status === "READ" || b.status === "READING")
      .map((b) => b.id);
  }, [books]);

  useEffect(() => {
    if (!clubId) return;
    if (idsToFetch.length === 0) return;

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const results = await Promise.all(
          idsToFetch.map(async (id) => {            
            if (map[id]) return [id, map[id]] as const;
            const summary = await getBookProgressSummary(clubId, id);
            return [id, summary] as const;
          })
        );

        if (cancelled) return;

        setMap((prev) => {
          const next = { ...prev };
          for (const [id, summary] of results) next[id] = summary;
          return next;
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId, idsToFetch.join("|")]);

  return { summariesByBookId: map, loading };
}
