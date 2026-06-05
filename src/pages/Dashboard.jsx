import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const { users, economics, matchdays, matches, predictions, savePredictions } = useData();
  const navigate = useNavigate();
  
  const [currentMatchday, setCurrentMatchday] = useState(null);
  const [matchdayMatches, setMatchdayMatches] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Calculate Economics
  const activeUsersCount = users.filter(u => u.status === 'ACTIVO').length;
  const totalPozo = activeUsersCount * economics.entryFee;
  const prizeGeneral = totalPozo * 0.7;
  const prizePerMatchday = economics.totalMatchdays > 0 ? (totalPozo * 0.3) / economics.totalMatchdays : 0;

  useEffect(() => {
    const activeMd = matchdays.find(m => m.status === 'ABIERTA');
    if (activeMd) {
      setCurrentMatchday(activeMd);
      const mMatches = matches.filter(m => m.matchdayId === activeMd.id);
      setMatchdayMatches(mMatches);

      const existingPreds = predictions.filter(
        p => p.userId === currentUser.id && p.matchdayId === activeMd.id
      );
      const initialInputs = {};
      mMatches.forEach(m => {
        const pred = existingPreds.find(p => p.matchId === m.id);
        initialInputs[m.id] = {
          local: pred ? pred.predictedLocal : '',
          visitante: pred ? pred.predictedVisitante : ''
        };
      });
      setUserInputs(initialInputs);
    }
  }, [matchdays, matches, predictions, currentUser.id]);

  const handleInputChange = (matchId, field, value) => {
    setUserInputs(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [field]: value }
    }));
    setErrorMsg('');
  };

  const handleSave = () => {
    setErrorMsg('');
    setSuccessMsg('');
    let hasEmpty = false;
    const newPredictions = [];

    for (const match of matchdayMatches) {
      const inputs = userInputs[match.id];
      if (inputs.local === '' || inputs.visitante === '') {
        hasEmpty = true;
        break;
      }
      newPredictions.push({
        id: `${currentUser.id}-${match.id}`,
        userId: currentUser.id,
        matchdayId: currentMatchday.id,
        matchId: match.id,
        predictedLocal: Number(inputs.local),
        predictedVisitante: Number(inputs.visitante)
      });
    }

    if (hasEmpty) {
      setErrorMsg('⚠️ Faltan cargar resultados. Completa todos los partidos antes de guardar.');
      return;
    }

    savePredictions(currentUser.id, currentMatchday.id, newPredictions);
    setSuccessMsg('¡Apuesta guardada correctamente!');
    // Auto-trigger print dialog
    setTimeout(() => window.print(), 500);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handlePrint = () => window.print();

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header} className="no-print">
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <h1 style={styles.greeting}>⚽ Prode Mundial 2026</h1>
          <span style={styles.userBadge}>{currentUser.nombre || currentUser.usuario}</span>
        </div>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          {/* Stats inline in header */}
          <div style={styles.statInline}>
            <span style={styles.statInlineLabel}>Pozo</span>
            <span style={styles.statInlineValue}>${totalPozo.toLocaleString('es-AR')}</span>
          </div>
          <div style={styles.statInline}>
            <span style={styles.statInlineLabel}>Premio Gral</span>
            <span style={styles.statInlineValue}>${prizeGeneral.toLocaleString('es-AR')}</span>
          </div>
          <div style={styles.statInline}>
            <span style={styles.statInlineLabel}>Premio/Fecha</span>
            <span style={styles.statInlineValue}>${prizePerMatchday.toLocaleString('es-AR', {maximumFractionDigits: 0})}</span>
          </div>
          <button onClick={logout} className="btn-sporty-outline" style={{width: 'auto', padding: '8px 16px', fontSize: '13px'}}>Salir</button>
        </div>
      </header>

      {/* ALERTS */}
      {errorMsg && (
        <div className="no-print" style={styles.alertError}>{errorMsg}</div>
      )}
      {successMsg && (
        <div className="no-print" style={styles.alertSuccess}>
          <span>{successMsg}</span>
          <button onClick={handlePrint} style={styles.printBtn}>🖨️ Imprimir PDF</button>
        </div>
      )}

      {/* MATCHES + RANKING BUTTON */}
      <div className="glass-panel" style={{padding: '15px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px'}}>
          <h2 style={{fontSize: '18px', margin: 0}}>
            {currentMatchday ? `📅 Fecha ${currentMatchday.number} — ${matchdayMatches.length} partidos` : 'No hay fechas activas'}
          </h2>
          <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={() => navigate('/rankings')} style={styles.rankingBtn}>
              🏆 Rankings
            </button>
            <button onClick={() => navigate('/resultados')} style={styles.resultsBtn}>
              📊 Resultados
            </button>
          </div>
        </div>

        {!currentMatchday && (
          <p style={{color: 'var(--color-text-muted)'}}>El administrador aun no ha habilitado ninguna fecha.</p>
        )}

        {/* COMPACT GRID: 2 columns */}
        <div style={styles.matchesGrid}>
              {matchdayMatches.map(match => (
                <div key={match.id} style={styles.matchCard}>
                  <div style={styles.matchMeta}>
                    <span style={styles.groupTag}>{match.group}</span>
                    <span style={styles.dateMini}>{match.date.slice(5)} {match.time}</span>
                  </div>
                  <div style={styles.matchRow}>
                    <span style={styles.team}>{match.local}</span>
                    <input 
                      type="number" min="0"
                      style={styles.scoreInput}
                      value={userInputs[match.id]?.local ?? ''}
                      onChange={(e) => handleInputChange(match.id, 'local', e.target.value)}
                      disabled={match.status !== 'PROXIMO'}
                    />
                    <span style={styles.vs}>-</span>
                    <input 
                      type="number" min="0"
                      style={styles.scoreInput}
                      value={userInputs[match.id]?.visitante ?? ''}
                      onChange={(e) => handleInputChange(match.id, 'visitante', e.target.value)}
                      disabled={match.status !== 'PROXIMO'}
                    />
                    <span style={{...styles.team, textAlign: 'left'}}>{match.visitante}</span>
                  </div>
                </div>
              ))}
        </div>

        {currentMatchday && matchdayMatches.length > 0 && (
          <div className="no-print" style={{marginTop: '15px', display: 'flex', justifyContent: 'flex-end'}}>
            <button onClick={handleSave} className="btn-sporty" style={{width: 'auto', padding: '10px 30px', backgroundColor: 'var(--color-primary)', color: '#000'}}>
              Guardar
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '15px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    padding: '12px 20px',
    background: 'rgba(20, 30, 20, 0.6)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    flexWrap: 'wrap',
    gap: '10px',
  },
  greeting: {
    fontSize: '20px',
    margin: 0,
  },
  userBadge: {
    background: 'rgba(74, 222, 128, 0.2)',
    color: 'var(--color-green-light)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  statInline: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '4px 12px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  statInlineLabel: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  statInlineValue: {
    fontSize: '14px',
    fontWeight: '800',
    color: 'var(--color-green-light)',
  },
  alertError: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: 'var(--color-danger)',
    padding: '10px 15px',
    borderRadius: '8px',
    marginBottom: '10px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  alertSuccess: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    color: 'var(--color-green-light)',
    padding: '10px 15px',
    borderRadius: '8px',
    marginBottom: '10px',
    fontWeight: 'bold',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  printBtn: {
    background: 'var(--color-green-light)',
    color: '#000',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '12px',
  },
  // Matches in a 2-column grid
  matchesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  matchCard: {
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
    padding: '8px 10px',
  },
  matchMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  groupTag: {
    background: 'rgba(255,255,255,0.1)',
    padding: '1px 6px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.7)',
  },
  dateMini: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.4)',
  },
  matchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    justifyContent: 'center',
  },
  team: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'right',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  vs: {
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.3)',
    fontSize: '12px',
  },
  scoreInput: {
    width: '40px',
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: 'bold',
    padding: '5px 2px',
    borderRadius: '5px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(0,0,0,0.4)',
    color: '#fff',
    outline: 'none',
  },
  rankingBtn: {
    background: 'rgba(245, 158, 11, 0.2)',
    border: '1px solid rgba(245, 158, 11, 0.4)',
    color: '#F59E0B',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '13px',
    transition: 'all 0.2s',
  },
  resultsBtn: {
    background: 'rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(59, 130, 246, 0.4)',
    color: '#3B82F6',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '13px',
    transition: 'all 0.2s',
  },
};

export default Dashboard;
