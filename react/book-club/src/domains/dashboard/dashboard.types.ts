export interface CurrentBook {
  id: string;
  title: string;
  author: string;
  status: 'reading' | 'finished';
}

export interface DashboardData {
  currentBook: CurrentBook;
  stats: {
    members: number;
    booksRead: number;
    reviews: number;
  };
  raffle: {
    status: 'waiting' | 'ready';
  };
}