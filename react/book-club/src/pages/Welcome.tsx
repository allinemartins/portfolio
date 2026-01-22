import { useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import styles from "./styles/Welcome.module.css";

export function Welcome() {
  const { isReady, isAuthenticated, login } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname ?? "/dashboard";

  if (!isReady) return <div className={styles.loading}>Carregando…</div>;
  if (isAuthenticated) return null;

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-label="Login">
        <header className={styles.header}>
          <span className={styles.logo} aria-hidden="true">
            <span className={styles.block1} />
            <span className={styles.block2} />
            <span className={styles.block3} />
          </span>

          <div className={styles.heading}>
            <h1 className={styles.title}>Book Club</h1>
            <p className={styles.subtitle}>
              Entre para acompanhar leituras e avaliações
            </p>
          </div>
        </header>

        <button
          className={styles.button}
          onClick={() => login(from)}
          disabled={!isReady}
        >
          Entrar
        </button>

        <p className={styles.footer}>Autenticação segura via Keycloak</p>
      </section>
    </main>
  );
}
