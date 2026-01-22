import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PrivateLayout } from "./layout/PrivateLayout";
import { Dashboard } from "./pages/Dashboard";
import { Books } from "./pages/Books";
import { Raffle } from "./pages/Raffle";
import { Members } from "./pages/Members";
import { RequireAuth } from "./auth/RequireAuth";
import { Welcome } from "./pages/Welcome";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* publics */}        
        <Route path="/" element={<Welcome />} />

        {/* privates */}
        <Route
          element={
            <RequireAuth>
              <PrivateLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/raffle" element={<Raffle />} />
          <Route path="/members" element={<Members />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
