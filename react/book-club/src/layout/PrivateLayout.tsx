import { UI_TEXTS } from "../constants/uiTexts";
import { Outlet } from "react-router-dom";
import { useLastAccess } from "../hooks/useLastAccess";
import { useAuth } from "../auth/AuthProvider";
import { RequireAuth } from "../auth/RequireAuth";
import { useClub } from "../clubs/ClubProvider";
import styles from "./PrivateLayout.module.css";
import { Brand } from "../components/layout/Brand";
import { AppNav } from "../components/layout/AppNav";
import { ClubSelect } from "../components/layout/ClubSelect";
import { UserBar } from "../components/layout/UserBar";
import { AppFooter } from "../components/layout/AppFooter";
import { useSidebar } from "../hooks/useSidebar";


export function PrivateLayout() {
  const { user, logout } = useAuth();
  const { memberships, selectedClub, selectClubById, isLoading } = useClub();

  const { open, close } = useSidebar();
  const lastAccess = useLastAccess();    

  const displayName = user?.username ?? user?.name ?? "Usuário";
  const hasMultipleClubs = memberships.length > 1;

  return (
    <RequireAuth>
      <div className={styles.shell}>
        {/* overlay mobile */}
        <button
          className={styles.overlay}
          onClick={close}
          aria-label={UI_TEXTS.aria.closeMenu}
          type="button"
        />

        {/* Sidebar */}
        <aside className={styles.sidebar} aria-label="Menu">
          <div className={styles.sidebarTop}>
            <Brand />
            <AppNav variant="sidebar" onNavigate={close} />
          </div>

          {/* Sidebar bottom */}
          <div className={styles.sidebarBottom}>
            {hasMultipleClubs && (
              <div className={styles.sidebarSelectWrap}>
                <ClubSelect
                  isLoading={isLoading}
                  value={selectedClub?.clubId ?? ""}
                  options={memberships}
                  onChange={selectClubById}
                />
              </div>
            )}

            <div className={styles.sidebarUserRow}>
              <span className={styles.userDot} aria-hidden />
              <span className={styles.sidebarUserName}>{displayName}</span>
            </div>

            <button className={styles.ghostBtn} type="button" onClick={logout}>
              Sair
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className={styles.main}>
          <header className={styles.header}>
            <div className={styles.headerInner}>
              <button
                className={styles.menuBtn}
                type="button"
                onClick={open}
                aria-label={UI_TEXTS.aria.openMenu}
              >
                ☰
              </button>              

              {/*  */}
              <UserBar displayName={displayName} onLogout={logout} />
            </div>
          </header>

          <main className={styles.content}>
            <div className={styles.contentInner}>
              <Outlet />
              <AppFooter lastAccess={lastAccess} />
            </div>
          </main>

          {/* Bottom nav (mobile) */}
          <AppNav variant="bottom" />
        </div>
      </div>
    </RequireAuth>
  );
}
