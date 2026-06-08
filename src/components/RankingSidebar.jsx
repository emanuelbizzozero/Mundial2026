import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const RankingSidebar = ({ totalPozo, activeUsersCount, completedPredictions, totalPredictions }) => {
  const { currentUser } = useAuth();
  const { users, matchdays, calculateUserPoints } = useData();
  const navigate = useNavigate();

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
    return `${pos + 1}`;
  };

  const generalRanked = getRankedUsers('general');
  const currentUserGeneralRank = generalRanked.findIndex(u => u.id === currentUser?.id);

  // Find the active matchday for "ranking por fecha"
  const activeMd = matchdays.find(m => m.status === 'ABIERTA');
  const fechaRanked = activeMd ? getRankedUsers(`fecha-${activeMd.id}`) : [];

  return (
    <div style={s.sidebar}>
      {/* RANKINGS HEADER */}
      <div style={s.sectionHeader}>
        <span style={{fontSize: '18px'}}>🏆</span>
        <h3 style={s.sectionTitle}>RANKINGS</h3>
      </div>

      {/* TWO RANKING CARDS SIDE BY SIDE */}
      <div style={s.rankingRow}>
        {/* RANKING GENERAL */}
        <div style={{...s.rankingCard, borderTop: '3px solid #F59E0B'}}>
          <h4 style={s.rankingCardTitle}>
            <span style={{color: '#F59E0B'}}>🏆</span> RANKING GENERAL
          </h4>
          <div style={s.rankList}>
            {generalRanked.slice(0, 3).map((user, i) => (
              <div key={user.id} style={{
                ...s.rankItem,
                background: user.id === currentUser?.id ? 'rgba(74,222,128,0.15)' : 'transparent',
              }}>
                <span style={{...s.rankPos, color: i < 3 ? '#F59E0B' : '#aaa'}}>{getMedalEmoji(i)}</span>
                <span style={s.rankName}>{user.name || user.username}</span>
                <span style={s.rankPts}>{user.points} pts</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/rankings')} style={s.goBtn}>
            IR AL RANKING →
          </button>
        </div>

        {/* RANKING POR FECHA */}
        <div style={{...s.rankingCard, borderTop: '3px solid #3B82F6'}}>
          <h4 style={s.rankingCardTitle}>
            <span style={{color: '#3B82F6'}}>📅</span> RANKING POR FECHA
          </h4>
          <div style={s.rankList}>
            {fechaRanked.slice(0, 3).map((user, i) => (
              <div key={user.id} style={{
                ...s.rankItem,
                background: user.id === currentUser?.id ? 'rgba(74,222,128,0.15)' : 'transparent',
              }}>
                <span style={{...s.rankPos, color: i < 3 ? '#3B82F6' : '#aaa'}}>{getMedalEmoji(i)}</span>
                <span style={s.rankName}>{user.name || user.username}</span>
                <span style={s.rankPts}>{user.points} pts</span>
              </div>
            ))}
            {fechaRanked.length === 0 && (
              <p style={{color: '#888', fontSize: '11px', textAlign: 'center', margin: '10px 0'}}>Sin datos aún</p>
            )}
          </div>
          <button onClick={() => navigate('/rankings')} style={{...s.goBtn, background: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.4)', color: '#3B82F6'}}>
            IR AL RANKING →
          </button>
        </div>
      </div>

      {/* STAT CARDS 2x2 */}
      <div style={s.statsGrid}>
        <div style={{...s.statCard, borderLeft: '3px solid #10B981'}}>
          <div style={s.statIcon}>👥</div>
          <div style={s.statLabel}>PARTICIPANTES</div>
          <div style={s.statValue}>{activeUsersCount}</div>
        </div>
        <div style={{...s.statCard, borderLeft: '3px solid #F59E0B'}}>
          <div style={s.statIcon}>💰</div>
          <div style={s.statLabel}>POZO ACUMULADO</div>
          <div style={{...s.statValue, color: '#F59E0B'}}>${totalPozo?.toLocaleString('es-AR')}</div>
        </div>
        <div style={{...s.statCard, borderLeft: '3px solid #6366F1'}}>
          <div style={s.statIcon}>📋</div>
          <div style={s.statLabel}>PRONÓSTICOS REALIZADOS</div>
          <div style={{...s.statValue, color: '#6366F1'}}>{completedPredictions} / {totalPredictions}</div>
          <div style={{fontSize: '10px', color: '#aaa', marginTop: '2px'}}>Completados</div>
        </div>
        <div style={{...s.statCard, borderLeft: '3px solid #EC4899'}}>
          <div style={s.statIcon}>🎯</div>
          <div style={s.statLabel}>TU POSICIÓN ACTUAL</div>
          <div style={{...s.statValue, color: '#EC4899', fontSize: '28px'}}>
            {currentUserGeneralRank >= 0 ? `${currentUserGeneralRank + 1}°` : '-'}
          </div>
          <button onClick={() => navigate('/rankings')} style={{...s.statLink}}>Ver ranking →</button>
        </div>
      </div>
    </div>
  );
};

const s = {
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 15px',
    background: 'rgba(20,30,20,0.6)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '900',
    color: '#fff',
    margin: 0,
    letterSpacing: '1px',
  },
  rankingRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  rankingCard: {
    background: 'rgba(20,30,20,0.5)',
    borderRadius: '10px',
    padding: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
  },
  rankingCardTitle: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#fff',
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  rankList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  rankItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '5px 8px',
    borderRadius: '6px',
  },
  rankPos: {
    width: '22px',
    fontWeight: '900',
    fontSize: '13px',
  },
  rankName: {
    flex: 1,
    fontWeight: '600',
    color: '#fff',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rankPts: {
    fontWeight: '800',
    color: 'var(--color-green-light)',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  goBtn: {
    marginTop: '10px',
    width: '100%',
    padding: '8px',
    background: 'rgba(245,158,11,0.15)',
    border: '1px solid rgba(245,158,11,0.4)',
    color: '#F59E0B',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: '0.5px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  statCard: {
    background: 'rgba(20,30,20,0.5)',
    borderRadius: '10px',
    padding: '15px 12px',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  statIcon: {
    fontSize: '20px',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '9px',
    fontWeight: '800',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '22px',
    fontWeight: '900',
    color: 'var(--color-green-light)',
  },
  statLink: {
    marginTop: '5px',
    background: 'none',
    border: 'none',
    color: '#EC4899',
    fontSize: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    padding: 0,
  },
};

export default RankingSidebar;
