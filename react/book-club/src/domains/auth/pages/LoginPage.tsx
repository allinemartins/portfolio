import styles from './styles/LoginPage.module.css';
import { useAuth } from '../auth.context';

export function LoginPage() {
  const { login } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>📚 Clubinho do Livro</h1>
        <p className={styles.subtitle}>
          Entre para acompanhar leituras e avaliações
        </p>

        {/* Standard login */}
        <button
          className={styles.primaryButton}
          onClick={() => login()}
        >
          Entrar
        </button>

        <span className={styles.hint}>
          Autenticação segura via Keycloak
        </span>
      </div>
    </div>
  );
}
