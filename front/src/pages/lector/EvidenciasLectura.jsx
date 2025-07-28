import React, { useEffect, useState } from 'react';
import { getEvidenciasByProcessId } from '../../api/evidenceApi';
import { getProcessById } from '../../api/processApi'; // importar función para obtener proceso
import { useParams } from 'react-router-dom';

const EvidenciasLectura = () => {
  const { processId } = useParams();
  const [evidencias, setEvidencias] = useState([]);
  const [process, setProcess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [procData, evs] = await Promise.all([
          getProcessById(processId),
          getEvidenciasByProcessId(processId),
        ]);
        setProcess(procData);
        setEvidencias(evs);
      } catch (error) {
        setProcess(null);
        setEvidencias([]);
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
        Cargando evidencias...
      </div>
    );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {process && <h1 className="text-3xl font-bold mb-6">{process.title}</h1>}

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
              <h3 className="text-xl font-semibold mb-2">{ev.evidenceName}</h3>
              <p className="text-gray-300 mb-3">Tipo: {ev.evidenceType}</p>
              {ev.filePath && (
                <a
                  href={`http://localhost:3000/${ev.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-600 underline font-medium"
                >
                  Ver archivo
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EvidenciasLectura;
