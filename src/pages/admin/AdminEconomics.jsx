import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const AdminEconomics = () => {
  const { economics, setEconomics, addLog } = useData();
  const [formData, setFormData] = useState({
    entryFee: economics.entryFee,
    totalMatchdays: economics.totalMatchdays,
    matchesPerMatchday: economics.matchesPerMatchday
  });

  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEconomics = {
      entryFee: Number(formData.entryFee),
      totalMatchdays: Number(formData.totalMatchdays),
      matchesPerMatchday: Number(formData.matchesPerMatchday)
    };
    
    setEconomics(newEconomics);
    localStorage.setItem('prode_economics', JSON.stringify(newEconomics));
    addLog('Configuración Económica', 'Se actualizaron los valores económicos del torneo.');
    
    setMessage('Configuración guardada exitosamente.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h1 style={styles.pageTitle}>Configuración Económica</h1>
      
      <div className="glass-panel" style={styles.formContainer}>
        {message && (
          <div style={{backgroundColor: 'rgba(74, 222, 128, 0.2)', color: 'var(--color-green-light)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold'}}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Costo de Inscripción (Pozo por participante)</label>
            <div style={{position: 'relative'}}>
              <span style={styles.currencySymbol}>$</span>
              <input 
                type="number" 
                className="app-input" 
                style={{paddingLeft: '35px'}}
                value={formData.entryFee} 
                onChange={(e) => setFormData({...formData, entryFee: e.target.value})} 
                required 
              />
            </div>
            <p style={styles.helperText}>Este valor se usa para proyectar el pozo total según los usuarios activos.</p>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Cantidad de Fechas/Jornadas</label>
              <input 
                type="number" 
                className="app-input" 
                value={formData.totalMatchdays} 
                onChange={(e) => setFormData({...formData, totalMatchdays: e.target.value})} 
                required 
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Partidos por Fecha (Aprox)</label>
              <input 
                type="number" 
                className="app-input" 
                value={formData.matchesPerMatchday} 
                onChange={(e) => setFormData({...formData, matchesPerMatchday: e.target.value})} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-sporty" style={{marginTop: '10px'}}>Guardar Configuración</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageTitle: {
    fontSize: '28px',
    marginBottom: '20px',
  },
  formContainer: {
    padding: '30px',
    maxWidth: '600px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  row: {
    display: 'flex',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: '1',
  },
  label: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    fontWeight: '700',
  },
  currencySymbol: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--color-text-muted)',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  helperText: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '4px'
  }
};

export default AdminEconomics;
