import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Edit, Bell } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const ReminderList = () => {
  const [reminders, setReminders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    dateTime: '',
    activeFlag: true,
  });
  const token = localStorage.getItem('token');

  // Cargar recordatorios al inicio
  useEffect(() => {
    axios
      .get('https://webback-x353.onrender.com/legalsystem/reminders')
      .then((res) => setReminders(res.data))
      .catch((err) => console.error('Error fetching reminders', err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Rellenar formulario para editar
  const handleEdit = (reminder) => {
    setFormData({
      title: reminder.title,
      dateTime: dayjs(reminder.dateTime).format('YYYY-MM-DDTHH:mm'),
      activeFlag: reminder.activeFlag,
    });
    setEditingId(reminder.reminderId);
  };

  // Borrar recordatorio por reminderId
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://webback-x353.onrender.com/legalsystem/reminder/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReminders((prev) => prev.filter((r) => r.reminderId !== id));
    } catch (err) {
      console.error('Error deleting reminder', err);
    }
  };

  // Crear o actualizar recordatorio
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      dateTime: new Date(formData.dateTime),
      activeFlag: formData.activeFlag,
    };

    try {
      if (editingId) {
        // Actualizar
        const res = await axios.put(
          `https://webback-x353.onrender.com/legalsystem/reminder/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReminders((prev) =>
          prev.map((r) => (r.reminderId === editingId ? res.data : r))
        );
      } else {
        // Crear
        const res = await axios.post(
          'https://webback-x353.onrender.com/legalsystem/reminder',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Aquí es importante agregar el objeto completo que regresa la API,
        // que ya debe incluir reminderId numérico asignado
        setReminders((prev) => [...prev, res.data]);
      }

      setFormData({ title: '', dateTime: '', activeFlag: true });
      setEditingId(null);
    } catch (err) {
      console.error('Error saving reminder', err);
    }
  };

  // Mostrar alertas si queda 1 día o 1 semana
  const getProximityAlert = (dateTime) => {
    const now = dayjs();
    const reminderDate = dayjs(dateTime);
    const diff = reminderDate.diff(now, 'day');

    if (diff === 1) return '⚠️ Reminder is in 1 day';
    if (diff === 7) return '📅 Reminder is in 1 week';
    return null;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#1C2C54] text-white rounded-xl">
      <h2 className="text-2xl font-bold mb-6">📋 Reminders</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white text-black p-4 rounded-lg mb-8">
        <input
          type="text"
          name="title"
          placeholder="Reminder Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="datetime-local"
          name="dateTime"
          value={formData.dateTime}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="activeFlag"
            checked={formData.activeFlag}
            onChange={handleChange}
          />
          Active
        </label>
        <button
          type="submit"
          className="bg-[#1C2C54] text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? 'Update Reminder' : 'Add Reminder'}
        </button>
      </form>

      {reminders.length === 0 ? (
        <div className="text-center text-gray-200">No reminders available.</div>
      ) : (
        <ul className="space-y-4">
          {reminders.map((r) => {
            const alert = getProximityAlert(r.dateTime);
            return (
              <li
                key={r.reminderId}
                className="bg-white text-black p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{r.title}</p>
                  <p>{dayjs(r.dateTime).format('LLLL')}</p>
                  {alert && (
                    <div className="mt-1 text-red-600 font-semibold flex items-center gap-2">
                      <Bell size={16} /> {alert}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="bg-yellow-400 px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.reminderId)}
                    className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ReminderList;









