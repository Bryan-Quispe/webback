import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EventDashboard() {
  const { caseId } = useParams(); // caseId = processId en backend
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debe iniciar sesión");
      navigate("/unauthorized");
      return;
    }

    axios.get(`/api/events/searchByProcess/${caseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      if (Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        console.warn("⚠️ La respuesta no es un array:", res.data);
        setEvents([]);
        setError("La respuesta del servidor no es válida.");
      }
    })
    .catch((err) => {
      console.error("❌ Error al obtener eventos:", err);
      setError("No se pudieron cargar los eventos.");
    });
  }, [caseId, navigate]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-indigo-900">📅 Eventos del Caso</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {Array.isArray(events) && events.length === 0 ? (
        <p className="text-gray-500">No hay eventos registrados.</p>
      ) : (
        <ul className="space-y-4">
          {Array.isArray(events) &&
            events.map((e) => (
              <li key={e._id || e.eventId} className="border border-gray-300 rounded-lg p-4 shadow bg-white">
                <h3 className="text-lg font-semibold text-red-700">{e.name || e.title}</h3>
                <p><strong>Fecha inicio:</strong> {new Date(e.dateStart).toLocaleString()}</p>
                <p><strong>Fecha fin:</strong> {new Date(e.dateEnd).toLocaleString()}</p>
                <p><strong>Descripción:</strong> {e.description}</p>
                <p>
                  <strong>Estado:</strong>{' '}
                  <span className={e.status === 'pendiente' ? 'text-yellow-600' : 'text-green-600'}>
                    {e.status || 'sin estado'}
                  </span>
                </p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}


