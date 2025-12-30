export type BookStatus = 'SUGERIDO' | 'LENDO' | 'LIDO';

export type BookProgress = {
  memberEmail: string;
  finished: boolean;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  suggestedBy: string;
  status: BookStatus;
  progress?: BookProgress[];
};