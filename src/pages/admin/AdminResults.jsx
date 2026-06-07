import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const AdminResults = () => {
  const { matchdays, matches, updateMatch, addLog } = useData();
  const [expandedMatchday, setExpandedMatchday] = useState(null);
  const [savedMsg, setSavedMsg] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filterGroup, setFilterGroup] = useState('ALL');

  const toggleMatchday = (mdId) => {
    setExpandedMatchday(expandedMatchday === mdId ? null : mdId);
    setSavedMsg('');
  };

  const getMatchesForMatchday = (mdId) => {
    let filtered = matches.filter(m => m.matchdayId === mdId);
    
    if (filterText) {
      filtered = filtered.filter(m => 
        m.local.toLowerCase().includes(filterText.toLowerCase()) || 
        m.visitante.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    
    if (filterGroup !== 'ALL') {
      filtered = filtered.filter(m => m.group && m.group.includes(filterGroup));
    }
    
    return filtered.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });
  };

  const handleScoreChange = (matchId, field, value) => {
    const numValue = value === '' ? null : Number(value);
    updateMatch(matchId, { [field]: numValue });
  };

  const finalizeMatch = (match) => {
    if (match.scoreLocal === null || match.scoreVisitante === null) return;
    updateMatch(match.id, { status: 'FINALIZADO' });
    addLog('Partido Finalizado', `${match.local} ${match.scoreLocal} - ${match.scoreVisitante} ${match.visitante}`);
  };

  const saveAllResults = (mdId) => {
    const mdMatches = getMatchesForMatchday(mdId);
    let allComplete = true;
    mdMatches.forEach(m => {
      if (m.scoreLocal !== null && m.scoreVisitante !== null && m.status !== 'FINALIZADO') {
        updateMatch(m.id, { status: 'FINALIZADO' });
        addLog('Partido Finalizado', `${m.local} ${m.scoreLocal} - ${m.scoreVisitante} ${m.visitante}`);
      }
      if (m.scoreLocal === null || m.scoreVisitante === null) {
        allComplete = false;
      }
    });
    setSavedMsg(allComplete ? 'Todos los resultados guardados correctamente.' : 'Resultados guardados. Algunos partidos aun no tienen goles cargados.');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  const getMatchdayStats = (mdId) => {
    const mdMatches = getMatchesForMatchday(mdId);
    const finalized = mdMatches.filter(m => m.status === 'FINALIZADO').length;
    return { total: mdMatches.length, finalized };
  };

  const syncWithAPI = (mdId) => {
    // Fake API sync logic
    setSavedMsg('Sincronizando con API deportiva...');
    setTimeout(() => {
      const mdMatches = getMatchesForMatchday(mdId);
      mdMatches.forEach(m => {
        // En una app real, aqui hariamos fetch('https://api-football...') y validariamos la fecha y hora
        if (m.status !== 'FINALIZADO') {
          const randomLocal = Math.floor(Math.random() * 4);
          const randomVisit = Math.floor(Math.random() * 4);
          updateMatch(m.id, { scoreLocal: randomLocal, scoreVisitante: randomVisit });
        }
      });
      setSavedMsg('Sincronización completada. Los goles se han cargado automáticamente.');
      setTimeout(() => setSavedMsg(''), 6000);
    }, 1500);
  };

  return (
    <div>
      <h1 style={styles.pageTitle}>Carga de Resultados</h1>
      <p style={{color: 'var(--color-text-muted)', marginBottom: '15px', fontSize: '14px'}}>
        Selecciona una fecha para desplegar los partidos y cargar los resultados.
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Buscar equipo..." 
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="app-input"
          style={{ flex: '1', minWidth: '200px' }}
        />
        <select 
          value={filterGroup} 
          onChange={e => setFilterGroup(e.target.value)}
          className="app-input"
          style={{ width: '150px' }}
        >
          <option value="ALL">Todos</option>
          <option value="Grupo A">Grupo A</option>
          <option value="Grupo B">Grupo B</option>
          <option value="Grupo C">Grupo C</option>
          <option value="Grupo D">Grupo D</option>
          <option value="Grupo E">Grupo E</option>
          <option value="Grupo F">Grupo F</option>
          <option value="Grupo G">Grupo G</option>
          <option value="Grupo H">Grupo H</option>
          <option value="Grupo I">Grupo I</option>
          <option value="Grupo J">Grupo J</option>
          <option value="Grupo K">Grupo K</option>
          <option value="Grupo L">Grupo L</option>
        </select>
      </div>

      {savedMsg && (
        <div style={styles.savedAlert}>{savedMsg}</div>
      )}

      <div style={styles.accordionList}>
        {matchdays.map(md => {
          const stats = getMatchdayStats(md.id);
          const isOpen = expandedMatchday === md.id;
          const mdMatches = getMatchesForMatchday(md.id);

          return (
            <div key={md.id} style={styles.accordionItem}>
              {/* HEADER */}
              <button onClick={() => toggleMatchday(md.id)} style={styles.accordionHeader}>
                <div style={styles.headerLeft}>
                  <span style={styles.chevron}>{isOpen ? '▼' : '▶'}</span>
                  <span style={styles.headerTitle}>Fecha {md.number}</span>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: md.status === 'ABIERTA' ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)',
                    color: md.status === 'ABIERTA' ? 'var(--color-success)' : 'var(--color-danger)',
                  }}>{md.status}</span>
                </div>
                <div style={styles.headerRight}>
                  <span style={styles.progressText}>{stats.finalized}/{stats.total} finalizados</span>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: stats.total > 0 ? `${(stats.finalized / stats.total) * 100}%` : '0%'}}></div>
                  </div>
                </div>
              </button>

              {/* BODY */}
              {isOpen && (
                <div style={styles.accordionBody}>
                  {mdMatches.length === 0 && (
                    <p style={{color: 'var(--color-text-muted)', padding: '15px'}}>No hay partidos en esta fecha.</p>
                  )}
                  {mdMatches.length > 0 && (
                    <div style={{padding: '15px 15px 0 15px'}}>
                      <button onClick={() => syncWithAPI(md.id)} className="btn-sporty-outline" style={{width: 'auto', padding: '8px 15px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#fff', borderColor: 'rgba(255,255,255,0.4)'}}>
                        <span>🔄</span> Auto-completar desde API
                      </button>
                    </div>
                  )}

                  <div style={styles.matchesGrid}>
                    {mdMatches.map(match => (
                      <div key={match.id} style={{
                        ...styles.matchCard,
                        borderLeft: match.status === 'FINALIZADO' ? '3px solid var(--color-success)' : '3px solid rgba(255,255,255,0.1)',
                      }}>
                        <div style={styles.matchMeta}>
                          <span style={styles.groupTag}>{match.group}</span>
                          <span style={styles.dateMini}>{match.date.slice(5)} {match.time}</span>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 'bold',
                            padding: '1px 6px',
                            borderRadius: '3px',
                            backgroundColor: match.status === 'FINALIZADO' ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.1)',
                            color: match.status === 'FINALIZADO' ? 'var(--color-success)' : 'var(--color-text-muted)',
                          }}>{match.status}</span>
                        </div>

                        <div style={styles.matchRow}>
                          <span style={{...styles.team, textAlign: 'right'}}>{match.local}</span>
                          <input
                            type="number" min="0"
                            style={{
                              ...styles.scoreInput,
                              borderColor: match.status === 'FINALIZADO' ? 'var(--color-success)' : 'rgba(255,255,255,0.2)',
                            }}
                            value={match.scoreLocal !== null ? match.scoreLocal : ''}
                            onChange={(e) => handleScoreChange(match.id, 'scoreLocal', e.target.value)}
                            disabled={match.status === 'FINALIZADO'}
                          />
                          <span style={styles.vs}>vs</span>
                          <input
                            type="number" min="0"
                            style={{
                              ...styles.scoreInput,
                              borderColor: match.status === 'FINALIZADO' ? 'var(--color-success)' : 'rgba(255,255,255,0.2)',
                            }}
                            value={match.scoreVisitante !== null ? match.scoreVisitante : ''}
                            onChange={(e) => handleScoreChange(match.id, 'scoreVisitante', e.target.value)}
                            disabled={match.status === 'FINALIZADO'}
                          />
                          <span style={{...styles.team, textAlign: 'left'}}>{match.visitante}</span>
                        </div>

                        {match.status !== 'FINALIZADO' && match.scoreLocal !== null && match.scoreVisitante !== null && (
                          <button onClick={() => finalizeMatch(match)} style={styles.finalizeBtn}>
                            Finalizar partido
                          </button>
                        )}
                        {match.status === 'FINALIZADO' && (
                          <div style={styles.finalizedLabel}>✔ Finalizado</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {mdMatches.length > 0 && (
                    <div style={{padding: '15px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
                      <button onClick={() => saveAllResults(md.id)} className="btn-sporty" style={{width: 'auto', padding: '10px 25px'}}>
                        💾 Guardar y finalizar todos los resultados
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {matchdays.length === 0 && (
          <p style={{color: 'var(--color-text-muted)'}}>No hay fechas creadas aun.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageTitle: {
    fontSize: '28px',
    marginBottom: '5px',
  },
  savedAlert: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    color: 'var(--color-green-light)',
    padding: '10px 15px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  accordionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  accordionItem: {
    background: 'rgba(20, 30, 20, 0.5)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    overflow: 'hidden',
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
    transition: 'background 0.2s',
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
    letterSpacing: '0.5px',
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
    background: 'rgba(0,0,0,0.15)',
  },
  matchesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    padding: '15px',
  },
  matchCard: {
    background: 'rgba(0,0,0,0.25)',
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
    gap: '6px',
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
  vs: {
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.3)',
    fontSize: '11px',
  },
  scoreInput: {
    width: '42px',
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
  finalizeBtn: {
    marginTop: '6px',
    width: '100%',
    padding: '5px',
    fontSize: '11px',
    fontWeight: '700',
    background: 'transparent',
    border: '1px solid var(--color-green-light)',
    color: 'var(--color-green-light)',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  finalizedLabel: {
    marginTop: '6px',
    textAlign: 'center',
    fontSize: '11px',
    color: 'var(--color-success)',
    fontWeight: 'bold',
  },
};

export default AdminResults;
