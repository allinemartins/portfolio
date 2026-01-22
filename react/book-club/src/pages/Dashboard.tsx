import { useEffect, useMemo, useState } from "react";
import { useClub } from "../clubs/ClubProvider";
import { getCurrentReadingBook, listBooks, type BookResponse } from "../api/books";

export function Dashboard() {
  const { selectedClub, isLoading: isLoadingClub } = useClub();

  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [current, setCurrent] = useState<BookResponse | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isLoadingClub) return;
    if (!selectedClub?.clubId) return;

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError("");

      try {
        const clubId = selectedClub.clubId;
        
        const [list, curr] = await Promise.all([
          listBooks(clubId),
          getCurrentReadingBook(clubId).catch((err: any) => {            
            return undefined as any;
          }),
        ]);

        if (cancelled) return;

        setBooks(list ?? []);
        setCurrent(curr ?? null);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? "Erro ao carregar dashboard");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoadingClub, selectedClub?.clubId]);

  const stats = useMemo(() => {
    const total = books.length;
    const read = books.filter((b) => b.status === "READ").length;
    const reading = books.filter((b) => b.status === "READING").length;
    return { total, read, reading };
  }, [books]);

  if (isLoadingClub) {
    return <div style={{ padding: 12, color: "#666" }}>Carregando clube…</div>;
  }

  if (!selectedClub) {
    return <div style={{ padding: 12, color: "#666" }}>Nenhum clube selecionado.</div>;
  }

  return (
    <div>
      <h2 style={{ margin: 0 }}>Olá 👋</h2>
      <p style={{ color: "#666", marginTop: 6 }}>
        Clube atual: <b>{selectedClub.clubName}</b>
      </p>

      {error && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #f5c2c7", borderRadius: 8 }}>
          <b>Erro:</b> {error}
        </div>
      )}
      
      <section
        style={{
          marginTop: 16,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "white",
        }}
      >
        <h3 style={{ margin: 0 }}>📖 Livro atual</h3>

        {isLoading ? (
          <p style={{ color: "#666" }}>Carregando…</p>
        ) : current ? (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 700 }}>{current.title}</div>
            <div style={{ color: "#666" }}>{current.author}</div>
          </div>
        ) : (
          <p style={{ color: "#666", marginTop: 10 }}>Nenhum livro em leitura</p>
        )}
      </section>

      {/* Stats */}
      <section style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        <StatCard label="Total" value={stats.total} loading={isLoading} />
        <StatCard label="Lidos" value={stats.read} loading={isLoading} />
        <StatCard label="Lendo" value={stats.reading} loading={isLoading} />
      </section>
    </div>
  );
}

function StatCard({ label, value, loading }: { label: string; value: number; loading: boolean }) {
  return (
    <div
      style={{
        padding: 16,
        border: "1px solid #eee",
        borderRadius: 12,
        background: "white",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{loading ? "…" : value}</div>
    </div>
  );
}
