// lawyer/AuditList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const AuditList = () => {
  const [audits, setAudits] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('/api/audits', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setAudits(res.data))
    .catch(err => console.error('Error fetching audit logs:', err));
  }, []);

  return (
    <div style={{ backgroundColor: '#F9F9F6', padding: '2rem' }}>
      <h2 style={{ color: '#1C2C54' }}>🔒 Registro de Auditoría</h2>
      {audits.length === 0 ? (
        <p style={{ color: '#A0A0A0' }}>No se han registrado eventos en la auditoría.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {audits.map((a) => (
            <li key={a._id} style={{ border: '1px solid #A0A0A0', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
              <h3 style={{ color: '#6E1E2B' }}>{a.action}</h3>
              <p><strong>Usuario:</strong> {a.user}</p>
              <p><strong>Fecha:</strong> {new Date(a.timestamp).toLocaleString()}</p>
              <p><strong>Entidad:</strong> {a.entity}</p>
              <p><strong>Descripción:</strong> {a.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuditList;
