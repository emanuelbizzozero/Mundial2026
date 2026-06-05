import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle } from 'lucide-react';

const Blocked = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.card}>
        <AlertTriangle size={64} color="var(--color-primary)" style={{marginBottom: '20px'}} />
        
        <h2 style={styles.title}>Cuenta Bloqueada</h2>
        
        <p style={styles.message}>
          Tu cuenta ha sido bloqueada. No puedes ingresar al sistema en este momento. Contacta a un administrador para más información.
        </p>
        
        <button onClick={handleLogout} className="btn-sporty" style={{marginTop: '20px'}}>Volver al Inicio</button>
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
    maxWidth: '450px',
    padding: '40px 30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    border: '1px solid rgba(255, 0, 77, 0.3)',
  },
  title: {
    color: 'var(--color-primary)',
    fontSize: '28px',
    marginBottom: '15px',
  },
  message: {
    color: 'var(--color-text-muted)',
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '10px',
  }
};

export default Blocked;
