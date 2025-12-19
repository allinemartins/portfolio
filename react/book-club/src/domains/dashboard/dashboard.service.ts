import type { DashboardData } from './dashboard.types';

export async function getDashboardData(): Promise<DashboardData> {
  // simulation delay API
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        currentBook: {
          id: '1',
          title: 'O Nome do Vento',
          author: 'Patrick Rothfuss',
          status: 'reading',
        },
        stats: {
          members: 5,
          booksRead: 20,
          reviews: 78,
        },
        raffle: {
          status: 'waiting',
        },
      });
    }, 400);
  });
}