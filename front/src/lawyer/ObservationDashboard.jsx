// lawyer/ObservationDashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ObservationDashboard = () => {
  const { caseId } = useParams();
  const [observations, setObservations] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`/api/observations/case/${caseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setObservations(res.data))
    .catch(err => console.error('Error fetching observations:', err));
  }, [caseId]);

  return (
    <div style={{ backgroundColor: '#F9F9F6', padding: '2rem' }}>
      <h2 style={{ color: '#1C2C54' }}>📝 Observaciones del Caso</h2>
      {observations.length === 0 ? (
        <p style={{ color: '#A0A0A0' }}>No hay observaciones registradas.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {observations.map((obs) => (
            <li key={obs._id} style={{ border: '1px solid #A0A0A0', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
              <h3 style={{ color: '#6E1E2B' }}>{obs.title}</h3>
              <p><strong>Fecha:</strong> {new Date(obs.startDate).toLocaleDateString()}</p>
              <p><strong>Última actualización:</strong> {new Date(obs.lastUpdate).toLocaleDateString()}</p>
              <p><strong>Contenido:</strong> {obs.content}</p>
              <p><strong>Autor:</strong> {obs.author}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ObservationDashboard;
