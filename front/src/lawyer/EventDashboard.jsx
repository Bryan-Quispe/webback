import { useParams, useOutletContext, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const EventDashboard = () => {
  const { caseId } = useParams();
  const {
    handleSetSelected: isCaseSelected,
    handleSetSelectedId: setCaseId,
  } = useOutletContext();

  const [events, setEvents] = useState([]);
  const [offenseDescription, setOffenseDescription] = useState('');
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

    const fetchProcess = async () => {
      try {
        const res = await fetch(`${baseURI}/process/${caseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Error al obtener el proceso');
        const data = await res.json();
        setOffenseDescription(data.title || `Proceso #${caseId}`);
      } catch (err) {
        console.error('Error al obtener descripción del proceso', err);
      }
    };

    fetchEvents();
    fetchProcess();
  }, [caseId, isCaseSelected, setCaseId]);

  const getLocalDateTimeUTC = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset(); // minutos de desfase respecto a UTC
  const localDate = new Date(date.getTime() - offset * 60 * 1000); // ajusta la fecha
  return localDate.toISOString();
};

  const handleRegister = async () => {
    const token = localStorage.getItem('token');
    const nuevoEvento = {
      processId: caseId,
      name: 'Registrar Evento',
      description: 'Descripcion del Evento',
      dateStart: getLocalDateTimeUTC(),
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
    const formatLocalDateTime = (utcString) => {
  const date = new Date(utcString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hour = `${date.getHours()}`.padStart(2, '0');
  const minute = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
};
    setEditForm({
      name: event.name || '',
      description: event.description || '',
       dateStart: event.dateStart ? formatLocalDateTime(event.dateStart) : '',
       dateEnd: event.dateEnd ? formatLocalDateTime(event.dateEnd) : '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const getEventColorClass = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;

    if (endDate && now > endDate) return 'border-green-600 bg-green-50';
    if (now < startDate) return 'border-red-600 bg-red-50';
    if (endDate && now >= startDate && now <= endDate) return 'border-blue-600 bg-blue-50';
    return 'border-gray-400 bg-white';
  };


const toUTCISOString = (localDateTimeStr) => {
  // Construye fecha como si fuera local manualmente
  const [datePart, timePart] = localDateTimeStr.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  const date = new Date();
  date.setFullYear(year);
  date.setMonth(month - 1); // En JS los meses son 0-indexados
  date.setDate(day);
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date.toISOString(); // UTC correcta
};



const handleUpdateSubmit = async (eventId) => {
  const token = localStorage.getItem('token');

  if (!editForm.name.trim()) {
    setError('El nombre del evento no puede estar vacío');
    return;
  }

  const payload = {
    ...editForm,
    dateStart: toUTCISOString(editForm.dateStart),
    dateEnd: editForm.dateEnd ? toUTCISOString(editForm.dateEnd) : null,
  };

  try {
    const res = await fetch(`${baseURI}/event/update/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
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

  const now = new Date();
  const current = [];
  const upcoming = [];
  const finished = [];

  events.forEach((e) => {
    const start = new Date(e.dateStart);
    const end = e.dateEnd ? new Date(e.dateEnd) : null;

    if (end && now > end) finished.push(e);
    else if (now < start) upcoming.push(e);
    else current.push(e);
  });

  const sortedEvents = [
    ...current.sort((a, b) => new Date(b.dateStart) - new Date(a.dateStart)),
    ...upcoming.sort((a, b) => new Date(b.dateStart) - new Date(a.dateStart)),
    ...finished.sort((a, b) => new Date(b.dateStart) - new Date(a.dateStart)),
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#F9F9F6] border border-[#A0A0A0] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#1C2C54]">
        Eventos del Proceso: {offenseDescription}
      </h2>

      {error && (
        <p className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-400" role="alert">
          {error}
        </p>
      )}

      {!sortedEvents || sortedEvents.length === 0 ? (
  <div className="p-4 border border-[#A0A0A0] rounded-md bg-[#FFF8F8] text-center shadow-sm">
    <h3 className="text-[#6E1E2B] text-lg font-semibold mb-2"> Sin eventos registrados</h3>
    <p className="text-[#1C2C54] text-sm">
      Este proceso aún no tiene eventos asociados. Puedes crear uno para empezar a documentarlo.
    </p>
  </div>
) : (
  <ul className="space-y-4">
    {sortedEvents.map((event) => {
      const colorClass = getEventColorClass(event.dateStart, event.dateEnd);

      return (
        <li
          key={event.eventId}
          className={`p-4 ${colorClass} border-l-4 rounded shadow-sm`}
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
                Fecha Inicio
                <input
                  name="dateStart"
                  type="datetime-local"
                  value={editForm.dateStart}
                  onChange={handleEditChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
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
                <strong>Inicio:</strong> {new Date(event.dateStart).toLocaleString()} <br />
                {event.dateEnd && (
                  <>
                    <strong>Fin:</strong> {new Date(event.dateEnd).toLocaleString()}
                  </>
                )}
              </p>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleEditToggle(event)}
                  className="bg-[#1C2C54] hover:bg-[#15213F] text-white px-3 py-1 rounded text-sm transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(event.eventId)}
                  className="bg-[#6E1E2B] hover:bg-[#521420] text-white px-3 py-1 rounded text-sm transition"
                >
                  Borrar
                </button>
                <Link to={`/lawyer/evidences/${event.eventId}`}>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition">
                    Evidencias
                  </button>
                </Link>
                <Link to={`/lawyer/observations/${event.eventId}`}>
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition">
                    Observaciones
                  </button>
                </Link>
              </div>
            </>
          )}
        </li>
      );
    })}
  </ul>
)}


      <div className="mt-6 flex justify-end gap-3 flex-wrap">
        <button
          onClick={handleRegister}
          className="bg-[#1C2C54] hover:bg-[#15213F] text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200"
        >
          Registrar Evento
        </button>
        <Link to={`/lawyer/pending-calendar/${caseId}`}>
          <button
            className="bg-[#1C2C54] hover:bg-[#15213F] text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200"
          >
            Ver Calendario
          </button>
        </Link>
         <Link to={`/lawyer/reminders/`}>
          <button
            className="bg-[#1C2C54] hover:bg-[#15213F] text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200"
          >
            Recordatorios
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EventDashboard;










