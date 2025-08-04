import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit } from 'lucide-react';

const ObservationDashboard = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [observations, setObservations] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const baseURI = 'https://webback-x353.onrender.com/legalsystem';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const res = await fetch(`${baseURI}/observations/event/${eventId}`);
        const data = await res.json();
        setObservations(data);
      } catch (err) {
        setError('Error al cargar observaciones');
      }
    };

    fetchObservations();
  }, [eventId]);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${baseURI}/observation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, eventId: Number(eventId) })
      });

      if (!res.ok) throw new Error('Error al crear observación');
      const saved = await res.json();
      setObservations(prev => [...prev, saved]);
      setForm({ title: '', content: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (obsId) => {
    try {
      const res = await fetch(`${baseURI}/observation/${obsId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const updated = await res.json();
      setObservations(prev =>
        prev.map(o => (o.observationId === obsId ? updated : o))
      );
      setEditingId(null);
      setForm({ title: '', content: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (obsId) => {
    try {
      await fetch(`${baseURI}/observation/${obsId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setObservations(prev => prev.filter(o => o.observationId !== obsId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-[#1C2C54] rounded-2xl shadow-md border">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-white hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="mr-2" size={20} />
        Volver
      </button>

      <h2 className="text-3xl font-bold text-white mb-6">
        Observaciones del Evento #{eventId}
      </h2>

      <input
        name="title"
        placeholder="Título"
        value={form.title}
        onChange={handleChange}
        className="block w-full mb-3 px-4 py-2 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1C2C54]"
      />
      <textarea
        name="content"
        placeholder="Contenido"
        value={form.content}
        onChange={handleChange}
        className="block w-full mb-4 px-4 py-2 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1C2C54]"
      />

      {editingId ? (
        <button
          onClick={() => handleUpdate(editingId)}
          className="bg-white hover:bg-[#2b3e6d] text-[#1C2C54] px-6 py-2 rounded-lg mb-4"
        >
          Actualizar
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          className="bg-white hover:bg-white text-[#1C2C54] px-6 py-2 rounded-lg mb-4"
        >
          Agregar
        </button>
      )}

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {/* Condicional para mostrar mensaje si no hay observaciones */}
      {!observations || observations.length === 0 ? (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md text-center border">
          <h3 className="text-[#6E1E2B] text-lg font-semibold mb-2">📭 Sin observaciones registradas</h3>
          <p className="text-[#1C2C54] text-sm">
            Este evento aún no tiene observaciones. Puedes agregar una para documentar lo relevante.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {observations.map(o => (
            <li key={o.observationId} className="border p-4 rounded-xl shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold text-[#1C2C54]">{o.title}</h3>
              <p className="text-sm text-[#1C2C54] mb-3">{o.content}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(o.observationId);
                    setForm({ title: o.title, content: o.content });
                  }}
                  className="flex items-center gap-2 bg-[#1C2C54] hover:bg-indigo-700 text-white px-4 py-1.5 rounded"
                >
                  <Edit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(o.observationId)}
                  className="flex items-center gap-2 bg-[#1C2C54] hover:bg-red-700 text-white px-4 py-1.5 rounded"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ObservationDashboard;


