import { useParams, useOutletContext, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const EventDashboard = () => {
  const { caseId } = useParams();
  const {
    handleSetSelected: isCaseSelected,
    handleSetSelectedId: setCaseId,
  } = useOutletContext();

  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const baseURI = 'https://webback-x353.onrender.com/legalsystem';

  useEffect(() => {
    const token = localStorage.getItem('token');
    isCaseSelected(true);
    setCaseId(caseId);

    const fetchEvents = async () => {
      try {
        const res = await fetch(`${baseURI}/events/searchByProcess/${caseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Error al obtener los eventos');

        // Asegurarse que la respuesta es JSON
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Respuesta no es JSON');
        }

        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [caseId, isCaseSelected, setCaseId]);

  const handleRegister = async () => {
    const token = localStorage.getItem('token');
    const nuevoEvento = {
      processId: caseId,
      orderIndex: events.length + 1,
      name: 'Nuevo evento',
      description: 'Evento registrado desde frontend',
      dateStart: new Date().toISOString(),
      dateEnd: null,
    };

    try {
      const res = await fetch(`${baseURI}/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoEvento),
      });

      if (!res.ok) throw new Error('Error al registrar evento');

      const created = await res.json();
      setEvents((prev) => [...prev, created]);
    } catch (err) {
      setError(`Error al registrar evento: ${err.message}`);
    }
  };

  const handleEditToggle = (event) => {
    setEditingId(event.eventId);
    setEditForm({
      name: event.name || '',
      description: event.description || '',
      orderIndex: event.orderIndex || 0,
      dateStart: event.dateStart ? event.dateStart.slice(0, 16) : '',
      dateEnd: event.dateEnd ? event.dateEnd.slice(0, 16) : '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (eventId) => {
    const token = localStorage.getItem('token');

    // Validar datos básicos antes de enviar (ejemplo: nombre no vacío)
    if (!editForm.name.trim()) {
      setError('El nombre del evento no puede estar vacío');
      return;
    }

    try {
      const res = await fetch(`${baseURI}/event/update/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error('Error al actualizar evento');

      const updated = await res.json();
      setEvents((prev) => prev.map((ev) => (ev.eventId === eventId ? updated : ev)));
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(`Error al actualizar evento: ${err.message}`);
    }
    window.location.reload();
  };

  const handleDelete = async (eventId) => {
    const token = localStorage.getItem('token');

    if (!window.confirm('¿Estás seguro de eliminar este evento?')) return;

    try {
      const res = await fetch(`${baseURI}/events/delete/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Error al borrar evento');

      setEvents((prev) => prev.filter((ev) => ev.eventId !== eventId));
      setError(null);
    } catch (err) {
      setError(`Error al borrar evento: ${err.message}`);
    }
  };

  if (loading)
    return <p className="text-[#1C2C54] text-center py-4">Cargando eventos...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#F9F9F6] border border-[#A0A0A0] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#1C2C54]">
        Eventos del Proceso #{caseId}
      </h2>

      {error && (
        <p
          className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-400"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </p>
      )}

      {events.length === 0 ? (
        <p className="text-[#A0A0A0] text-sm">
          Este proceso no tiene eventos registrados.
        </p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.eventId}
              className="p-4 bg-white border-l-4 border-[#1C2C54] rounded shadow-sm"
            >
              {editingId === event.eventId ? (
                <>
                  <label className="block mb-1 font-semibold text-[#1C2C54]">
                    Nombre
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="text"
                      autoFocus
                    />
                  </label>

                  <label className="block mb-2 font-semibold text-[#1C2C54]">
                    Descripción
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    />
                  </label>

                  <label className="block mb-2 font-semibold text-[#1C2C54]">
                    Orden
                    <input
                      name="orderIndex"
                      type="number"
                      value={editForm.orderIndex}
                      onChange={handleEditChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={1}
                    />
                  </label>

                  <label className="block mb-2 font-semibold text-[#1C2C54]">
                    Fecha Fin
                    <input
                      name="dateEnd"
                      type="datetime-local"
                      value={editForm.dateEnd}
                      onChange={handleEditChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>

                  <div className="mt-4 flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleUpdateSubmit(event.eventId)}
                      className="bg-[#1C2C54] text-white px-4 py-2 rounded hover:bg-[#15213F] transition"
                      aria-label="Guardar cambios"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                      aria-label="Cancelar edición"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-[#6E1E2B]">{event.name}</h3>
                  <p className="text-sm text-[#1C2C54] mb-2">{event.description}</p>
                  <p className="text-sm text-[#A0A0A0] mb-1">
                    <strong>Inicio:</strong>{' '}
                    {new Date(event.dateStart).toLocaleString()}
                    <br />
                    {event.dateEnd && (
                      <>
                        <strong>Fin:</strong> {new Date(event.dateEnd).toLocaleString()}
                      </>
                    )}
                  </p>
                  <p className="text-xs text-[#C9A66B] mb-3">Orden: {event.orderIndex}</p>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleEditToggle(event)}
                      className="bg-[#1C2C54] hover:bg-[#15213F] text-white px-3 py-1 rounded text-sm transition"
                      aria-label={`Editar evento ${event.name}`}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(event.eventId)}
                      className="bg-[#6E1E2B] hover:bg-[#521420] text-white px-3 py-1 rounded text-sm transition"
                      aria-label={`Borrar evento ${event.name}`}
                    >
                      Borrar
                    </button>
                    <Link to={`/lawyer/evidences/${event.eventId}`}>
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                        aria-label={`Ver evidencias del evento ${event.name}`}
                      >
                        Evidencias
                      </button>
                    </Link>
                    <Link to={`/lawyer/observations/${event.eventId}`}>
                      <button
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition"
                        aria-label={`Ver observaciones del evento ${event.name}`}
                      >
                        Observaciones
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex justify-end gap-3 flex-wrap">
        <button
          onClick={handleRegister}
          className="bg-[#1C2C54] hover:bg-[#15213F] text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200"
          aria-label="Registrar nuevo evento"
        >
          Registrar Evento
        </button>
        <Link to={`/lawyer/pending-calendar/${caseId}`}>
          <button
            className="bg-[#1C2C54] hover:bg-[#15213F] text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200"
            aria-label="Ver calendario de eventos"
          >
            Ver Calendario
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EventDashboard;








