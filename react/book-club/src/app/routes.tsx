import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../domains/auth/pages/LoginPage';
import { PrivateRoute } from '../domains/auth/PrivateRoute';
import { AppLayout } from '../layout/AppLayout';
import { BookListPage } from '../domains/books/pages/BookListPage';
import { DashboardPage } from '../domains/dashboard/pages/DashboardPage';
import { RafflePage } from '../domains/raffle/pages/RafflePage';


export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/login" element={<LoginPage />} />

        {/* private */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/books" element={<BookListPage />} />
          <Route path="/raffle" element={<RafflePage />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}