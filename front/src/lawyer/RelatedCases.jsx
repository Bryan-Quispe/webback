// lawyer/RelatedCases.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useOutletContext } from 'react-router-dom';

const RelatedCases = () => {
  const baseURI = 'https://webback-x353.onrender.com/legalsystem';
  const { caseId } = useParams();
  const {
    handleSetSelected: isCaseSelected, 
    handleSetSelectedId: setCaseId
  }=useOutletContext();
  const [related, setRelated] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    isCaseSelected(true);
    setCaseId(caseId);
    axios.get(baseURI+`/api/cases/related/${caseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setRelated(res.data))
    .catch(err => console.error('Error fetching related cases:', err));
  }, [caseId]);

  return (
    <div style={{ backgroundColor: '#F9F9F6', padding: '2rem' }}>
      <h2 style={{ color: '#1C2C54' }}>🔗 Casos Relacionados</h2>
      {related.length === 0 ? (
        <p style={{ color: '#A0A0A0' }}>No hay procesos relacionados registrados.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {related.map((r) => (
            <li key={r._id} style={{ border: '1px solid #A0A0A0', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
              <h3 style={{ color: '#6E1E2B' }}>{r.title}</h3>
              <p><strong>Fecha de inicio:</strong> {new Date(r.startDate).toLocaleDateString()}</p>
              <p><strong>Estado:</strong> <span style={{ color: r.status === 'pendiente' ? '#C9A66B' : '#4CAF50' }}>{r.status}</span></p>
              <p><strong>Cliente:</strong> {r.client}</p>
              <p><strong>Tipo:</strong> {r.type}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RelatedCases;

