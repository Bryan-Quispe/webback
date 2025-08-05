import React, { useEffect, useState } from 'react';
import { getObservationsByProcessId } from '../../api/observationApi';
import { getProcessById } from '../../api/processApi';
import { useParams, useNavigate } from 'react-router-dom';

const ObservacionesLectura = () => {
  const { processId } = useParams();
  const navigate = useNavigate();
  const [observaciones, setObservaciones] = useState([]);
  const [process, setProcess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const parsedProcessId = Number(processId);
        if (isNaN(parsedProcessId)) {
          throw new Error('ID de proceso no válido.');
        }

        const [procData, obs] = await Promise.all([
          getProcessById(parsedProcessId),
          getObservationsByProcessId(parsedProcessId),
        ]);

        if (!procData || !procData.title) {
          throw new Error('No se encontró el proceso.');
        }
        if (!Array.isArray(obs)) {
          throw new Error('Las observaciones no tienen el formato esperado.');
        }

        setProcess(procData);
        setObservaciones(obs);
      } catch (error) {
        setError(error.message || 'Error al cargar los datos.');
        setProcess(null);
        setObservaciones([]);
        console.error('Error fetching observations:', error);
      } finally {
        setLoading(false);
      }
    }
    if (processId) {
      fetchData();
    } else {
      setError('ID de proceso no proporcionado.');
      setLoading(false);
    }
  }, [processId]);

  const goToDashboard = () => {
    navigate('/lector');
  };

  const goToProceso = () => {
    navigate(`/lector/proceso/${processId}`);
  };

  const goToEvidencias = () => {
    navigate(`/procesos/${processId}/evidencias`);
  };

  if (loading) {
    return (
      <div className="text-white min-h-screen bg-gray-900 flex items-center justify-center">
        Cargando observaciones...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 min-h-screen bg-gray-900 flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        {process && <h1 className="text-3xl font-bold">{process.title}</h1>}
        <div className="flex gap-4">
          <button
            onClick={goToDashboard}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full"
          >
            Volver al Dashboard
          </button>
          <button
            onClick={goToProceso}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
          >
            Volver al Proceso
          </button>
          <button
            onClick={goToEvidencias}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full"
          >
            Ver Evidencias
          </button>
        </div>
      </div>

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
              <h3 className="font-semibold text-lg">
                {obs.title || 'Sin título'}
              </h3>
              <p className="text-gray-300">{obs.content || 'Sin contenido'}</p>
              <p className="text-gray-400 text-sm">Evento ID: {obs.eventId}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ObservacionesLectura;
