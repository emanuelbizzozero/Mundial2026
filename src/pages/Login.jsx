import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { users } = useData();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const result = login(username, password, users);
    
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      if (result.status === 'PENDIENTE') {
        navigate('/pending');
      } else if (result.status === 'BLOQUEADO') {
        navigate('/blocked');
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.card}>
        <div style={styles.logoContainer}>
          <h1 style={styles.logoText}>PRODE MUNDIAL</h1>
          <h2 style={styles.yearText}>2026</h2>
        </div>
        
        {error && <div style={styles.errorBox}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Usuario</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="app-input"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="app-input"
              required
            />
          </div>
          
          <div style={styles.forgotPassword}>
            <a href="#" style={{fontSize: '14px', color: 'var(--color-text-muted)'}}>¿Olvidé mi contraseña?</a>
          </div>
          
          <button type="submit" className="btn-sporty">Ingresar</button>
          
          <div style={styles.divider}>
            <span>o</span>
          </div>
          
          <Link to="/register" style={{textDecoration: 'none'}}>
            <button type="button" className="btn-sporty-outline">Registrarse</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '40px 30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  logoText: {
    color: 'var(--color-primary)',
    fontSize: '28px',
    fontWeight: '800',
    letterSpacing: '2px',
  },
  yearText: {
    color: 'var(--color-secondary)',
    fontSize: '42px',
    fontWeight: '800',
    marginTop: '-5px',
  },
  errorBox: {
    backgroundColor: 'rgba(227, 0, 43, 0.1)',
    border: '1px solid var(--color-danger)',
    color: 'var(--color-danger)',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '20px',
    width: '100%',
    textAlign: 'center',
    fontSize: '14px',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    fontWeight: '600',
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: '-10px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    margin: '10px 0',
  }
};

export default Login;
