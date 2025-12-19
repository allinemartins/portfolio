import { Outlet, NavLink } from 'react-router-dom';
import { UserMenu } from './UserMenu';
import styles from './styles/AppLayout.module.css';

export function AppLayout() {  
  return (
    <div className={styles.container}>
     
      <header className={styles.header}>
        <span className={styles.logo}>📚 Clubinho</span>
        <UserMenu />
      </header>

      
      <div className={styles.body}>
        
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.link
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/books"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.link
              }
            >
              Livros
            </NavLink>

            <NavLink
              to="/raffle"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.link
              }
            >
              Sorteio
            </NavLink>
          </nav>
        </aside>

        
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

      
      <footer className={styles.bottomNav}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? styles.activeIcon : styles.icon
          }
        >
          🏠
        </NavLink>

        <NavLink
          to="/books"
          className={({ isActive }) =>
            isActive ? styles.activeIcon : styles.icon
          }
        >
          📚
        </NavLink>

        <NavLink
          to="/raffle"
          className={({ isActive }) =>
            isActive ? styles.activeIcon : styles.icon
          }
        >
          🎲
        </NavLink>
      </footer>
    </div>
  );
}