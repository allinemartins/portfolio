import { useState } from 'react';
import { useBookContext } from '../book.context';
import { searchBooks, type BookSuggestion } from '../book.service';
import type { BookStatus } from '../Book';

export function BookForm() {
  const { addBook } = useBookContext();

  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [thumbnail, setThumbnail] = useState<string | undefined>();
  const [status, setStatus] = useState<BookStatus>('SUGERIDO');
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);

  async function handleSearch() {
    const results = await searchBooks(search);
    setSuggestions(results);
  }

  function handleSelectBook(book: BookSuggestion) {
    setTitle(book.title);
    setAuthor(book.author);
    setThumbnail(book.thumbnail);
    setSuggestions([]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !author) return;

    addBook({
      title,
      author,
      thumbnail,
      status,
    });

    // reset
    setTitle('');
    setAuthor('');
    setThumbnail(undefined);
    setSearch('');
    setStatus('SUGERIDO');
  }

  return (
    <form onSubmit={handleSubmit}>
      
      <input
        placeholder="Buscar livro"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <button type="button" onClick={handleSearch}>
        Buscar
      </button>

      
      {suggestions.map((book, i) => (
        <div key={i} onClick={() => handleSelectBook(book)}>
          {book.title} – {book.author}
        </div>
      ))}

      
      <input value={title} placeholder="Título" readOnly />
      <input value={author} placeholder="Autor" readOnly />

      
      <select
        value={status}
        onChange={e => setStatus(e.target.value as BookStatus)}
      >
        <option value="SUGERIDO">Sugerido</option>
        <option value="LENDO">Lendo</option>
        <option value="LIDO">Lido</option>
      </select>

      <button type="submit">Adicionar</button>
    </form>
  );
}
