import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { registerUser } = useData();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('La contraseña debe incluir al menos una letra mayúscula, números y un carácter especial.');
      return;
    }

    if (!formData.phone || formData.phone.trim() === '') {
      setError('El número de contacto es obligatorio');
      return;
    }
    
    // Show confirmation step instead of registering immediately
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    const result = await registerUser({
      name: formData.name,
      lastName: formData.lastName,
      username: formData.username,
      phone: formData.phone,
      password: formData.password
    });
    
    if (result && result.error) {
      setError(result.error);
      setShowConfirm(false);
    } else {
      navigate('/login', { state: { message: 'Solicitud enviada correctamente. Esperando aprobación del administrador.' } });
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.card}>
        <div style={styles.logoContainer}>
          <h2 style={styles.title}>Registro de Jugador</h2>
        </div>
        
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
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
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
                <p style={{fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px'}}>
                  debe incluir mayuscula,numeros y caracter especial
                </p>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirmar Contraseña</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
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
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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

      {/* ERROR MODAL */}
      {error && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel" style={{...styles.modalContent, border: '1px solid rgba(56, 189, 248, 0.4)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 30, 45, 0.95) 100%)'}}>
            <h3 style={{...styles.modalTitle, color: '#38bdf8'}}>⚠️ Aviso</h3>
            <p style={styles.modalText}>
              {error}
            </p>
            <div style={styles.modalActions}>
              <button 
                onClick={() => setError('')} 
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
    textAlign: 'left',
    width: '100%',
    display: 'block'
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
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px'
  }
};

export default Register;
