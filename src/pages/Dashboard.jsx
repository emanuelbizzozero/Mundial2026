import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { getFlag } from '../utils/flags';
import RankingSidebar from '../components/RankingSidebar';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const { users, economics, matchdays, matches, predictions, savePredictions, calculateUserPoints } = useData();
  const navigate = useNavigate();
  
  const [currentMatchday, setCurrentMatchday] = useState(null);
  const [matchdayMatches, setMatchdayMatches] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMsg, setErrorModalMsg] = useState('');
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [finishedMatchdayWinner, setFinishedMatchdayWinner] = useState(null);
  const [hideWinnerBanner, setHideWinnerBanner] = useState(false);

  const hasPredicted = (matchId) => {
    return predictions.some(p => p.matchId === matchId && p.userId === currentUser.id);
  };
  
  const allPredicted = matchdayMatches.length > 0 && matchdayMatches.every(m => hasPredicted(m.id));

  // Calculate Economics
  const activeUsersCount = users.filter(u => u.status === 'ACTIVO' && u.role !== 'admin').length;
  const entryFee = economics ? economics.entry_fee || economics.entryFee || 0 : 0;
  const totalMatchdays = economics ? economics.total_matchdays || economics.totalMatchdays || 0 : 0;
  
  const totalPozo = activeUsersCount * entryFee;
  const prizeGeneral = totalPozo * 0.7;
  const prizePerMatchday = totalMatchdays > 0 ? (totalPozo * 0.3) / totalMatchdays : 0;

  useEffect(() => {
    const activeMd = matchdays.find(m => m.status === 'ABIERTA');
    if (activeMd) {
      setCurrentMatchday(activeMd);
      const mMatches = matches
        .filter(m => m.matchdayId === activeMd.id)
        .sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return a.time.localeCompare(b.time);
        });
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

  useEffect(() => {
    let latestFinished = null;
    const sortedMatchdays = [...matchdays].sort((a, b) => b.number - a.number);
    
    for (const md of sortedMatchdays) {
      const mdMatches = matches.filter(m => m.matchdayId === md.id);
      if (mdMatches.length > 0) {
        const allPlayed = mdMatches.every(m => m.scoreLocal !== null && m.scoreVisitante !== null);
        if (allPlayed) {
          latestFinished = md;
          break;
        }
      }
    }

    if (latestFinished) {
      const activeUsers = users.filter(u => u.status === 'ACTIVO' && u.role !== 'admin');
      let maxScore = -1;
      let topUsers = [];

      activeUsers.forEach(u => {
        const score = calculateUserPoints(u.id, latestFinished.id);
        if (score > maxScore) {
          maxScore = score;
          topUsers = [u];
        } else if (score === maxScore && score > 0) {
          topUsers.push(u);
        }
      });

      if (maxScore > 0 && topUsers.length > 0) {
        setFinishedMatchdayWinner({
          matchday: latestFinished,
          users: topUsers,
          score: maxScore
        });
      } else {
        setFinishedMatchdayWinner(null);
      }
    } else {
      setFinishedMatchdayWinner(null);
    }
  }, [matchdays, matches, users, predictions, calculateUserPoints]);

  const handleInputChange = (matchId, field, value) => {
    setUserInputs(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [field]: value }
    }));
    setShowErrorModal(false);
    setPdfDataUrl(null);
  };

  const generatePDF = (predictionsList, dateStr) => {
    let doc;
    try {
      const jsPDFClass = jsPDF.jsPDF || jsPDF.default || jsPDF;
      doc = new jsPDFClass();
    } catch (e) {
      console.error("jsPDF instantiation failed, trying standard new jsPDF()", e);
      doc = new jsPDF();
    }

    // Dark Background for entire A4 page (210 x 297 mm)
    doc.setFillColor(15, 20, 40); // Dark navy blue background
    doc.rect(0, 0, 210, 297, 'F');

    // Header Color band
    doc.setFillColor(20, 83, 45); // Dark green
    doc.rect(0, 0, 210, 35, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("PRODE MUNDIAL 2026", 15, 22);

    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.setFont("helvetica", "normal");
    const name = currentUser.name || currentUser.username || 'Usuario';
    doc.text(`Participante: ${name}`, 15, 45);
    doc.text(`Fecha de la apuesta: ${dateStr}`, 15, 52);
    doc.text(`Fecha del Prode: ${currentMatchday ? `Fecha ${currentMatchday.number}` : ''}`, 15, 59);

    // Separator line
    doc.setDrawColor(80, 80, 80);
    doc.line(15, 65, 195, 65);

    // Predictions Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(74, 222, 128); // Green light
    doc.text("Tus Predicciones Guardadas", 15, 73);

    // Table headers
    let y = 80;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Grupo", 15, y);
    doc.text("Partido", 45, y);
    doc.text("Prediccion", 145, y);
    
    y += 4;
    doc.line(15, y, 195, y);
    y += 8;

    // Matches
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    predictionsList.forEach((pred) => {
      const match = matchdayMatches.find(m => m.id === pred.matchId);
      if (!match) return;

      doc.setTextColor(200, 200, 200);
      doc.text(match.group || 'N/A', 15, y);
      
      doc.setTextColor(255, 255, 255);
      const matchText = `${match.local} vs ${match.visitante}`;
      doc.text(matchText, 45, y);
      
      const predictionText = `${pred.predictedLocal} - ${pred.predictedVisitante}`;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(74, 222, 128);
      doc.text(predictionText, 145, y);
      doc.setFont("helvetica", "normal");

      y += 6.5;
    });

    // Separator line
    y += 4;
    doc.line(15, y, 195, y);
    y += 8;

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Comprobante oficial generado por Prode Mundial 2026. ¡Buena suerte!", 15, y);

    const filename = `Apuesta_${name.replace(/\s+/g, '_')}_Fecha_${currentMatchday?.number || 'X'}.pdf`;

    // Try automatic download
    try {
      doc.save(filename);
    } catch (saveError) {
      console.error("Auto-download failed:", saveError);
    }

    // Generate Blob for manual download fallback
    try {
      const blob = doc.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      setPdfDataUrl(blobUrl);
    } catch (blobError) {
      console.error("Blob URL generation failed:", blobError);
    }
  };

  const confirmSave = () => {
    setShowConfirmModal(false);
    setShowErrorModal(false);
    setSuccessMsg('');
    setPdfDataUrl(null);

    const newPredictions = [];
    for (const match of matchdayMatches) {
      const inputs = userInputs[match.id] || { local: '', visitante: '' };
      newPredictions.push({
        id: `${currentUser.id}-${match.id}`,
        userId: currentUser.id,
        matchdayId: currentMatchday.id,
        matchId: match.id,
        predictedLocal: inputs.local !== '' ? Number(inputs.local) : 0,
        predictedVisitante: inputs.visitante !== '' ? Number(inputs.visitante) : 0
      });
    }

    try {
      savePredictions(currentUser.id, currentMatchday.id, newPredictions);
      
      const now = new Date();
      const dateStr = now.toLocaleString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      generatePDF(newPredictions, dateStr);
      setSuccessMsg('¡Apuesta guardada y PDF generado!');
    } catch (err) {
      console.error(err);
      setErrorModalMsg(`Error al procesar apuesta: ${err.message || err}`);
      setShowErrorModal(true);
    }

    setTimeout(() => {
      setSuccessMsg('');
    }, 15000);
  };

  const handleSave = () => {
    setShowErrorModal(false);
    setSuccessMsg('');
    setPdfDataUrl(null);
    let hasEmpty = false;

    for (const match of matchdayMatches) {
      const inputs = userInputs[match.id];
      if (!inputs || inputs.local === '' || inputs.visitante === '') {
        hasEmpty = true;
        break;
      }
    }

    if (hasEmpty) {
      setErrorModalMsg('Faltan cargar resultados. Completa todos los partidos antes de guardar.');
      setShowErrorModal(true);
      return;
    }

    setShowConfirmModal(true);
  };

  const handlePrint = () => window.print();

  return (
    <div style={styles.container}>
      {/* PREMIUM NAVBAR */}
      <header className="premium-navbar no-print">
        <div className="premium-navbar-left">
          <img src="/trophy.png" alt="Copa del Mundo" className="premium-trophy-img" />
          <div className="premium-titles">
            <h1 className="premium-title">PRODE MUNDIAL</h1>
            <h2 className="premium-subtitle">2026</h2>
            <div className="premium-countries">
              <span className="country-ca">CANADÁ</span> <span style={{color:'#64748b'}}>•</span> <span className="country-us">ESTADOS UNIDOS</span> <span style={{color:'#64748b'}}>•</span> <span className="country-mx">MÉXICO</span>
            </div>
          </div>
        </div>

        <div className="premium-navbar-center">
          <div className="stat-box-premium">
            <span className="stat-box-icon">💰</span>
            <div className="stat-box-info">
              <span className="stat-box-label">POZO</span>
              <span className="stat-box-value">${totalPozo.toLocaleString('es-AR')}</span>
            </div>
          </div>
          <div className="stat-box-premium">
            <span className="stat-box-icon">🏆</span>
            <div className="stat-box-info">
              <span className="stat-box-label">PREMIO GRAL.</span>
              <span className="stat-box-value">${prizeGeneral.toLocaleString('es-AR')}</span>
            </div>
          </div>
          <div className="stat-box-premium">
            <span className="stat-box-icon">📅</span>
            <div className="stat-box-info">
              <span className="stat-box-label">PREMIO / FECHA</span>
              <span className="stat-box-value">${prizePerMatchday.toLocaleString('es-AR', {maximumFractionDigits: 0})}</span>
            </div>
          </div>
        </div>

        <div className="premium-navbar-user">
          <span className="navbar-username">👤 {currentUser.name || currentUser.username}</span>
          <button onClick={logout} className="navbar-logout-btn">Salir 🚪</button>
        </div>
      </header>

      {/* WINNER BANNER */}
      {finishedMatchdayWinner && !hideWinnerBanner && (
        <>
          <style>{`
            @keyframes pulse-glow {
              0% { box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); }
              100% { box-shadow: 0 4px 25px rgba(245, 158, 11, 0.7); }
            }
          `}</style>
          <div className="no-print" style={{...styles.winnerBanner, position: 'relative'}}>
            <button 
              onClick={() => setHideWinnerBanner(true)} 
              style={{
                position: 'absolute', 
                top: '8px', 
                right: '12px', 
                background: 'rgba(0,0,0,0.2)', 
                border: '1px solid rgba(255,255,255,0.3)', 
                borderRadius: '12px',
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '11px', 
                padding: '2px 8px',
                cursor: 'pointer',
                fontWeight: '600',
                letterSpacing: '0.5px',
                transition: 'all 0.2s'
              }}
            >
              Cerrar
            </button>
            <div style={styles.winnerIcon}>🏆</div>
            <div style={styles.winnerContent}>
              <h3 style={styles.winnerTitle}>¡Ganador{finishedMatchdayWinner.users.length > 1 ? 'es' : ''} de la Fecha {finishedMatchdayWinner.matchday.number}!</h3>
              <p style={styles.winnerNames}>
                {finishedMatchdayWinner.users.map(u => u.name || u.username).join(' - ')}
              </p>
              <span style={styles.winnerScore}>Con {finishedMatchdayWinner.score} puntos increíbles</span>
            </div>
            <div style={styles.winnerIcon}>🥇</div>
          </div>
        </>
      )}

      {/* ALERTS */}
      {successMsg && (
        <div className="no-print" style={styles.alertSuccess}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px', width: '100%'}}>
            <span style={{fontWeight: 'bold'}}>{successMsg}</span>
            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
              {pdfDataUrl && (
                <a 
                  href={pdfDataUrl} 
                  download={`Apuesta_${(currentUser.name || currentUser.username || 'Usuario').replace(/\s+/g, '_')}_Fecha_${currentMatchday?.number || 'X'}.pdf`}
                  className="btn-sporty" 
                  style={{
                    width: 'auto', 
                    padding: '8px 16px', 
                    fontSize: '13px', 
                    backgroundColor: 'var(--color-primary)', 
                    color: '#000', 
                    textDecoration: 'none', 
                    borderRadius: '8px', 
                    fontWeight: '800',
                    display: 'inline-flex', 
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  📥 Descargar Comprobante PDF
                </a>
              )}
              <button onClick={handlePrint} style={{...styles.printBtn, padding: '8px 16px', borderRadius: '8px', fontSize: '13px'}}>
                🖨️ Imprimir Pantalla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN SPLIT LAYOUT */}
      <div className="dashboard-split-layout">
        
        {/* LEFT COLUMN: MATCHES (WIDE) */}
        <div className="dashboard-main-column">
          <div className="glass-panel" style={{padding: '0', overflow: 'hidden'}}>
            {/* Table Header */}
            <div className="premium-table-header">
              <h2 className="premium-table-title">
                📅 {currentMatchday ? `FECHA ${currentMatchday.number} — FASE DE GRUPOS` : 'NO HAY FECHAS ACTIVAS'}
              </h2>
              <button onClick={() => navigate('/resultados')} style={styles.resultsBtn}>
                📊 Resultados ↗
              </button>
            </div>

            {!currentMatchday && (
              <p style={{color: 'var(--color-text-muted)', padding: '20px'}}>El administrador aun no ha habilitado ninguna fecha.</p>
            )}

            {currentMatchday && matchdayMatches.length > 0 && (
              <>
              <div className="glass-panel matches-container-premium">
                <div className="matches-grid" style={{padding: '15px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  {matchdayMatches.map(match => {
                    const predicted = hasPredicted(match.id);
                    return (
                      <div key={match.id} className={`match-card-modern ${predicted ? 'predicted' : ''}`}>
                        <div className="match-card-header">
                          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <span className="match-group-badge">{match.group}</span>
                            <span className="match-meta-info">📅 {match.date.slice(5).replace('-', '/')} • ⏰ {match.time} HS</span>
                          </div>
                          <span className="match-stadium-info">📍 {match.stadium}</span>
                        </div>
                        
                        <div className="match-card-body">
                          <div className="team-side local">
                            <span className="team-flag">{getFlag(match.local)}</span>
                            <span className="team-name">{match.local}</span>
                          </div>
                          
                          <div className="score-inputs">
                            <input 
                              type="number" min="0"
                              className="modern-score-input"
                              value={userInputs[match.id]?.local ?? ''}
                              onChange={(e) => handleInputChange(match.id, 'local', e.target.value)}
                              disabled={match.status !== 'PROXIMO' || predicted}
                            />
                            <span className="vs-badge">VS</span>
                            <input 
                              type="number" min="0"
                              className="modern-score-input"
                              value={userInputs[match.id]?.visitante ?? ''}
                              onChange={(e) => handleInputChange(match.id, 'visitante', e.target.value)}
                              disabled={match.status !== 'PROXIMO' || predicted}
                            />
                          </div>
                          
                          <div className="team-side visitante">
                            <span className="team-name">{match.visitante}</span>
                            <span className="team-flag">{getFlag(match.visitante)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              </>
            )}

            {/* Save button inside the table panel */}
            {currentMatchday && matchdayMatches.length > 0 && !allPredicted && (
              <div className="no-print" style={{padding: '15px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end'}}>
                <button onClick={handleSave} className="premium-save-btn" style={{width: 'auto'}}>
                  💾 Guardar Pronósticos
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: RANKINGS (NARROW) */}
        <div className="dashboard-sidebar">
          <RankingSidebar 
            totalPozo={totalPozo} 
            activeUsersCount={activeUsersCount}
            completedPredictions={matchdayMatches.filter(m => hasPredicted(m.id)).length}
            totalPredictions={matchdayMatches.length}
          />
        </div>
      </div>

      {/* ERROR MODAL */}
      {showErrorModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel" style={{...styles.modalContent, border: '1px solid rgba(239, 68, 68, 0.4)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 20, 20, 0.95) 100%)'}}>
            <h3 style={{...styles.modalTitle, color: '#ef4444'}}>⚠️ Aviso</h3>
            <p style={styles.modalText}>
              {errorModalMsg}
            </p>
            <div style={styles.modalActions}>
              <button 
                onClick={() => setShowErrorModal(false)} 
                className="btn-sporty" 
                style={{flex: 1, padding: '10px', backgroundColor: '#ef4444', color: '#fff'}}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {showConfirmModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel" style={styles.modalContent}>
            <h3 style={styles.modalTitle}>⚽ Confirmar Apuesta</h3>
            <p style={styles.modalText}>
              ¿Deseas guardar tus predicciones para la <strong>Fecha {currentMatchday?.number}</strong>?
            </p>
            <p style={styles.modalSubtext}>
              Se descargará un comprobante en PDF con tu apuesta y la hora actual.
            </p>
            <div style={styles.modalActions}>
              <button 
                onClick={() => setShowConfirmModal(false)} 
                className="btn-sporty-outline" 
                style={{flex: 1, padding: '10px'}}
              >
                No, Cancelar
              </button>
              <button 
                onClick={confirmSave} 
                className="btn-sporty" 
                style={{flex: 1, padding: '10px', backgroundColor: 'var(--color-primary)', color: '#000'}}
              >
                Sí, Guardar
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
    padding: '15px',
    maxWidth: '1500px',
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
  tableHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 20px',
    background: 'rgba(255,255,255,0.03)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  tableCol: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    transition: 'background 0.2s',
  },
  tableColData: {
    fontWeight: '600',
  },
  groupBadge: {
    background: 'rgba(59,130,246,0.2)',
    color: '#60A5FA',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  teamName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
  modalSubtext: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    marginBottom: '25px',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
  },
  winnerBanner: {
    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%)',
    borderRadius: '12px',
    padding: '15px 20px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    animation: 'pulse-glow 2s infinite alternate',
  },
  winnerContent: {
    textAlign: 'center',
    flex: 1,
    padding: '0 15px',
  },
  winnerIcon: {
    fontSize: '36px',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
  },
  winnerTitle: {
    color: '#fff',
    fontSize: '16px',
    margin: '0 0 5px 0',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '800',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
  },
  winnerNames: {
    color: '#fff',
    fontSize: '22px',
    margin: '0 0 8px 0',
    fontWeight: '900',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  },
  winnerScore: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: '14px',
    fontWeight: '700',
    background: 'rgba(0, 0, 0, 0.25)',
    padding: '4px 12px',
    borderRadius: '20px',
  },
};

export default Dashboard;
