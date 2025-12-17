export type BookSuggestion = {
  title: string;
  author: string;
  thumbnail?: string;
};

export async function searchBooks(query: string): Promise<BookSuggestion[]> {
  if (!query) return [];

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
  );

  const data = await response.json();

  if (!data.items) return [];

  return data.items.slice(0, 5).map((item: any) => ({
    title: item.volumeInfo.title,
    author: item.volumeInfo.authors?.[0] ?? 'Autor desconhecido',
    thumbnail: item.volumeInfo.imageLinks?.thumbnail,
  }));
}