import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock } from 'lucide-react';

const PendingApproval = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.card}>
        <Clock size={64} color="var(--color-warning)" style={{marginBottom: '20px'}} />
        
        <h2 style={styles.title}>Cuenta Pendiente</h2>
        
        {message ? (
          <p style={styles.message}>{message}</p>
        ) : (
          <p style={styles.message}>
            Tu cuenta se encuentra en estado pendiente. Por favor, aguarda a que un administrador apruebe tu solicitud de registro para poder ingresar al Prode.
          </p>
        )}
        
        <button onClick={handleLogout} className="btn-sporty-outline" style={{marginTop: '20px'}}>Volver al Inicio</button>
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
  },
  title: {
    color: 'var(--color-warning)',
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

export default PendingApproval;
