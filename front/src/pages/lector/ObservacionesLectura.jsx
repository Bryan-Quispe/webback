import React, { useEffect, useState } from 'react';
import { getObservationsByProcessId } from '../../api/observationApi';
import { getProcessById } from '../../api/processApi';
import { useParams } from 'react-router-dom';

const ObservacionesLectura = () => {
  const { processId } = useParams();
  const [observaciones, setObservaciones] = useState([]);
  const [process, setProcess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [procData, obs] = await Promise.all([
          getProcessById(processId),
          getObservationsByProcessId(processId),
        ]);
        setProcess(procData);
        setObservaciones(obs);
      } catch (error) {
        setProcess(null);
        setObservaciones([]);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [processId]);

  if (loading)
    return (
      <div className="text-white min-h-screen bg-gray-900 flex items-center justify-center">
        Cargando observaciones...
      </div>
    );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {process && <h1 className="text-3xl font-bold mb-6">{process.title}</h1>}

      <h2 className="text-2xl font-bold mb-4">Observaciones</h2>
      {observaciones.length === 0 ? (
        <p className="text-gray-400">Sin observaciones visibles.</p>
      ) : (
        <ul className="space-y-3">
          {observaciones.map((obs) => (
            <li
              key={obs._id}
              className="bg-gray-800 p-4 rounded shadow border-l-4 border-blue-500"
            >
              <h3 className="font-semibold text-lg">{obs.title}</h3>
              <p className="text-gray-300">{obs.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ObservacionesLectura;
