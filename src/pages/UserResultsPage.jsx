import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const UserResultsPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { matchdays, matches, predictions } = useData();
  const [expandedMatchday, setExpandedMatchday] = useState(null);

  const toggleMatchday = (mdId) => {
    setExpandedMatchday(expandedMatchday === mdId ? null : mdId);
  };

  const getMatchesForMatchday = (mdId) => {
    return matches
      .filter(m => m.matchdayId === mdId)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      });
  };

  const getUserPrediction = (matchId) => {
    return predictions.find(p => p.userId === currentUser.id && p.matchId === matchId);
  };

  const getMatchdayStats = (mdId) => {
    const mdMatches = getMatchesForMatchday(mdId);
    const finalized = mdMatches.filter(m => m.status === 'FINALIZADO').length;
    return { total: mdMatches.length, finalized };
  };

  // Check if user got the prediction right
  const getPredictionResult = (match, pred) => {
    if (!pred || match.scoreLocal === null || match.scoreVisitante === null) return null;
    
    const realResult = Math.sign(match.scoreLocal - match.scoreVisitante); // 1=local, -1=visit, 0=draw
    const predResult = Math.sign(pred.predictedLocal - pred.predictedVisitante);
    
    if (pred.predictedLocal === match.scoreLocal && pred.predictedVisitante === match.scoreVisitante) {
      return 'exact'; // Exact score = 3 pts
    } else if (realResult === predResult) {
      return 'correct'; // Correct winner = 1 pt
    } else {
      return 'wrong'; // Wrong = 0 pts
    }
  };

  const getResultStyle = (result) => {
    switch(result) {
      case 'exact': return { bg: 'rgba(74, 222, 128, 0.2)', color: 'var(--color-success)', label: 'Exacto (+3)', icon: '🎯' };
      case 'correct': return { bg: 'rgba(59, 130, 246, 0.2)', color: 'var(--color-info)', label: 'Acierto (+1)', icon: '✅' };
      case 'wrong': return { bg: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-danger)', label: 'Errado (0)', icon: '❌' };
      default: return { bg: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)', label: 'Pendiente', icon: '⏳' };
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header className="responsive-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Volver</button>
          <h1 style={{fontSize: '20px', margin: 0}}>📊 Resultados</h1>
        </div>
        <button onClick={logout} className="btn-sporty-outline" style={{width: 'auto', padding: '8px 16px', fontSize: '13px'}}>Salir</button>
      </header>

      <p style={{color: 'var(--color-text-muted)', marginBottom: '15px', fontSize: '14px'}}>
        Mira los resultados oficiales y compara con tus predicciones.
      </p>

      {/* ACCORDION PER MATCHDAY */}
      <div style={styles.accordionList}>
        {matchdays.filter(md => md.status !== 'PENDIENTE').map(md => {
          const stats = getMatchdayStats(md.id);
          const isOpen = expandedMatchday === md.id;
          const mdMatches = getMatchesForMatchday(md.id);

          return (
            <div key={md.id} style={styles.accordionItem}>
              <button onClick={() => toggleMatchday(md.id)} className="responsive-accordion-header">
                <div style={styles.headerLeft}>
                  <span style={styles.chevron}>{isOpen ? '▼' : '▶'}</span>
                  <span style={styles.headerTitle}>Fecha {md.number}</span>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: md.status === 'ABIERTA' ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)',
                    color: md.status === 'ABIERTA' ? 'var(--color-success)' : 'var(--color-danger)',
                  }}>{md.status}</span>
                </div>
                <div style={styles.headerRight} className="header-right-container">
                  <span style={styles.progressText}>{stats.finalized}/{stats.total} finalizados</span>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: stats.total > 0 ? `${(stats.finalized / stats.total) * 100}%` : '0%'}}></div>
                  </div>
                </div>
              </button>

              {isOpen && (
                <div style={styles.accordionBody}>
                  {mdMatches.length === 0 && (
                    <p style={{color: 'var(--color-text-muted)', padding: '15px'}}>No hay partidos en esta fecha.</p>
                  )}

                  <div className="responsive-matches-grid" style={{padding: '15px'}}>
                    {mdMatches.map(match => {
                       const pred = getUserPrediction(match.id);
                       const predResult = getPredictionResult(match, pred);
                       const resultStyle = getResultStyle(predResult);

                       return (
                         <div key={match.id} style={{
                           ...styles.matchCard,
                           borderLeft: `3px solid ${resultStyle.color}`,
                           background: resultStyle.bg,
                         }}>
                           {/* Meta row */}
                           <div style={styles.matchMeta}>
                             <span style={styles.groupTag}>{match.group}</span>
                             <span style={styles.dateMini}>{match.date.slice(5)} {match.time}</span>
                             <span style={{fontSize: '10px', fontWeight: 'bold', color: resultStyle.color}}>
                               {resultStyle.icon} {resultStyle.label}
                             </span>
                           </div>

                           {/* Official result */}
                           <div style={styles.matchRow}>
                             <span style={{...styles.team, textAlign: 'right'}} className="match-row-team">{match.local}</span>
                             <span style={styles.scoreBig}>
                               {match.scoreLocal !== null ? match.scoreLocal : '-'}
                             </span>
                             <span style={styles.vs}>vs</span>
                             <span style={styles.scoreBig}>
                               {match.scoreVisitante !== null ? match.scoreVisitante : '-'}
                             </span>
                             <span style={{...styles.team, textAlign: 'left'}} className="match-row-team">{match.visitante}</span>
                           </div>

                          {/* User prediction */}
                          {pred && (
                            <div style={styles.predRow}>
                              <span style={styles.predLabel}>Tu prediccion:</span>
                              <span style={styles.predScore}>{pred.predictedLocal} - {pred.predictedVisitante}</span>
                            </div>
                          )}
                          {!pred && (
                            <div style={styles.predRow}>
                              <span style={{...styles.predLabel, fontStyle: 'italic'}}>No apostaste</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {matchdays.filter(md => md.status !== 'PENDIENTE').length === 0 && (
          <p style={{color: 'var(--color-text-muted)'}}>No hay fechas habilitadas aun.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '15px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.4) 0%, rgba(30, 64, 175, 0.4) 100%)',
    borderRadius: '12px',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  accordionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  accordionItem: {
    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.4) 0%, rgba(30, 64, 175, 0.4) 100%)',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  accordionHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  chevron: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
  headerTitle: {
    fontSize: '16px',
    fontWeight: '800',
  },
  statusBadge: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  progressText: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    whiteSpace: 'nowrap',
  },
  progressBar: {
    width: '100px',
    height: '6px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'var(--color-green-light)',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  accordionBody: {
    borderTop: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(0,0,0,0.1)',
  },
  matchesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    padding: '15px',
  },
  matchCard: {
    borderRadius: '8px',
    padding: '10px 12px',
  },
  matchMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
    gap: '6px',
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
    flex: 1,
    textAlign: 'center',
  },
  matchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
  },
  team: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  scoreBig: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--color-green-light)',
    minWidth: '25px',
    textAlign: 'center',
  },
  vs: {
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.3)',
    fontSize: '11px',
  },
  predRow: {
    marginTop: '6px',
    paddingTop: '6px',
    borderTop: '1px dashed rgba(255,255,255,0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  },
  predLabel: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
  },
  predScore: {
    fontSize: '13px',
    fontWeight: '800',
    color: '#fff',
    background: 'rgba(255,255,255,0.1)',
    padding: '2px 8px',
    borderRadius: '4px',
  },
};

export default UserResultsPage;
