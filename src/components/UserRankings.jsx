import React from 'react';
import { useData } from '../context/DataContext';

const Medal = ({ position }) => {
  const getMedalColor = () => {
    switch(position) {
      case 1: return '#F59E0B'; // Gold
      case 2: return '#D1D5DB'; // Silver
      case 3: return '#B45309'; // Bronze
      default: return 'transparent';
    }
  };

  return (
    <div style={styles.medalContainer}>
      <div style={styles.ribbon}></div>
      <div style={{...styles.medalCoin, backgroundColor: getMedalColor()}}>
        {position}
      </div>
    </div>
  );
};

const UserRankings = ({ title, type }) => {
  const { users } = useData();

  // Mock scoring for now. 
  // In reality: type === 'general' gives overall points. type === 'matchday' gives points for the current matchday.
  const getMockPoints = (userId) => {
    const seed = type === 'general' ? userId * 7 : userId * 3;
    return (seed % 20) + (type === 'general' ? 10 : 2);
  };

  const rankedUsers = users
    .filter(u => u.status === 'ACTIVO')
    .map(u => ({ ...u, points: getMockPoints(u.id) }))
    .sort((a, b) => b.points - a.points);

  const top3 = rankedUsers.slice(0, 3);

  return (
    <div className="glass-panel" style={styles.container}>
      <h3 style={styles.title}>{title}</h3>
      <div style={styles.list}>
        {top3.map((user, index) => (
          <div key={user.id} style={styles.listItem}>
            <div style={styles.leftInfo}>
              <span style={{fontWeight: 'bold', color: 'rgba(255,255,255,0.5)', width: '20px'}}>{index + 1}</span>
              <span style={{fontWeight: 'bold', color: '#fff'}}>{user.usuario || 'Usuario'}</span>
            </div>
            <div style={{fontWeight: '800', color: 'var(--color-green-light)'}}>
              {user.points} pts
            </div>
          </div>
        ))}
        {top3.length === 0 && (
          <div style={{color: 'var(--color-text-muted)', fontSize: '12px', textAlign: 'center'}}>
            Aún no hay puntos registrados.
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    marginBottom: '20px',
    background: 'rgba(20, 30, 20, 0.7)', // Slightly darker for sidebar
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#fff',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '10px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  leftInfo: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  }
};

export default UserRankings;
