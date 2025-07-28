// lawyer/CaseInfo.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CaseInfo = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`/api/cases/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setCaseData(res.data))
    .catch(err => console.error('Error fetching case info:', err));
  }, [id]);

  if (!caseData) return <p style={{ color: '#A0A0A0' }}>Cargando información del caso...</p>;

  return (
    <div style={{ backgroundColor: '#F9F9F6', padding: '2rem' }}>
      <h2 style={{ color: '#1C2C54' }}>🔍 Detalles del Caso</h2>
      <div style={{ border: '1px solid #A0A0A0', borderRadius: '8px', padding: '1rem', marginTop: '1rem' }}>
        <h3 style={{ color: '#6E1E2B' }}>{caseData.title}</h3>
        <p><strong>Descripción:</strong> {caseData.description}</p>
        <p><strong>Fecha de inicio:</strong> {new Date(caseData.startDate).toLocaleDateString()}</p>
        <p><strong>Última actualización:</strong> {new Date(caseData.lastUpdate).toLocaleDateString()}</p>
        <p><strong>Estado:</strong> <span style={{ color: '#4CAF50' }}>{caseData.status}</span></p>
        <p><strong>Cliente:</strong> {caseData.client}</p>
        <p><strong>Tipo de proceso:</strong> {caseData.type}</p>
      </div>
    </div>
  );
};

export default CaseInfo;
