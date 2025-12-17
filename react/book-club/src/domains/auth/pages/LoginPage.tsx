import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/LoginPage.module.css';
import { useAuth } from '../auth.context';

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();

    // 🔐 Login fake por enquanto
    if (!email || !password) return;

    // futuramente: auth API
    localStorage.setItem('user', JSON.stringify({ email }));
    login({ email, password });
    navigate('/dashboard');
  }

  function handleSSO(provider) {
    console.log(`Login com ${provider}`);
    login({ provider: provider.toLowerCase() });
    navigate('/dashboard');
    // futuramente: OAuth
  }

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>📚 Clubinho do Livro</h1>
        <p className={styles.subtitle}>Entre para acompanhar leituras e avaliações</p>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.primaryButton}>
          Entrar
        </button>

         <div className={styles.divider}>
          ou continue com
        </div>

        <button
          type="button"
          className={styles.ssoButton}
          onClick={() => handleSSO('Google')}
        >
          Entrar com Google
        </button>

        <button
          type="button"
          className={styles.ssoButton}
          onClick={() => handleSSO('Microsoft')}
        >
          Entrar com Microsoft
        </button>

        <span className={styles.hint}>
          Modo demonstração ativo — autenticação real em breve
        </span>
      </form>
    </div>
  );
}
