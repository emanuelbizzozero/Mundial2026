import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'phone') {
      value = value.replace(/\D/g, ''); // Remove all non-digits
    }
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.phone) {
      setError('Por favor, completa ambos campos');
      return;
    }
    
    setStep(2);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    const result = await resetPassword(formData.username, formData.phone, formData.password);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        navigate('/login', { state: { message: 'Contraseña actualizada correctamente. Ya puedes ingresar.' } });
      }, 2500);
    } else {
      setError(result.message);
      setStep(1); // Volver atrás si falló la verificación de seguridad
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.card}>
        <div style={{width: '100%', marginBottom: '20px'}}>
          <Link to="/login" style={{color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', textDecoration: 'none', fontSize: '14px'}}>
            <ArrowLeft size={16} style={{marginRight: '5px'}}/> Volver al Login
          </Link>
        </div>

        <div style={styles.logoContainer}>
          <h2 style={styles.title}>Recuperar Contraseña</h2>
          <p style={{color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '5px'}}>
            {step === 1 ? 'Ingresa tus datos de seguridad' : 'Crea tu nueva contraseña'}
          </p>
        </div>
        
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}
        
        {step === 1 ? (
          <form onSubmit={handleVerify} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Usuario</label>
              <input 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                className="app-input" 
                placeholder="Ej: juanperez"
                required 
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Número de contacto registrado</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className="app-input" 
                placeholder="Ingresa solo números"
                required 
              />
            </div>
            
            <button type="submit" className="btn-sporty" style={{marginTop: '10px'}}>Verificar Identidad</button>
          </form>
        ) : (
          <form onSubmit={handleReset} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nueva Contraseña</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="app-input"
                  style={{ paddingRight: '45px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirmar Nueva Contraseña</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="app-input"
                  style={{ paddingRight: '45px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeBtn}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button type="submit" className="btn-sporty" style={{marginTop: '10px'}}>Guardar Contraseña</button>
            <button type="button" className="btn-sporty-outline" onClick={() => setStep(1)}>Atrás</button>
          </form>
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
    maxWidth: '450px',
    padding: '40px 30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '25px',
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
    width: '100%',
    textAlign: 'center',
    fontSize: '14px',
  },
  successBox: {
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    border: '1px solid var(--color-green-light)',
    color: 'var(--color-green-light)',
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
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.6)',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
  }
};

export default ForgotPassword;
