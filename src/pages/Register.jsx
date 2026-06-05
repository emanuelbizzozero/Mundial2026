import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    username: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  
  const { registerUser } = useData();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!formData.phone || formData.phone.trim() === '') {
      setError('El número de contacto es obligatorio');
      return;
    }
    
    // Show confirmation step instead of registering immediately
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    registerUser({
      name: formData.name,
      lastName: formData.lastName,
      username: formData.username,
      phone: formData.phone,
      password: formData.password
    });
    
    navigate('/login', { state: { message: 'Solicitud enviada correctamente. Esperando aprobación del administrador.' } });
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.card}>
        <div style={styles.logoContainer}>
          <h2 style={styles.title}>Registro de Jugador</h2>
        </div>
        
        {error && <div style={styles.errorBox}>{error}</div>}
        
        {!showConfirm ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nombre</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="app-input" required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Apellido</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="app-input" required />
              </div>
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Usuario</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="app-input" required />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Número de contacto</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="app-input" required />
            </div>
            
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Contraseña</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="app-input" required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirmar Contraseña</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="app-input" required />
              </div>
            </div>
            
            <button type="submit" className="btn-sporty" style={{marginTop: '10px'}}>Continuar</button>
            
            <div style={styles.loginLink}>
              <span style={{color: 'var(--color-text-muted)'}}>¿Ya tienes cuenta? </span>
              <Link to="/login" style={{color: 'var(--color-secondary)'}}>Ingresar</Link>
            </div>
          </form>
        ) : (
          <div style={styles.confirmBox}>
            <h3 style={{color: '#fff', marginBottom: '15px'}}>Revisa tus datos</h3>
            <ul style={styles.confirmList}>
              <li><strong>Nombre:</strong> {formData.name} {formData.lastName}</li>
              <li><strong>Usuario:</strong> @{formData.username}</li>
              <li><strong>Contacto:</strong> <span style={{color: 'var(--color-green-light)'}}>{formData.phone}</span></li>
            </ul>
            <p style={{fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px'}}>
              Asegúrate de que el número de contacto sea correcto, ya que el administrador lo usará para comunicarse contigo y habilitar tu cuenta.
            </p>
            <div style={{display: 'flex', gap: '10px'}}>
              <button onClick={() => setShowConfirm(false)} className="btn-sporty-outline" style={{flex: 1}}>Volver a editar</button>
              <button onClick={handleConfirm} className="btn-sporty" style={{flex: 1}}>Confirmar y enviar</button>
            </div>
          </div>
        )}
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
    maxWidth: '500px',
    padding: '40px 30px',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    color: 'var(--color-secondary)',
    fontSize: '24px',
  },
  errorBox: {
    backgroundColor: 'rgba(227, 0, 43, 0.1)',
    border: '1px solid var(--color-danger)',
    color: 'var(--color-danger)',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  row: {
    display: 'flex',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  label: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    fontWeight: '600',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '14px',
  },
  confirmBox: {
    background: 'rgba(0,0,0,0.2)',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  confirmList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 15px 0',
    color: '#ccc',
    lineHeight: '1.8'
  }
};

export default Register;
