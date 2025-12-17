export type BookStatus = 'SUGERIDO' | 'LENDO' | 'LIDO';

export interface Book {
  id: string;
  title: string;
  author: string;
  thumbnail?: string;
  status: BookStatus;
}

export type BookFilter = 'ALL' | BookStatus;