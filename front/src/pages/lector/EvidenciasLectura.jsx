import React, { useEffect, useState } from 'react';
import { getEvidenciasByProcessId } from '../../api/evidenceApi';
import { getProcessById } from '../../api/processApi';
import { useParams, useNavigate } from 'react-router-dom';

const EvidenciasLectura = () => {
  const { processId } = useParams();
  const navigate = useNavigate();
  const [evidencias, setEvidencias] = useState([]);
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

        const [procData, evs] = await Promise.all([
          getProcessById(parsedProcessId),
          getEvidenciasByProcessId(parsedProcessId),
        ]);

        if (!procData || !procData.title) {
          throw new Error('No se encontró el proceso.');
        }
        if (!Array.isArray(evs)) {
          throw new Error('Las evidencias no tienen el formato esperado.');
        }

        setProcess(procData);
        setEvidencias(evs);
      } catch (error) {
        setError(error.message || 'Error al cargar los datos.');
        setProcess(null);
        setEvidencias([]);
        console.error('Error fetching evidences:', error);
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

  const goToObservaciones = () => {
    navigate(`/procesos/${processId}/observaciones`);
  };

  if (loading) {
    return (
      <div className="text-white min-h-screen bg-gray-900 flex items-center justify-center">
        Cargando evidencias...
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
            onClick={goToObservaciones}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full"
          >
            Ver Observaciones
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Evidencias</h2>
      {evidencias.length === 0 ? (
        <p className="text-gray-400">No hay evidencias registradas.</p>
      ) : (
        <ul className="space-y-4">
          {evidencias.map((ev) => (
            <li
              key={ev._id}
              className="bg-gray-800 p-6 rounded shadow border-l-8 border-purple-600"
            >
              <h3 className="text-xl font-semibold mb-2">
                {ev.evidenceName || 'Sin nombre'}
              </h3>
              <p className="text-gray-300 mb-3">
                Tipo: {ev.evidenceType || 'No especificado'}
              </p>
              <p className="text-gray-400 text-sm">Evento ID: {ev.eventId}</p>
              {ev.filePath ? (
                <a
                  href={`http://localhost:3000/${ev.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-600 underline font-medium"
                >
                  Ver archivo
                </a>
              ) : (
                <p className="text-gray-400">No hay archivo disponible.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EvidenciasLectura;
