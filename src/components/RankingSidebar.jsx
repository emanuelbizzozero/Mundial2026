import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const RankingSidebar = () => {
  const { currentUser } = useAuth();
  const { users, matchdays, calculateUserPoints } = useData();
  const [expandedSection, setExpandedSection] = useState('general');
  const navigate = useNavigate();

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
    const ranked = getRankedUsers(type).slice(0, 8); // Mostrar solo el Top 8
    const currentUserRank = getRankedUsers(type).findIndex(u => u.id === currentUser?.id);

    return (
      <div style={styles.rankingBody}>
        {/* Full table (compact) */}
        {ranked.length > 0 && (
          <div style={styles.tableWrap}>
            {ranked.map((user, index) => (
              <div key={user.id} style={{
                ...styles.rankRow,
                background: user.id === currentUser?.id ? 'rgba(74, 222, 128, 0.15)' : 'transparent',
                borderLeft: user.id === currentUser?.id ? '3px solid var(--color-green-light)' : '3px solid transparent',
              }}>
                <span style={{...styles.rankPos, color: index < 3 ? 'var(--color-primary)' : 'var(--color-text-muted)'}}>
                  {getMedalEmoji(index)}
                </span>
                <span style={styles.rankName}>{user.name || user.username} {user.lastName || ''}</span>
                <span style={styles.rankPts}>{user.points} pts</span>
              </div>
            ))}
          </div>
        )}

        {currentUserRank >= 0 && (
          <div style={styles.yourPosition}>
            Tu posicion: <strong>#{currentUserRank + 1}</strong>
          </div>
        )}

        {ranked.length === 0 && (
          <p style={{color: 'var(--color-text-muted)', textAlign: 'center', padding: '10px', fontSize: '13px'}}>No hay usuarios activos aun.</p>
        )}
      </div>
    );
  };

  return (
    <div style={styles.sidebar}>
      {/* HEADER BUTTON AS IN THE DRAWING */}
      <button onClick={() => navigate('/rankings')} style={styles.fullRankingBtn}>
        🏆 Ver Ranking Completo ↗
      </button>

      {/* RANKING GENERAL */}
      <div style={styles.accordionItem}>
        <button onClick={() => toggleSection('general')} style={styles.accordionHeader}>
          <div style={styles.headerLeft}>
            <span style={styles.chevron}>{expandedSection === 'general' ? '▼' : '▶'}</span>
            <span style={styles.headerTitle}>🏆 Ranking General</span>
          </div>
        </button>
        {expandedSection === 'general' && renderRankingList('general')}
      </div>

      <h3 style={{fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '10px', marginTop: '15px', paddingBottom: '5px', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
        Resultados por Fecha
      </h3>

      {/* RANKING POR FECHA */}
      {matchdays.map(md => (
        <div key={md.id} style={styles.accordionItem}>
          <button onClick={() => toggleSection(`fecha-${md.id}`)} style={{...styles.accordionHeader, padding: '10px 15px'}}>
            <div style={styles.headerLeft}>
              <span style={styles.chevron}>{expandedSection === `fecha-${md.id}` ? '▼' : '▶'}</span>
              <span style={{...styles.headerTitle, fontSize: '14px'}}>📅 Fecha {md.number}</span>
            </div>
            <span style={{
              ...styles.statusTag,
              backgroundColor: md.status === 'ABIERTA' ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)',
              color: md.status === 'ABIERTA' ? 'var(--color-success)' : 'var(--color-danger)',
            }}>{md.status}</span>
          </button>
          {expandedSection === `fecha-${md.id}` && renderRankingList(`fecha-${md.id}`)}
        </div>
      ))}
    </div>
  );
};

const styles = {
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  accordionItem: {
    background: 'rgba(20, 30, 20, 0.4)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  accordionHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 15px',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  chevron: {
    fontSize: '10px',
    color: 'var(--color-text-muted)',
  },
  headerTitle: {
    fontSize: '16px',
    fontWeight: '800',
  },
  statusTag: {
    fontSize: '9px',
    fontWeight: '800',
    padding: '2px 6px',
    borderRadius: '3px',
    textTransform: 'uppercase',
  },
  rankingBody: {
    borderTop: '1px solid rgba(255,255,255,0.05)',
    padding: '10px',
    background: 'rgba(0,0,0,0.15)',
  },
  tableWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  rankRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: '6px',
    gap: '10px',
  },
  rankPos: {
    width: '30px',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  rankName: {
    flex: 1,
    fontWeight: '600',
    color: '#fff',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rankPts: {
    fontWeight: '800',
    color: 'var(--color-green-light)',
    fontSize: '13px',
  },
  yourPosition: {
    marginTop: '10px',
    padding: '8px',
    background: 'rgba(74, 222, 128, 0.1)',
    borderRadius: '6px',
    textAlign: 'center',
    color: 'var(--color-green-light)',
    fontSize: '12px',
    border: '1px solid rgba(74, 222, 128, 0.2)',
  },
  fullRankingBtn: {
    width: '100%',
    padding: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '800',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    marginBottom: '5px',
  }
};

export default RankingSidebar;
