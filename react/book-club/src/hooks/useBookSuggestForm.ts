import { useEffect, useState } from "react";
import { createSuggestedBook } from "../api/books";
import { searchBooks, type BookSuggestion } from "../api/googleBooks";

type Params = {
  clubId: string;
  onCreated: () => void;
  onError: (msg: string) => void;
};

export function useBookSuggestForm({ clubId, onCreated, onError }: Params) {
  // form
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // search
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [sLoading, setSLoading] = useState(false);

  // debounce busca Google Books
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

  function resetForm() {
    setTitle("");
    setAuthor("");
    setImageUrl(null);
    setQ("");
    setSuggestions([]);
  }

  function applySuggestion(s: BookSuggestion) {
    setTitle(s.title);
    setAuthor(s.author);
    setImageUrl(s.thumbnail ?? null);
    setSuggestions([]);
    setQ("");
  }

  async function submit() {
    onError("");
    setSubmitting(true);

    try {
      await createSuggestedBook(clubId, { title, author, imageUrl });
      resetForm();
      onCreated();
    } catch (e: any) {
      onError(e?.message ?? "Erro ao criar livro");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    // state
    title,
    author,
    imageUrl,
    submitting,
    q,
    suggestions,
    sLoading,

    // setters
    setTitle,
    setAuthor,
    setImageUrl,
    setQ,

    // actions
    applySuggestion,
    submit,
  };
}
