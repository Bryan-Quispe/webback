import { useParams, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';

const EventDashboard = () => {
  const { caseId } = useParams();
  const {
    handleSetSelected: isCaseSelected, 
    handleSetSelectedId: setCaseId
  }=useOutletContext();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const baseURI='https://webback-x353.onrender.com/legalsystem';
  useEffect(() => {
    const token = localStorage.getItem('token');
    isCaseSelected(true);
    setCaseId(caseId);
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          baseURI+`/events/searchByProcess/${caseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const raw = await res.text();
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
          throw new Error('Error al obtener los eventos');
        }

        const data = JSON.parse(raw);
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [caseId]);

  const handleRegister = async () => {
    const token = localStorage.getItem('token');
    const nuevoEvento = {
      processId: caseId,
      orderIndex: events.length + 1,
      name: 'Nuevo evento',
      description: 'Evento registrado desde frontend',
      dateStart: new Date().toISOString(),
      dateEnd: null
    };

    try {
      const res = await fetch((baseURI+'/event'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(nuevoEvento)
      });

      if (!res.ok) throw new Error('Error al registrar evento');
      const created = await res.json();
      setEvents(prev => [...prev, created]);
    } catch (err) {
      setError(`Error al registrar evento: ${err.message}`);
    }
  };

  const handleEditToggle = (event) => {
    setEditingId(event.eventId);
    setEditForm({
      name: event.name,
      description: event.description,
      orderIndex: event.orderIndex,
      dateStart: event.dateStart?.slice(0, 16),
      dateEnd: event.dateEnd?.slice(0, 16) || ''
    });
  };

  const handleEditChange = (e) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateSubmit = async (eventId) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(baseURI+`/event/update/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!res.ok) throw new Error('Error al actualizar evento');
      const updated = await res.json();

      setEvents(prev => prev.map(ev => (ev.eventId === eventId ? updated : ev)));
      setEditingId(null);
    } catch (err) {
      setError(`Error al actualizar evento: ${err.message}`);
    }
  };

  const handleDelete = async (eventId) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(baseURI+`/events/delete/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Error al borrar evento');
      setEvents(prev => prev.filter(ev => ev.eventId !== eventId));
    } catch (err) {
      setError(`Error al borrar evento: ${err.message}`);
    }
  };

  if (loading) return <p className="text-[#1C2C54]">Cargando eventos...</p>;
  if (error) return <p className="text-[#6E1E2B]">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#F9F9F6] border border-[#A0A0A0] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#1C2C54]">Eventos del Proceso #{caseId}</h2>

      {events.length === 0 ? (
        <p className="text-[#A0A0A0] text-sm">Este proceso no tiene eventos registrados.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.eventId} className="!p-4 !bg-blue !border-l-4 !border-[#1C2C54] !rounded shadow-sm">
              {editingId === event.eventId ? (
                <>
                  <input name="name" value={editForm.name} onChange={handleEditChange} className="block mb-1" />
                  <textarea name="description" value={editForm.description} onChange={handleEditChange} className="block w-full px-3 py-2 text-blue-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2" />
                  <input name="orderIndex" type="number" value={editForm.orderIndex} onChange={handleEditChange} className="block w-full px-3 py-2 border text-blue-900 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2" />
                  <input name="dateStart" type="datetime-local" value={editForm.dateStart} onChange={handleEditChange} className="block w-full px-3 py-2 border  text-blue-900 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2" />
                  <input name="dateEnd" type="datetime-local" value={editForm.dateEnd} onChange={handleEditChange} className="block w-full px-3 py-2 border border-gray-300 text-blue-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2" />

                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleUpdateSubmit(event.eventId)}
                      className="bg-[#1C2C54] text-white px-3 py-1 rounded"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-[#6E1E2B]">{event.name}</h3>
                  <p className="text-sm text-[#1C2C54] mb-2">{event.description}</p>
                  <p className="text-sm text-[#A0A0A0]">
                    <strong>Inicio:</strong> {new Date(event.dateStart).toLocaleDateString()}<br />
                    {event.dateEnd && <><strong>Fin:</strong> {new Date(event.dateEnd).toLocaleDateString()}</>}
                  </p>
                  <p className="text-xs text-[#C9A66B]">Orden: {event.orderIndex}</p>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEditToggle(event)}
                      className="bg-[#1C2C54] hover:bg-[#15213F] text-white py-1 px-2 rounded text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(event.eventId)}
                      className="bg-[#6E1E2B] hover:bg-[#521420] text-white py-1 px-2 rounded text-sm"
                    >
                      Borrar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleRegister}
          className="bg-[#1C2C54] hover:bg-[#15213F] text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200"
        >
          Registrar Evento
        </button>
      </div>
    </div>
  );
};

export default EventDashboard;






