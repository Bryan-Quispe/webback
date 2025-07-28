import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EvidenceDashboard() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [evidences, setEvidences] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debe iniciar sesión");
      navigate("/unauthorized");
      return;
    }

    axios.get(`/api/evidences/case/${caseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setEvidences(data);
        } else {
          console.warn("⚠️ La respuesta no es un array:", data);
          setError("La respuesta del servidor no es válida.");
          setEvidences([]);
        }
      })
      .catch((err) => {
        console.error("❌ Error al obtener evidencias:", err);
        setError("No se pudieron cargar las evidencias.");
      });
  }, [caseId, navigate]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-indigo-900">🧾 Evidencias del Caso</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {Array.isArray(evidences) && evidences.length === 0 ? (
        <p className="text-gray-500">No hay evidencias registradas.</p>
      ) : (
        <ul className="space-y-4">
          {Array.isArray(evidences) &&
            evidences.map((e) => (
              <li
                key={e._id || e.evidenceId}
                className="border border-gray-300 p-4 rounded-lg shadow bg-white"
              >
                <h3 className="text-lg font-semibold text-red-700">{e.title}</h3>
                <p><strong>Descripción:</strong> {e.description}</p>
                <p><strong>Tipo:</strong> {e.type}</p>
                <p><strong>Fecha de registro:</strong> {new Date(e.startDate).toLocaleDateString()}</p>
                <p><strong>Última actualización:</strong> {new Date(e.lastUpdate).toLocaleDateString()}</p>
                {e.link && (
                  <p>
                    <strong>Archivo:</strong>{" "}
                    <a
                      href={e.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-yellow-700 underline hover:text-yellow-500"
                    >
                      Ver documento
                    </a>
                  </p>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

