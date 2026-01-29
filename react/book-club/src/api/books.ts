import { apiFetch } from "./apiFetch";

export type BookStatus = "SUGGESTED" | "READING" | "READ";

export type BookResponse = {
  id: string;
  clubId: string;
  title: string;
  author: string;
  imageUrl: string | null;
  status: BookStatus;
  createdAt: string;
  avgRating: number | null;
  ratingsCount: number | null;
};

export type BookCreateRequest = {
  title: string;
  author: string;
  imageUrl?: string | null;
};

export type BookProgressSummaryResponse = {
  hasRated: boolean;
  hasFinished: boolean;
  finishedCount: number;
  totalMembers: number;
};

export type BusyAction = "finish" | "rate" | null;

export function listBooks(clubId: string) {
  return apiFetch<BookResponse[]>(`/api/clubs/${clubId}/books`);
}

export function createSuggestedBook(clubId: string, payload: BookCreateRequest) {
  return apiFetch<BookResponse>(`/api/clubs/${clubId}/books`, {
    method: "POST",
    body: JSON.stringify({
      title: payload.title,
      author: payload.author,
      imageUrl: payload.imageUrl ?? null,
    }),
  });
}

export function startReadingBook(clubId: string, bookId: string) {
  return apiFetch<BookResponse>(`/api/clubs/${clubId}/books/${bookId}/start-reading`, {
    method: "POST",
  });
}

export function finishBook(clubId: string, bookId: string) {
  return apiFetch<BookResponse>(`/api/clubs/${clubId}/books/${bookId}/finish`, {
    method: "POST",
  });
}

export function deleteSuggestedBook(clubId: string, bookId: string) {
  return apiFetch<void>(`/api/clubs/${clubId}/books/${bookId}`, {
    method: "DELETE",
  });
}

export function rateBook(clubId: string, bookId: string, rating: number) {
  return apiFetch<BookResponse>(`/api/clubs/${clubId}/books/${bookId}/rating`, {
    method: "PUT",
    body: JSON.stringify({ rating }),
  });
}

export async function getCurrentReadingBook(clubId: string) {  
  return apiFetch<BookResponse | undefined>(`/api/clubs/${clubId}/books/current`);
}

export function getBookProgressSummary(clubId: string, bookId: string) {
  return apiFetch<BookProgressSummaryResponse>(
    `/api/clubs/${clubId}/books/${bookId}/progress-summary`
  );
}
