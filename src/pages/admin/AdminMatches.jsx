import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const AdminMatches = () => {
  const { matchdays, matches, addMatch, updateMatch, deleteMatch } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  
  const initialForm = {
    matchdayId: matchdays.length > 0 ? matchdays[0].id : '',
    local: '',
    visitante: '',
    date: '',
    time: '',
    stadium: '',
    group: '',
    status: 'PRÓXIMO'
  };
  const [formData, setFormData] = useState(initialForm);

  const handleEdit = (match) => {
    setIsEditing(true);
    setCurrentMatch(match);
    setFormData(match);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentMatch(null);
    setFormData(initialForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && currentMatch) {
      updateMatch(currentMatch.id, { ...formData, matchdayId: Number(formData.matchdayId) });
    } else {
      addMatch({ ...formData, matchdayId: Number(formData.matchdayId), scoreLocal: null, scoreVisitante: null });
    }
    handleCancel();
  };

  const getMatchdayNumber = (matchdayId) => {
    const md = matchdays.find(m => m.id === matchdayId);
    return md ? md.number : '-';
  };

  return (
    <div>
      <h1 style={styles.pageTitle}>Gestión de Partidos</h1>
      
      <div className="glass-panel" style={styles.formContainer}>
        <h3>{isEditing ? 'Editar Partido' : 'Nuevo Partido'}</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Fecha (Jornada)</label>
              <select className="app-input" value={formData.matchdayId} onChange={(e) => setFormData({...formData, matchdayId: e.target.value})} required>
                <option value="">Seleccione una fecha</option>
                {matchdays.map(md => (
                  <option key={md.id} value={md.id}>Fecha {md.number}</option>
                ))}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Grupo / Fase</label>
              <input type="text" className="app-input" value={formData.group} onChange={(e) => setFormData({...formData, group: e.target.value})} required />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Local</label>
              <input type="text" className="app-input" value={formData.local} onChange={(e) => setFormData({...formData, local: e.target.value})} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Visitante</label>
              <input type="text" className="app-input" value={formData.visitante} onChange={(e) => setFormData({...formData, visitante: e.target.value})} required />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Día</label>
              <input type="date" className="app-input" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Hora</label>
              <input type="time" className="app-input" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Estadio</label>
              <input type="text" className="app-input" value={formData.stadium} onChange={(e) => setFormData({...formData, stadium: e.target.value})} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Estado</label>
              <select className="app-input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="PRÓXIMO">Próximo</option>
                <option value="EN JUEGO">En juego</option>
                <option value="FINALIZADO">Finalizado</option>
              </select>
            </div>
          </div>

          <div style={styles.formActions}>
            <button type="submit" className="btn-sporty" style={{width: 'auto'}}>
              {isEditing ? 'Guardar Cambios' : 'Crear Partido'}
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
              <th>Jornada</th>
              <th>Grupo/Fase</th>
              <th>Encuentro</th>
              <th>Día/Hora</th>
              <th>Estadio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id}>
                <td>Fecha {getMatchdayNumber(match.matchdayId)}</td>
                <td>{match.group}</td>
                <td style={{fontWeight: 'bold'}}>{match.local} vs {match.visitante}</td>
                <td>{match.date} {match.time}</td>
                <td>{match.stadium}</td>
                <td>
                  <span style={{
                    ...styles.badge, 
                    backgroundColor: match.status === 'FINALIZADO' ? 'rgba(0,155,58,0.2)' : match.status === 'EN JUEGO' ? 'rgba(0,51,160,0.2)' : 'rgba(255,255,255,0.1)',
                    color: match.status === 'FINALIZADO' ? 'var(--color-success)' : match.status === 'EN JUEGO' ? 'var(--color-primary)' : 'var(--color-text-muted)'
                  }}>
                    {match.status}
                  </span>
                </td>
                <td>
                  <div style={styles.actions}>
                    <button onClick={() => handleEdit(match)} style={{...styles.actionBtn, color: 'var(--color-info)', borderColor: 'var(--color-info)'}}>Editar</button>
                    <button onClick={() => deleteMatch(match.id)} style={{...styles.actionBtn, color: 'var(--color-danger)', borderColor: 'var(--color-danger)'}}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {matches.length === 0 && (
              <tr>
                <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>No hay partidos registrados.</td>
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
    flexDirection: 'column',
    gap: '20px',
    marginTop: '15px',
  },
  row: {
    display: 'flex',
    gap: '20px',
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
    marginTop: '10px',
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

export default AdminMatches;
