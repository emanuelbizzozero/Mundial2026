import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, Trophy, DollarSign, Settings, Activity, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Usuarios' },
    { path: '/admin/matchdays', icon: <Calendar size={20} />, label: 'Fechas' },
    { path: '/admin/matches', icon: <Activity size={20} />, label: 'Partidos' },
    { path: '/admin/results', icon: <Trophy size={20} />, label: 'Resultados' },
    { path: '/admin/economics', icon: <DollarSign size={20} />, label: 'Economía' },
    { path: '/admin/rankings', icon: <Trophy size={20} />, label: 'Rankings' },
    { path: '/admin/audit', icon: <Settings size={20} />, label: 'Auditoría' },
  ];

  return (
    <div style={styles.container}>
      <aside className="glass-panel" style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <h2 style={styles.logo}>PRODE <span>ADMIN</span></h2>
        </div>
        
        <nav style={styles.nav}>
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              end={item.end}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {})
              })}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div style={styles.logoutContainer}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={20} />
            <span>Salir</span>
          </button>
        </div>
      </aside>
      
      <main style={styles.main}>
        <div className="glass-panel" style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    padding: '20px',
    gap: '20px',
  },
  sidebar: {
    width: '250px',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0',
  },
  logoContainer: {
    padding: '0 20px 30px 20px',
    borderBottom: '1px solid var(--glass-border)',
    marginBottom: '20px',
  },
  logo: {
    color: 'var(--color-primary)',
    fontFamily: 'var(--font-heading)',
    fontSize: '2.5rem',
    letterSpacing: '2px',
    fontWeight: '400',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    padding: '0 10px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '12px 20px',
    borderRadius: '8px',
    color: 'var(--color-text-muted)',
    transition: 'var(--transition-smooth)',
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 0, 77, 0.1)',
    color: 'var(--color-primary)',
    borderRight: '3px solid var(--color-primary)',
  },
  logoutContainer: {
    padding: '20px',
    borderTop: '1px solid var(--glass-border)',
    marginTop: 'auto',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    width: '100%',
    padding: '12px',
    backgroundColor: 'transparent',
    color: 'var(--color-text-muted)',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'var(--transition-smooth)',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    padding: '30px',
    overflowY: 'auto',
  }
};

export default AdminLayout;
