import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ObservationDashboard = () => {
  const { caseId } = useParams();
  const [observations, setObservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', eventId: '' });
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`http://localhost:3000/legalsystem/observations/event/${caseId}`)
      .then(res => res.json())
      .then(data => setObservations(data))
      .catch(err => setError(err.message));
  }, [caseId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    try {
      const res = await fetch('http://localhost:3000/legalsystem/observation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, eventId: caseId })
      });
      if (!res.ok) throw new Error('Error al registrar observación');
      const created = await res.json();
      setObservations(prev => [...prev, created]);
      setForm({ title: '', content: '', eventId: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditToggle = (obs) => {
    setEditingId(obs.observationId);
    setForm({ title: obs.title, content: obs.content, eventId: obs.eventId });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:3000/legalsystem/observation/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Error al actualizar observación');
      const updated = await res.json();
      setObservations(prev => prev.map(o => o.observationId === editingId ? updated : o));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/legalsystem/observation/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al eliminar observación');
      setObservations(prev => prev.filter(o => o.observationId !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#F9F9F6] border border-[#A0A0A0] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-[#1C2C54]">📌 Observaciones del Proceso #{caseId}</h2>

      {error && <p className="text-[#6E1E2B]">{error}</p>}

      {/* Formulario de nueva observación */}
      <div className="mb-6">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título"
          className="block mb-2 px-3 py-2 border rounded w-full"
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Contenido"
          className="block mb-2 px-3 py-2 border rounded w-full"
        />
        <button
          onClick={handleCreate}
          className="bg-[#1C2C54] text-white px-4 py-2 rounded shadow-sm"
        >
          Registrar Observación
        </button>
      </div>

      {/* Lista de observaciones */}
      {observations.length === 0 ? (
        <p className="text-sm text-[#A0A0A0]">No hay observaciones para este proceso.</p>
      ) : (
        <ul className="space-y-4">
          {observations.map(obs => (
            <li key={obs.observationId} className="p-4 bg-white border-l-4 border-[#1C2C54] rounded shadow-sm">
              {editingId === obs.observationId ? (
                <>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="block mb-1 border px-2 py-1 w-full"
                  />
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    className="block mb-1 border px-2 py-1 w-full"
                  />
                  <div className="mt-2 flex gap-2">
                    <button onClick={handleUpdate} className="bg-[#1C2C54] text-white px-3 py-1 rounded">Guardar</button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancelar</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-[#6E1E2B]">{obs.title}</h3>
                  <p className="text-sm text-[#1C2C54] mb-2">{obs.content}</p>
                  <p className="text-xs text-[#C9A66B]">Evento: {obs.eventId}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => handleEditToggle(obs)} className="bg-[#1C2C54] text-white py-1 px-2 rounded text-sm">Editar</button>
                    <button onClick={() => handleDelete(obs.observationId)} className="bg-[#6E1E2B] text-white py-1 px-2 rounded text-sm">Borrar</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ObservationDashboard;
