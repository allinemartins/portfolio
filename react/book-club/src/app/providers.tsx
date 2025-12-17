
import { AuthProvider } from '../domains/auth/auth.context';
import { MemberProvider } from '../domains/members/member.context';
import { BookProvider } from '../domains/books/book.context';
import { RatingProvider } from '../domains/books/rating.context';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MemberProvider>
      <AuthProvider>
        <BookProvider>
          <RatingProvider>
            {children}
          </RatingProvider>
        </BookProvider>
      </AuthProvider>
    </MemberProvider>
  );
}