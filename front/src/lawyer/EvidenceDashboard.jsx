import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Trash2, Edit } from 'lucide-react';

const EvidenceDashboard = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [evidences, setEvidences] = useState([]);
  const [formData, setFormData] = useState({
    evidenceType: '',
    evidenceName: '',
    filePath: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Estado para mostrar carga
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(
        `https://webback-x353.onrender.com/legalsystem/evidences/event/${eventId}`
      )
      .then((res) => setEvidences(res.data))
      .catch((err) => console.error('Error al obtener evidencias', err));
  }, [eventId]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const formDataToUpload = new FormData();
      formDataToUpload.append('file', file);

      try {
        const res = await axios.post(
          `https://webback-x353.onrender.com/legalsystem/evidence/upload`,
          formDataToUpload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setFormData((prev) => ({
          ...prev,
          filePath: res.data.urlArchivo, // Usar la URL segura de Cloudinary
        }));
      } catch (err) {
        console.error('Error al subir archivo', err);
        alert('Error al subir el archivo. Por favor, intenta de nuevo.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, eventId: Number(eventId) };

    try {
      if (editingId) {
        await axios.put(
          `https://webback-x353.onrender.com/legalsystem/evidence/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvidences((prev) =>
          prev.map((ev) =>
            ev.evidenceId === editingId ? { ...ev, ...payload } : ev
          )
        );
      } else {
        const res = await axios.post(
          `https://webback-x353.onrender.com/legalsystem/evidence`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvidences((prev) => [...prev, res.data]);
      }

      setFormData({ evidenceType: '', evidenceName: '', filePath: '' });
      setEditingId(null);
    } catch (err) {
      console.error('Error al guardar evidencia', err);
      alert('Error al guardar la evidencia. Por favor, verifica los datos.');
    }

    window.location.reload(); // Recargar para reflejar cambios
  };

  const handleEdit = (evidence) => {
    setFormData({
      evidenceType: evidence.evidenceType,
      evidenceName: evidence.evidenceName,
      filePath: evidence.filePath,
    });
    setEditingId(evidence.evidenceId);
  };

  const handleDelete = async (evidenceId) => {
    try {
      await axios.delete(
        `https://webback-x353.onrender.com/legalsystem/evidence/${evidenceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvidences((prev) => prev.filter((ev) => ev.evidenceId !== evidenceId));
    } catch (err) {
      console.error('Error al eliminar evidencia', err);
      alert('Error al eliminar la evidencia.');
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#1C2C54] rounded-xl shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white-800">
          Evidencias del Evento #{eventId}
        </h2>
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-white-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Volver a eventos
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 p-4 text-[#1C2C54] rounded-lg space-y-4 border border-gray-300 mb-8"
      >
        <input
          type="text"
          name="evidenceType"
          placeholder="Tipo de evidencia"
          value={formData.evidenceType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="evidenceName"
          placeholder="Nombre de evidencia"
          value={formData.evidenceName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          onChange={handleFileSelect}
          className="w-full p-2 border rounded"
          disabled={isUploading}
        />
        {isUploading && (
          <p className="text-sm text-gray-600">Subiendo archivo...</p>
        )}
        <button
          type="submit"
          className="bg-[#1C2C54] hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          disabled={isUploading || !formData.filePath}
        >
          {editingId ? 'Actualizar evidencia' : 'Agregar evidencia'}
        </button>
      </form>

      {!evidences || evidences.length === 0 ? (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md text-center border border-gray-300">
          <h3 className="text-[#6E1E2B] text-lg font-semibold mb-2">
            📂 Sin evidencias disponibles
          </h3>
          <p className="text-[#1C2C54] text-sm">
            Este evento no tiene evidencias registradas aún. Puedes añadir una
            para comenzar a documentar.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {evidences.map((ev) => (
            <li
              key={ev.evidenceId}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex justify-between items-start"
            >
              <div>
                <p className="font-semibold text-gray-700">{ev.evidenceName}</p>
                <p className="text-sm text-gray-700">
                  <strong>Tipo:</strong> {ev.evidenceType}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Archivo:</strong>{' '}
                  <a
                    href={ev.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {ev.filePath}
                  </a>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(ev)}
                  className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded flex items-center gap-1 text-sm"
                >
                  <Edit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(ev.evidenceId)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
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

export default EvidenceDashboard;
