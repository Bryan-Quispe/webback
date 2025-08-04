import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CaseInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [info, setInfo] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id: caseId } = useParams();
  const navigate = useNavigate();
  const {
    handleSetSelected: isCaseSelected,
    handleSetSelectedId: setCaseId
  } = useOutletContext();

  useEffect(() => {
    const token = localStorage.getItem('token');
    isCaseSelected(true);
    setCaseId(Number(caseId));

    const fetchInfo = async () => {
      try {
        const res = await fetch(`https://webback-x353.onrender.com/legalsystem/process/${caseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const text = await res.text();
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
          throw new Error('Error al obtener el proceso');
        }

        const data = JSON.parse(text);
        setInfo(data);

        if (data.startDate && data.endDate) {
          const start = new Date(data.startDate);
          const end = new Date(data.endDate);
          const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
          setSummary({
            elapsedTime: {
              monthsElapsed: Math.floor(days / 30),
              weeksElapsed: Math.floor(days / 7),
              daysElapsed: days
            },
            eventsList: data.events || []
          });
        } else {
          setSummary(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [caseId]);

  const handleInlineEdit = () => {
    setFormData(info);
    setIsEditing(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInlineSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!formData.title || !formData.processType) {
      alert('Título y tipo de proceso son obligatorios');
      return;
    }
    try {
      await axios.put(`https://webback-x353.onrender.com/legalsystem/process/${caseId}/update`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInfo(formData);
      setIsEditing(false);
      alert('Proceso actualizado correctamente');
    } catch (err) {
      console.error('Error al actualizar proceso:', err);
      alert('No se pudo actualizar el proceso');
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!window.confirm('¿Eliminar este proceso? Esta acción no se puede deshacer.')) return;
    try {
      await axios.delete(`https://webback-x353.onrender.com/legalsystem/process/${caseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Proceso eliminado correctamente');
      navigate('/lawyer/case-dashboard');
    } catch (err) {
      console.error('Error al eliminar proceso:', err);
      alert('Error al eliminar proceso');
    }
  };

  if (loading) return <p className="text-[#1C2C54]">Cargando información del caso...</p>;
  if (error) return <p className="text-[#6E1E2B]">Error: {error}</p>;

  return (
    <div className="bg-white max-w-4xl mx-auto mt-4 p-6 shadow-md rounded-xl border border-gray-300">
      <h2 className="text-3xl font-bold mb-6 text-[#1C2C54]">{info.title}</h2>

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#1C2C54] mb-6">
          <p><strong>ID:</strong> {info.processId}</p>
          <p><strong>Tipo:</strong> {info.processType}</p>
          <p><strong>Delito:</strong> {info.offense}</p>
          <p><strong>Provincia:</strong> {info.province} / {info.canton}</p>
          <p><strong>Cliente:</strong> {info.clientGender}, {info.clientAge} años</p>
          <p><strong>Estado:</strong> {info.processStatus}</p>
          <p><strong>Inicio:</strong> {new Date(info.startDate).toLocaleDateString()}</p>
          <p><strong>Final:</strong> {info.endDate ? new Date(info.endDate).toLocaleDateString() : 'No definida'}</p>
          <p><strong>N° de proceso:</strong> {info.processNumber}</p>
          <p className="md:col-span-2"><strong>Descripción:</strong> {info.processDescription}</p>
        </div>
      ) : (
        <form onSubmit={handleInlineSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-[#1C2C54]">
  <input type="text" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="border p-2 rounded" placeholder="Título" />
  <input type="text" value={formData.offense} onChange={(e) => handleInputChange('offense', e.target.value)} className="border p-2 rounded" placeholder="Delito" />
  <input type="text" value={formData.canton} onChange={(e) => handleInputChange('canton', e.target.value)} className="border p-2 rounded" placeholder="Cantón" />

  <textarea value={formData.processDescription} onChange={(e) => handleInputChange('processDescription', e.target.value)} className="border p-2 rounded col-span-full" placeholder="Descripción" />

  <input type="text" value={formData.processNumber} readOnly className="border p-2 rounded bg-gray-200 text-gray-600" placeholder="Número de proceso" />

  <input type="number" value={formData.clientAge} onChange={(e) => handleInputChange('clientAge', Number(e.target.value))} className="border p-2 rounded" placeholder="Edad del cliente" />

  <select value={formData.processType} onChange={(e) => handleInputChange('processType', e.target.value)} className="border p-2 rounded">
    <option value="">Seleccione tipo de proceso...</option>
    {['civil', 'penal', 'laboral', 'administrativo'].map(tipo => (
      <option key={tipo} value={tipo}>{tipo}</option>
    ))}
  </select>

  <select value={formData.province} onChange={(e) => handleInputChange('province', e.target.value)} className="border p-2 rounded">
    <option value="">Seleccione provincia...</option>
    {[
      'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro',
      'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos',
      'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza', 'Pichincha',
      'Santa Elena', 'Santo Domingo de los Tsáchilas', 'Sucumbíos', 'Tungurahua',
      'Zamora Chinchipe',
    ].map(prov => (
      <option key={prov} value={prov}>{prov}</option>
    ))}
  </select>

  <select value={formData.processStatus} onChange={(e) => handleInputChange('processStatus', e.target.value)} className="border p-2 rounded">
    <option value="">Seleccione estado...</option>
    {['no iniciado', 'en progreso', 'completado'].map(est => (
      <option key={est} value={est}>{est}</option>
    ))}
  </select>

  <select value={formData.clientGender} onChange={(e) => handleInputChange('clientGender', e.target.value)} className="border p-2 rounded">
    <option value="">Seleccione género...</option>
    {['masculino', 'femenino', 'otro'].map(gen => (
      <option key={gen} value={gen}>{gen}</option>
    ))}
  </select>

  <input type="date" value={formData.startDate?.slice(0, 10)} onChange={(e) => handleInputChange('startDate', e.target.value)} className="border p-2 rounded" />
  <input type="date" value={formData.endDate?.slice(0, 10)} onChange={(e) => handleInputChange('endDate', e.target.value)} className="border p-2 rounded" />

  <div className="flex gap-4 col-span-full mt-2">
    <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Guardar</button>
    <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
  </div>
</form>
      )}

      <hr className="border-t border-gray-300 my-6" />

      {summary ? (
        <p className="text-sm text-[#1C2C54] mb-4">
          <strong>Duración:</strong> {summary.elapsedTime.monthsElapsed} meses, {summary.elapsedTime.weeksElapsed} semanas, {summary.elapsedTime.daysElapsed} días
        </p>
      ) : (
        <p className="text-sm text-gray-500">No hay fechas definidas para calcular duración.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <button onClick={handleInlineEdit} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">✏️ Editar</button>
        <button onClick={handleDelete} className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">🗑️ Eliminar</button>
        <button onClick={() => navigate('/lawyer/dashboard')} className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800">↩️ Volver al dashboard</button>
        <button onClick={() => navigate(`/lawyer/event-dashboard/${caseId}`)} className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800">📅 Ver eventos</button>
      </div>
    </div>
  );
};

export default CaseInfo;




