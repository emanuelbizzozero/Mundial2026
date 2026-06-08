import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showPendingModal, setShowPendingModal] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(username, password);
    
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      if (result.status === 'PENDIENTE') {
        setShowPendingModal(true);
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
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="app-input"
                style={{ paddingRight: '45px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div style={styles.forgotPassword}>
            <Link to="/forgot-password" style={{fontSize: '14px', color: 'var(--color-text-muted)', textDecoration: 'none'}}>¿Olvidaste tu contraseña?</Link>
          </div>
          
          <button type="submit" className="btn-sporty">Ingresar</button>
          
          <Link to="/register" style={{textDecoration: 'none', marginTop: '10px'}}>
            <button type="button" className="btn-sporty-outline">Registrarse</button>
          </Link>
        </form>
      </div>

      {/* PENDING MODAL */}
      {showPendingModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel" style={{...styles.modalContent, border: '1px solid rgba(56, 189, 248, 0.4)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 30, 45, 0.95) 100%)'}}>
            <h3 style={{...styles.modalTitle, color: '#38bdf8'}}>ℹ️ Pendiente de Aprobación</h3>
            <p style={styles.modalText}>
              Tu cuenta ha sido registrada correctamente, pero aún está pendiente de aprobación por un administrador.
            </p>
            <p style={styles.modalSubtext}>
              Por favor, aguarda a que validen tu pago o habiliten tu acceso para poder ingresar.
            </p>
            <div style={styles.modalActions}>
              <button 
                onClick={() => setShowPendingModal(false)} 
                className="btn-sporty" 
                style={{flex: 1, padding: '10px', backgroundColor: '#38bdf8', color: '#000'}}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
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
    textAlign: 'left',
    width: '100%',
    display: 'block'
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
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
    padding: '20px',
  },
  modalContent: {
    maxWidth: '450px',
    width: '100%',
    padding: '25px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#fff',
    margin: 0,
  },
  modalText: {
    fontSize: '15px',
    color: '#fff',
    marginBottom: '8px',
    marginTop: '15px',
  },
  modalSubtext: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '25px',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
  }
};

export default Login;
