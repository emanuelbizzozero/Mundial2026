import React from 'react';
import { useData } from '../../context/DataContext';

const AdminAudit = () => {
  const { auditLogs } = useData();

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  return (
    <div>
      <h1 style={styles.pageTitle}>Auditoría del Sistema</h1>
      <p style={{color: 'var(--color-text-muted)', marginBottom: '20px'}}>
        Registro de las acciones administrativas recientes.
      </p>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Usuario / Admin</th>
              <th>Acción</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id}>
                <td style={{color: 'var(--color-text-muted)', fontSize: '14px'}}>{formatDate(log.timestamp)}</td>
                <td style={{fontWeight: 'bold', color: 'var(--color-primary)'}}>{log.user}</td>
                <td>
                  <span style={styles.actionBadge}>{log.action}</span>
                </td>
                <td style={{color: 'var(--color-text-muted)'}}>{log.details}</td>
              </tr>
            ))}
            {auditLogs.length === 0 && (
              <tr>
                <td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>No hay registros de auditoría disponibles.</td>
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
    marginBottom: '10px',
  },
  actionBadge: {
    background: 'rgba(255,255,255,0.1)',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  }
};

export default AdminAudit;
