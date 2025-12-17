import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../domains/auth/auth.context';
import styles from './styles/UserMenu.module.css';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className={styles.container} ref={ref}>
      <button className={styles.trigger} onClick={() => setOpen(!open)}>
        <span className={styles.avatar}>
          {user.name?.charAt(0).toUpperCase()}
        </span>
        <span className={styles.name}>{user.name}</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <button onClick={logout}>🚪 Sair</button>
        </div>
      )}
    </div>
  );
}
