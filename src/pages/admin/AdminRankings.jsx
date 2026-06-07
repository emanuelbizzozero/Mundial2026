import React from 'react';
import { useData } from '../../context/DataContext';

// A helper to generate the medal based on position
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

const AdminRankings = () => {
  const { users, calculateUserPoints } = useData();

  const rankedUsers = users
    .filter(u => u.status === 'ACTIVO' && u.role !== 'admin')
    .map(u => ({ ...u, points: calculateUserPoints(u.id) }))
    .sort((a, b) => b.points - a.points);

  const top3 = rankedUsers.slice(0, 3);
  const others = rankedUsers.slice(3);

  return (
    <div>
      <h1 style={styles.pageTitle}>Ranking general</h1>

      {/* Top 3 Cards matching the user's provided aesthetic */}
      <div style={styles.top3Grid}>
        {top3.map((user, index) => (
          <div key={user.id} className="glass-panel" style={styles.rankingCard}>
            <Medal position={index + 1} />
            <h3 style={styles.name}>{user.nombre || user.usuario}</h3>
            <div style={styles.points}>{user.points} pts</div>
          </div>
        ))}
        {top3.length === 0 && (
          <div style={{color: 'var(--color-text-muted)'}}>No hay usuarios activos para mostrar en el ranking.</div>
        )}
      </div>

      {/* Rest of the users */}
      {others.length > 0 && (
        <div className="table-container" style={{marginTop: '40px'}}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Posición</th>
                <th>Usuario</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {others.map((user, index) => (
                <tr key={user.id}>
                  <td style={{fontWeight: 'bold', color: 'var(--color-text-muted)'}}>#{index + 4}</td>
                  <td>{user.nombre} {user.apellido} ({user.usuario})</td>
                  <td style={{color: 'var(--color-green-light)', fontWeight: 'bold'}}>{user.points} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageTitle: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  top3Grid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  rankingCard: {
    flex: '1',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px 20px',
    /* Overriding glass-panel slightly to match the exact aesthetic of the image */
    background: 'rgba(50, 70, 40, 0.5)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  medalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '15px',
    position: 'relative',
  },
  ribbon: {
    width: '30px',
    height: '10px',
    backgroundColor: '#3B82F6', // Blue ribbon
    borderRadius: '4px',
    marginBottom: '-5px',
    zIndex: 1,
  },
  medalCoin: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '14px',
    zIndex: 2,
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  name: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '5px',
  },
  points: {
    fontSize: '22px',
    fontWeight: '800',
    color: 'var(--color-green-light)',
  }
};

export default AdminRankings;
