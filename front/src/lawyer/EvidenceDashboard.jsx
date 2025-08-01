import { useEffect, useState } from 'react';

function EventDashboard({ processId, token }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [evidences, setEvidences] = useState([]);
  const [newEvidence, setNewEvidence] = useState({
    evidenceType: '',
    evidenceName: '',
    file: null,
  });
  const [status, setStatus] = useState('');
  const API_BASE = 'https://webback-x353.onrender.com/legalsystem'; // Ajusta según tu config

  // 🔍 Cargar eventos del proceso
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(`${API_BASE}/evidences/process/${processId}`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setStatus('Error cargando eventos');
      }
    }

    if (processId) loadEvents();
  }, [processId]);

  // 🔍 Cargar evidencias del evento seleccionado
  useEffect(() => {
    async function loadEvidences() {
      if (!selectedEvent) return;
      try {
        const res = await fetch(`${API_BASE}/evidences/event/${selectedEvent.eventId}`);
        const data = await res.json();
        setEvidences(data);
      } catch (err) {
        setStatus('Error cargando evidencias');
      }
    }
    loadEvidences();
  }, [selectedEvent]);

  // 📤 Subir archivo
  async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/evidence/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    return data.filePath;
  }

  // 📝 Crear nueva evidencia
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('Creando evidencia...');

    try {
      const filePath = await uploadFile(newEvidence.file);

      const body = {
        eventId: selectedEvent.eventId,
        evidenceType: newEvidence.evidenceType,
        evidenceName: newEvidence.evidenceName,
        filePath,
      };

      const res = await fetch(`${API_BASE}/evidence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const saved = await res.json();
      setStatus('Evidencia creada exitosamente');
      setNewEvidence({ evidenceType: '', evidenceName: '', file: null });
      setEvidences([...evidences, saved]);
    } catch (err) {
      setStatus('Error creando evidencia');
    }
  }

  return (
    <div className="p-4 text-white-900">
      <h2 className="text-2xl font-bold mb-4">Panel de Eventos y Evidencias</h2>

      {/* 🗂️ Selector de Evento */}
      <select
        onChange={(e) => {
          const index = e.target.selectedIndex;
          setSelectedEvent(events[index]);
          setStatus('');
        }}
        className="mb-4 p-2 border rounded text-white-900"
      >
        <option>Selecciona un evento</option>
        {events.map((ev) => (
          <option key={ev.eventId}>
            #{ev.eventId} — {ev.eventName}
          </option>
        ))}
      </select>

      {/* 📋 Lista de evidencias */}
      {selectedEvent && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Evidencias de {selectedEvent.eventName}</h3>
          <ul className="space-y-3">
            {evidences.map((ev) => (
              <li key={ev.evidenceId} className="p-3 border rounded shadow bg-white">
                <strong>{ev.evidenceName}</strong> ({ev.evidenceType})
                <br />
                {ev.filePath && (
                  <a
                    href={`${API_BASE}/${ev.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline"
                  >
                    Ver archivo
                  </a>
                )}
              </li>
            ))}
            {evidences.length === 0 && <p className="text-gray-500">No hay evidencias para este evento.</p>}
          </ul>
        </div>
      )}

      {/* 🆕 Formulario de nueva evidencia */}
      {selectedEvent && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded border space-y-3">
          <h4 className="text-lg font-semibold">Agregar nueva evidencia</h4>
          <input
            type="text"
            placeholder="Nombre de la evidencia"
            value={newEvidence.evidenceName}
            onChange={(e) => setNewEvidence({ ...newEvidence, evidenceName: e.target.value })}
            className="block w-full p-2 border rounded text-blue-900"
            required
          />
          <input
            type="text"
            placeholder="Tipo de evidencia"
            value={newEvidence.evidenceType}
            onChange={(e) => setNewEvidence({ ...newEvidence, evidenceType: e.target.value })}
            className="block w-full p-2 border rounded text-blue-900"
            required
          />
          <input
            type="file"
            onChange={(e) => setNewEvidence({ ...newEvidence, file: e.target.files[0] })}
            className="block w-full p-2 text-blue-900"
            required
          />
          <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">
            Subir Evidencia
          </button>
          {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
        </form>
      )}
    </div>
  );
}

export default EventDashboard;
