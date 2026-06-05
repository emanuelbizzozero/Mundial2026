import React from 'react';
import { useData } from '../../context/DataContext';
import { Users, UserCheck, UserX, Clock, DollarSign, Activity } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div style={{...styles.statCard, borderLeft: `4px solid ${color}`}}>
    <div style={styles.statInfo}>
      <h3 style={styles.statTitle}>{title}</h3>
      <p style={{...styles.statValue, color}}>{value}</p>
    </div>
    <div style={{...styles.statIcon, color}}>
      {icon}
    </div>
  </div>
);

const AdminDashboard = () => {
  const { users, economics } = useData();

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'ACTIVO' && u.role !== 'admin').length;
  const pendingUsers = users.filter(u => u.status === 'PENDIENTE').length;
  const blockedUsers = users.filter(u => u.status === 'BLOQUEADO').length;

  const totalPool = activeUsers * economics.entryFee;
  const generalPrize = totalPool * 0.5;
  const perMatchdayPrize = (totalPool * 0.5) / economics.totalMatchdays;

  return (
    <div>
      <h1 style={styles.pageTitle}>Dashboard General</h1>
      
      <div style={styles.grid}>
        <StatCard title="Total Usuarios" value={totalUsers} icon={<Users size={32} />} color="var(--color-accent)" />
        <StatCard title="Usuarios Activos (Participantes)" value={activeUsers} icon={<UserCheck size={32} />} color="var(--color-success)" />
        <StatCard title="Pendientes" value={pendingUsers} icon={<Clock size={32} />} color="var(--color-info)" />
        <StatCard title="Bloqueados" value={blockedUsers} icon={<UserX size={32} />} color="var(--color-danger)" />
      </div>

      <h2 style={styles.sectionTitle}>Resumen Económico (Tiempo Real)</h2>
      
      <div style={styles.grid}>
        <StatCard title="Pozo Total" value={`$${totalPool.toLocaleString()}`} icon={<DollarSign size={32} />} color="var(--color-info)" />
        <StatCard title="Premio General (50%)" value={`$${generalPrize.toLocaleString()}`} icon={<DollarSign size={32} />} color="var(--color-primary)" />
        <StatCard title={`Premio por Fecha (50% / ${economics.totalMatchdays})`} value={`$${perMatchdayPrize.toLocaleString()}`} icon={<DollarSign size={32} />} color="var(--color-success)" />
      </div>

      <h2 style={styles.sectionTitle}>Progreso del Torneo</h2>
      <div style={styles.grid}>
        <StatCard title="Fechas" value={economics.totalMatchdays} icon={<Activity size={32} />} color="var(--color-accent)" />
        <StatCard title="Partidos por Fecha" value={economics.matchesPerMatchday} icon={<Activity size={32} />} color="var(--color-accent)" />
        <StatCard title="Total Partidos" value={economics.totalMatchdays * economics.matchesPerMatchday} icon={<Activity size={32} />} color="var(--color-accent)" />
      </div>
    </div>
  );
};

const styles = {
  pageTitle: {
    fontSize: '28px',
    marginBottom: '30px',
    color: 'var(--color-text-main)',
  },
  sectionTitle: {
    fontSize: '22px',
    marginTop: '40px',
    marginBottom: '20px',
    color: 'var(--color-secondary)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  statCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  statTitle: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    fontWeight: '500',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '800',
  },
  statIcon: {
    opacity: 0.8,
  }
};

export default AdminDashboard;
