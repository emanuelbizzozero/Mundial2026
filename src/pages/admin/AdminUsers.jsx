import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const AdminUsers = () => {
  const { users, updateUserStatus } = useData();
  const [filter, setFilter] = useState('TODOS');

  const filteredUsers = users.filter(user => {
    if (user.role === 'admin') return false; // Hide admin from typical management table
    if (filter === 'TODOS') return true;
    return user.status === filter;
  });

  const getStatusBadge = (status) => {
    let color = '';
    switch(status) {
      case 'ACTIVO': color = 'var(--color-success)'; break;
      case 'PENDIENTE': color = 'var(--color-warning)'; break;
      case 'BLOQUEADO': color = 'var(--color-danger)'; break;
      default: color = 'var(--color-text-muted)';
    }
    return <span style={{...styles.badge, backgroundColor: `${color}33`, color: color, border: `1px solid ${color}`}}>{status}</span>;
  };

  return (
    <div>
      <h1 style={styles.pageTitle}>Gestión de Usuarios</h1>
      
      <div style={styles.filters}>
        <button style={filter === 'TODOS' ? styles.activeFilter : styles.filterBtn} onClick={() => setFilter('TODOS')}>Todos</button>
        <button style={filter === 'ACTIVO' ? styles.activeFilter : styles.filterBtn} onClick={() => setFilter('ACTIVO')}>Activos</button>
        <button style={filter === 'PENDIENTE' ? styles.activeFilter : styles.filterBtn} onClick={() => setFilter('PENDIENTE')}>Pendientes</button>
        <button style={filter === 'BLOQUEADO' ? styles.activeFilter : styles.filterBtn} onClick={() => setFilter('BLOQUEADO')}>Bloqueados</button>
      </div>

      <div className="table-container">
        <table className="admin-table" style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Usuario</th>
              <th style={styles.th}>Contacto</th>
              <th style={styles.th}>Fecha de registro</th>
              <th style={styles.th}>Estado</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td style={styles.td}>{user.name} {user.lastName}</td>
                <td style={styles.td}>@{user.username}</td>
                <td style={styles.td}>{user.phone}</td>
                <td style={styles.td}>{user.registrationDate}</td>
                <td style={styles.td}>{getStatusBadge(user.status)}</td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    {user.status !== 'ACTIVO' && (
                      <button onClick={() => updateUserStatus(user.id, 'ACTIVO')} style={{...styles.actionBtn, color: 'var(--color-success)', borderColor: 'var(--color-success)'}}>Aprobar</button>
                    )}
                    {user.status !== 'BLOQUEADO' && (
                      <button onClick={() => updateUserStatus(user.id, 'BLOQUEADO')} style={{...styles.actionBtn, color: 'var(--color-danger)', borderColor: 'var(--color-danger)'}}>Bloquear</button>
                    )}
                    {/* Placeholder para editar/eliminar */}
                    <button style={{...styles.actionBtn, color: '#fff', borderColor: 'rgba(255,255,255,0.3)'}}>Editar</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)'}}>No hay usuarios en esta categoría.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  pageTitle: {
    fontSize: '28px',
    marginBottom: '20px',
    color: 'var(--color-text-main)',
  },
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  filterBtn: {
    background: 'transparent',
    border: '1px solid var(--glass-border)',
    color: 'var(--color-text-muted)',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  activeFilter: {
    background: 'var(--color-secondary)',
    border: '1px solid var(--color-secondary)',
    color: '#000',
    fontWeight: '600',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '16px',
    color: 'var(--color-text-muted)',
    fontWeight: '600',
    fontSize: '14px',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  actionBtn: {
    background: 'transparent',
    border: '1px solid',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)',
    letterSpacing: '1px',
    padding: '6px 10px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    textTransform: 'uppercase'
  }
};

export default AdminUsers;
