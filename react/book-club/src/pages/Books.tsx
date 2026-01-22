import { useEffect, useMemo, useState } from "react";
import { useClub } from "../clubs/ClubProvider";
import {
  createSuggestedBook,
  deleteSuggestedBook,
  finishBook,
  listBooks,
  startReadingBook,
  type BookResponse,
} from "../api/books";
import { searchBooks, type BookSuggestion } from "../api/googleBooks";

export function Books() {
  const { selectedClub, isLoading: isLoadingClub } = useClub();

  const [books, setBooks] = useState<BookResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  // form
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // google suggestions
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [sLoading, setSLoading] = useState(false);

  const clubId = selectedClub?.clubId;

  async function load() {
    if (!clubId) return;
    setLoading(true);
    setError("");
    try {
      const data = await listBooks(clubId);
      setBooks(data);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar livros");
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

  // debounce simples da busca
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q.trim()) {
        setSuggestions([]);
        return;
      }
      setSLoading(true);
      try {
        const res = await searchBooks(q);
        setSuggestions(res);
      } finally {
        setSLoading(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [q]);

  const grouped = useMemo(() => {
    const suggested = books.filter((b) => b.status === "SUGGESTED");
    const reading = books.filter((b) => b.status === "READING");
    const read = books.filter((b) => b.status === "READ");
    return { suggested, reading, read };
  }, [books]);

  const canDelete = (b: BookResponse) => b.status === "SUGGESTED";
  const canStartReading = (b: BookResponse) => b.status === "SUGGESTED";
  const canFinish = (b: BookResponse) => b.status === "READING";

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!clubId) return;

    setError("");
    try {
      await createSuggestedBook(clubId, { title, author, imageUrl });
      setTitle("");
      setAuthor("");
      setImageUrl(null);
      setQ("");
      setSuggestions([]);
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao criar livro");
    }
  }

  async function act(bookId: string, fn: () => Promise<any>) {
    if (!clubId) return;
    setBusyId(bookId);
    setError("");
    try {
      await fn();
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Erro na ação");
    } finally {
      setBusyId(null);
    }
  }

  function applySuggestion(s: BookSuggestion) {
    setTitle(s.title);
    setAuthor(s.author);
    setImageUrl(s.thumbnail ?? null);
    setSuggestions([]);
    setQ("");
  }

  if (isLoadingClub) return <div style={{ color: "#666" }}>Carregando clube…</div>;
  if (!selectedClub) return <div style={{ color: "#666" }}>Nenhum clube selecionado.</div>;

  return (
    <div>
      <h2 style={{ margin: 0 }}>Livros</h2>
      <p style={{ color: "#666", marginTop: 6 }}>
        Clube: <b>{selectedClub.clubName}</b>
      </p>

      {error && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #f5c2c7", borderRadius: 8 }}>
          <b>Erro:</b> {error}
        </div>
      )}

      {/* Form */}
      <section
        style={{
          marginTop: 16,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "white",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Sugerir novo livro</h3>

        {/* Search Google Books */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 6 }}>
            Buscar sugestão (Google Books)
          </label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ex: Pragmatic Programmer"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ddd",
            }}
          />
          {sLoading && <div style={{ marginTop: 8, color: "#666" }}>Buscando…</div>}

          {!!suggestions.length && (
            <div
              style={{
                marginTop: 8,
                border: "1px solid #eee",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {suggestions.map((s, idx) => (
                <button
                  key={`${s.title}-${idx}`}
                  type="button"
                  onClick={() => applySuggestion(s)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: 10,
                    border: "none",
                    borderBottom: idx === suggestions.length - 1 ? "none" : "1px solid #eee",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{s.title}</div>
                  <div style={{ color: "#666", fontSize: 13 }}>{s.author}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={onCreate} style={{ display: "grid", gap: 10 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            required
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
          />
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Autor"
            required
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
          />
          <input
            value={imageUrl ?? ""}
            onChange={(e) => setImageUrl(e.target.value || null)}
            placeholder="Image URL (opcional)"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
          />

          <button
            type="submit"
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
              width: 220,
            }}
          >
            Cadastrar sugestão
          </button>
        </form>
      </section>

      {/* List */}
      <section style={{ marginTop: 16 }}>
        {loading ? (
          <div style={{ color: "#666" }}>Carregando livros…</div>
        ) : (
          <>
            <Group title="Lendo" items={grouped.reading} />
            <Group title="Sugeridos" items={grouped.suggested} />
            <Group title="Lidos" items={grouped.read} />
          </>
        )}
      </section>

      {/* Cards */}
      <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
        {!loading && books.length === 0 && (
          <div style={{ color: "#666" }}>Nenhum livro cadastrado ainda.</div>
        )}

        {books.map((b) => {
          const busy = busyId === b.id;

          return (
            <div
              key={b.id}
              style={{
                padding: 14,
                border: "1px solid #eee",
                borderRadius: 12,
                background: "white",
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {b.imageUrl ? (
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    style={{ width: 44, height: 60, objectFit: "cover", borderRadius: 8 }}
                  />
                ) : (
                  <div
                    style={{
                      width: 44,
                      height: 60,
                      borderRadius: 8,
                      background: "#f2f2f2",
                    }}
                  />
                )}

                <div>
                  <div style={{ fontWeight: 800 }}>{b.title}</div>
                  <div style={{ color: "#666", fontSize: 13 }}>{b.author}</div>
                  <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
                    Status: <b>{b.status}</b>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {canStartReading(b) && (
                  <button
                    disabled={busy}
                    onClick={() => act(b.id, () => startReadingBook(clubId!, b.id))}
                    style={btnStyle}
                  >
                    {busy ? "…" : "Start reading"}
                  </button>
                )}

                {canFinish(b) && (
                  <button
                    disabled={busy}
                    onClick={() => act(b.id, () => finishBook(clubId!, b.id))}
                    style={btnStyle}
                  >
                    {busy ? "…" : "Finish"}
                  </button>
                )}

                {canDelete(b) && (
                  <button
                    disabled={busy}
                    onClick={() => act(b.id, () => deleteSuggestedBook(clubId!, b.id))}
                    style={{ ...btnStyle, borderColor: "#f5c2c7" }}
                  >
                    {busy ? "…" : "Delete"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Group({ title, items }: { title: string; items: BookResponse[] }) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>{title}</div>
      <div style={{ color: "#666", fontSize: 13 }}>{items.length} livro(s)</div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};
