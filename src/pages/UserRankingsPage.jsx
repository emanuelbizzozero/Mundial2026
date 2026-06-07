import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const UserRankingsPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { users, matchdays, calculateUserPoints } = useData();
  const [expandedSection, setExpandedSection] = useState('general');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getRankedUsers = (type) => {
    const mdId = type.startsWith('fecha-') ? Number(type.split('-')[1]) : null;
    return users
      .filter(u => u.status === 'ACTIVO' && u.role !== 'admin')
      .map(u => ({ ...u, points: calculateUserPoints(u.id, mdId) }))
      .sort((a, b) => b.points - a.points);
  };

  const getMedalEmoji = (pos) => {
    if (pos === 0) return '🥇';
    if (pos === 1) return '🥈';
    if (pos === 2) return '🥉';
    return `#${pos + 1}`;
  };

  const renderRankingList = (type) => {
    const ranked = getRankedUsers(type);
    const currentUserRank = ranked.findIndex(u => u.id === currentUser.id);

    return (
      <div style={styles.rankingBody}>
        {/* Top 3 cards */}
        <div className="responsive-top-3-grid">
          {ranked.slice(0, 3).map((user, index) => (
            <div key={user.id} style={{
              ...styles.top3Card,
              border: user.id === currentUser.id ? '2px solid var(--color-green-light)' : '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={styles.medalBig}>{getMedalEmoji(index)}</div>
              <div style={styles.top3Name}>{user.name || user.username}</div>
              <div style={styles.top3Points}>{user.points} pts</div>
            </div>
          ))}
        </div>

        {/* Full table */}
        {ranked.length > 3 && (
          <div style={styles.tableWrap}>
            {ranked.slice(3).map((user, index) => (
              <div key={user.id} style={{
                ...styles.rankRow,
                background: user.id === currentUser.id ? 'rgba(74, 222, 128, 0.1)' : 'transparent',
                borderLeft: user.id === currentUser.id ? '3px solid var(--color-green-light)' : '3px solid transparent',
              }}>
                <span style={styles.rankPos}>#{index + 4}</span>
                <span style={styles.rankName}>{user.name || user.username} {user.lastName || ''}</span>
                <span style={styles.rankPts}>{user.points} pts</span>
              </div>
            ))}
          </div>
        )}

        {currentUserRank >= 0 && (
          <div style={styles.yourPosition}>
            Tu posicion: <strong>#{currentUserRank + 1}</strong> de {ranked.length} participantes
          </div>
        )}

        {ranked.length === 0 && (
          <p style={{color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px'}}>No hay usuarios activos aun.</p>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header className="responsive-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Volver</button>
          <h1 style={{fontSize: '20px', margin: 0}}>🏆 Rankings</h1>
        </div>
        <button onClick={logout} className="btn-sporty-outline" style={{width: 'auto', padding: '8px 16px', fontSize: '13px'}}>Salir</button>
      </header>

      {/* RANKING GENERAL */}
      <div style={styles.accordionItem}>
        <button onClick={() => toggleSection('general')} style={styles.accordionHeader}>
          <div style={styles.headerLeft}>
            <span style={styles.chevron}>{expandedSection === 'general' ? '▼' : '▶'}</span>
            <span style={styles.headerTitle}>🏆 Ranking General</span>
          </div>
          <span style={styles.headerSub}>Acumulado de todas las fechas</span>
        </button>
        {expandedSection === 'general' && renderRankingList('general')}
      </div>

      {/* RANKING POR FECHA */}
      {matchdays.map(md => (
        <div key={md.id} style={styles.accordionItem}>
          <button onClick={() => toggleSection(`fecha-${md.id}`)} style={styles.accordionHeader}>
            <div style={styles.headerLeft}>
              <span style={styles.chevron}>{expandedSection === `fecha-${md.id}` ? '▼' : '▶'}</span>
              <span style={styles.headerTitle}>📅 Ranking Fecha {md.number}</span>
            </div>
            <span style={{
              ...styles.statusTag,
              backgroundColor: md.status === 'ABIERTA' ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)',
              color: md.status === 'ABIERTA' ? 'var(--color-success)' : 'var(--color-danger)',
            }}>{md.status}</span>
          </button>
          {expandedSection === `fecha-${md.id}` && renderRankingList('matchday')}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    padding: '15px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '12px 20px',
    background: 'rgba(20, 30, 20, 0.6)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
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
  accordionItem: {
    background: 'rgba(20, 30, 20, 0.5)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '10px',
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
  headerSub: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
  statusTag: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  rankingBody: {
    borderTop: '1px solid rgba(255,255,255,0.05)',
    padding: '15px 20px',
    background: 'rgba(0,0,0,0.15)',
  },
  top3Grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '15px',
  },
  top3Card: {
    background: 'rgba(50, 70, 40, 0.5)',
    borderRadius: '10px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  medalBig: {
    fontSize: '28px',
    marginBottom: '6px',
  },
  top3Name: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '3px',
  },
  top3Points: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--color-green-light)',
  },
  tableWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  rankRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '6px',
    gap: '12px',
  },
  rankPos: {
    width: '35px',
    fontWeight: 'bold',
    color: 'var(--color-text-muted)',
    fontSize: '13px',
  },
  rankName: {
    flex: 1,
    fontWeight: '600',
    color: '#fff',
    fontSize: '14px',
  },
  rankPts: {
    fontWeight: '800',
    color: 'var(--color-green-light)',
    fontSize: '14px',
  },
  yourPosition: {
    marginTop: '15px',
    padding: '10px',
    background: 'rgba(74, 222, 128, 0.1)',
    borderRadius: '8px',
    textAlign: 'center',
    color: 'var(--color-green-light)',
    fontSize: '14px',
    border: '1px solid rgba(74, 222, 128, 0.2)',
  },
};

export default UserRankingsPage;
