import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const AdminMatchdays = () => {
  const { matchdays, matches, addMatchday, updateMatchday, deleteMatchday } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentMatchday, setCurrentMatchday] = useState(null);
  
  const [formData, setFormData] = useState({ number: '', status: 'ABIERTA' });

  const handleEdit = (matchday) => {
    setIsEditing(true);
    setCurrentMatchday(matchday);
    setFormData({ number: matchday.number, status: matchday.status });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentMatchday(null);
    setFormData({ number: '', status: 'ABIERTA' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && currentMatchday) {
      updateMatchday(currentMatchday.id, { number: Number(formData.number), status: formData.status });
    } else {
      addMatchday({ number: Number(formData.number), status: formData.status });
    }
    handleCancel();
  };

  const getMatchCount = (matchdayId) => {
    return matches.filter(m => m.matchdayId === matchdayId).length;
  };

  return (
    <div>
      <h1 style={styles.pageTitle}>Gestión de Fechas</h1>
      
      <div className="glass-panel" style={styles.formContainer}>
        <h3>{isEditing ? 'Editar Fecha' : 'Nueva Fecha'}</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Número de Fecha</label>
            <input 
              type="number" 
              className="app-input" 
              value={formData.number} 
              onChange={(e) => setFormData({...formData, number: e.target.value})} 
              required 
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Estado</label>
            <select 
              className="app-input" 
              value={formData.status} 
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="PENDIENTE">Pendiente (Oculta)</option>
              <option value="ABIERTA">Abierta para apuestas</option>
              <option value="CERRADA">Cerrada</option>
            </select>
          </div>
          <div style={styles.formActions}>
            <button type="submit" className="btn-sporty" style={{width: 'auto'}}>
              {isEditing ? 'Guardar Cambios' : 'Crear Fecha'}
            </button>
            {isEditing && (
              <button type="button" className="btn-sporty-outline" style={{width: 'auto'}} onClick={handleCancel}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Número de Fecha</th>
              <th>Cantidad de Partidos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {matchdays.map((matchday) => (
              <tr key={matchday.id}>
                <td>Fecha {matchday.number}</td>
                <td>{getMatchCount(matchday.id)} partidos</td>
                <td>
                  <span style={{
                    ...styles.badge, 
                    backgroundColor: matchday.status === 'ABIERTA' ? 'rgba(74,222,128,0.2)' : matchday.status === 'PENDIENTE' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                    color: matchday.status === 'ABIERTA' ? 'var(--color-success)' : matchday.status === 'PENDIENTE' ? 'var(--color-warning)' : 'var(--color-danger)'
                  }}>
                    {matchday.status}
                  </span>
                </td>
                <td>
                  <div style={styles.actions}>
                    {matchday.status !== 'ABIERTA' && (
                      <button onClick={() => updateMatchday(matchday.id, { ...matchday, status: 'ABIERTA' })} style={{...styles.actionBtn, color: 'var(--color-success)', borderColor: 'var(--color-success)'}}>Abrir</button>
                    )}
                    {matchday.status === 'ABIERTA' && (
                      <button onClick={() => updateMatchday(matchday.id, { ...matchday, status: 'CERRADA' })} style={{...styles.actionBtn, color: 'var(--color-warning)', borderColor: 'var(--color-warning)'}}>Cerrar</button>
                    )}
                    <button onClick={() => handleEdit(matchday)} style={{...styles.actionBtn, color: 'var(--color-info)', borderColor: 'var(--color-info)'}}>Editar</button>
                    <button onClick={() => deleteMatchday(matchday.id)} style={{...styles.actionBtn, color: 'var(--color-danger)', borderColor: 'var(--color-danger)'}}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {matchdays.length === 0 && (
              <tr>
                <td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>No hay fechas creadas.</td>
              </tr>
            )}
          </tbody>
        </table>
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
    padding: '20px',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    gap: '20px',
    marginTop: '15px',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: '1',
    minWidth: '200px',
  },
  label: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    fontWeight: '600',
  },
  formActions: {
    display: 'flex',
    gap: '10px',
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '700',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  actionBtn: {
    background: 'transparent',
    border: '1px solid',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)',
    letterSpacing: '1px',
    padding: '6px 10px',
    borderRadius: '4px',
    transition: 'var(--transition-smooth)',
    textTransform: 'uppercase'
  }
};

export default AdminMatchdays;
