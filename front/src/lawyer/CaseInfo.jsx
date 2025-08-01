import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './lawyerFunctions.css';
import axios from 'axios';
import axios from 'axios';

const CaseInfo = () => {

  const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState(null);

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
  try {
    console.log('caseId:', caseId);
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

  const { id: caseId } = useParams();
  const {
    handleSetSelected: isCaseSelected, 
    handleSetSelectedId: setCaseId
  } = useOutletContext();

  const navigate = useNavigate();
  const [info, setInfo] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    isCaseSelected(true);
    setCaseId(Number(caseId));
    const fetchInfo = async () => {
      try {
        const baseUrl = 'https://webback-x353.onrender.com/legalsystem';
        const headers = { Authorization: `Bearer ${token}` };

        const res = await fetch(`${baseUrl}/process/${caseId}`, { headers });
        const text = await res.text();

        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
          throw new Error('Error al obtener el proceso');
        }

        const data = JSON.parse(text);
        setInfo(data);

        if (data.startDate && data.endDate) {
          const start = new Date(data.startDate);
          const end = new Date(data.endDate);
          const ms = end - start;
          const days = Math.floor(ms / (1000 * 60 * 60 * 24));
          const summaryLocal = {
            elapsedTime: {
              monthsElapsed: Math.floor(days / 30),
              weeksElapsed: Math.floor(days / 7),
              daysElapsed: days
            },
            eventsList: data.events || []
          };
          setSummary(summaryLocal);
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

  const handleEdit = () => {
    navigate(`/lawyer/edit-process/${caseId}`);
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
    <div className="bg-bone-white max-w-4xl mx-auto mt-3 p-6 shadow-md rounded-lg border border-[#A0A0A0]">
      <h2 className="text-3xl font-bold mb-6 text-regal-blue">{info.title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm text-[#1C2C54] mb-6">
        <p><strong>ID:</strong> {info.processId}</p>
        <p><strong>Tipo:</strong> {info.processType}</p>
        <p><strong>Delito:</strong> {info.offense}</p>
        <p><strong>Provincia:</strong> {info.province} / {info.canton}</p>
        <p><strong>Cliente:</strong> {info.clientGender}, {info.clientAge} años</p>
        <p><strong>Estado:</strong> {info.processStatus}</p>
        <p><strong>Inicio:</strong> {new Date(info.startDate).toLocaleDateString()}</p>
        <p><strong>Final:</strong> {info.endDate ? new Date(info.endDate).toLocaleDateString() : 'No definida'}</p>
        <p><strong>N° de proceso:</strong> {info.processNumber}</p>
        <p><strong>Descripción:</strong> {info.processDescription}</p>
      </div>

      <hr className="border-t border-[#A0A0A0] my-6" />

      <h3 className="text-xl font-semibold text-[#6E1E2B] mb-3">Resumen de eventos</h3>
      {summary ? (
        <>
          <p className="text-sm text-[#1C2C54] mb-2">
            <strong>Duración:</strong> {summary.elapsedTime.monthsElapsed} meses, {summary.elapsedTime.weeksElapsed} semanas, {summary.elapsedTime.daysElapsed} días
          </p>
          {summary.eventsList.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-[#1C2C54] space-y-1">
              {summary.eventsList.map((e, idx) => (
                <li key={idx}>
                  <strong>{e.name}</strong> — {new Date(e.dateStart).toLocaleDateString()}
                  {e.dateEnd && ` → ${new Date(e.dateEnd).toLocaleDateString()}`}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#A0A0A0]">No hay eventos registrados aún.</p>
          )}
        </>
      ) : (
        <p className="text-sm text-[#A0A0A0]">No hay fechas definidas para calcular duración.</p>
      )}
      {isEditing && (
  <form onSubmit={handleInlineSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-[#1C2C54]">
    <input type="text" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="border p-2 rounded" placeholder="Título" />
    <input type="text" value={formData.processType} onChange={(e) => handleInputChange('processType', e.target.value)} className="border p-2 rounded" placeholder="Tipo" />
    <input type="text" value={formData.offense} onChange={(e) => handleInputChange('offense', e.target.value)} className="border p-2 rounded" placeholder="Delito" />
    <input type="text" value={formData.province} onChange={(e) => handleInputChange('province', e.target.value)} className="border p-2 rounded" placeholder="Provincia" />
    <input type="text" value={formData.canton} onChange={(e) => handleInputChange('canton', e.target.value)} className="border p-2 rounded" placeholder="Cantón" />
    <input type="text" value={formData.clientGender} onChange={(e) => handleInputChange('clientGender', e.target.value)} className="border p-2 rounded" placeholder="Género cliente" />
    <input type="number" value={formData.clientAge} onChange={(e) => handleInputChange('clientAge', e.target.value)} className="border p-2 rounded" placeholder="Edad cliente" />
    <input type="text" value={formData.processStatus} onChange={(e) => handleInputChange('processStatus', e.target.value)} className="border p-2 rounded" placeholder="Estado" />
    <input type="date" value={formData.startDate?.slice(0, 10)} onChange={(e) => handleInputChange('startDate', e.target.value)} className="border p-2 rounded" />
    <input type="date" value={formData.endDate?.slice(0, 10)} onChange={(e) => handleInputChange('endDate', e.target.value)} className="border p-2 rounded" />
    <input type="text" value={formData.processNumber} onChange={(e) => handleInputChange('processNumber', e.target.value)} className="border p-2 rounded" placeholder="Número de proceso" />
    <textarea value={formData.processDescription} onChange={(e) => handleInputChange('processDescription', e.target.value)} className="border p-2 rounded col-span-full" placeholder="Descripción" />
    <div className="flex gap-4 mt-2 col-span-full">
      <button type="submit" className="px-4 !py-2 !bg-yellow-600 !text-white !rounded hover:!bg-yellow-700 !flex !items-center !gap-2">Guardar</button>
      <button type="button" onClick={() => setIsEditing(false)} className="px-4 !py-2 !bg-red-700 !text-white !rounded hover:!bg-red-800 !flex !items-center !gap-2"> Cancelar</button>
    </div>
  </form>
)}


      <hr className="border-t border-[#A0A0A0] my-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <button 
         onClick={handleInlineEdit}
         className="!px-4 !py-2 !bg-yellow-600 !text-white !rounded hover:!bg-yellow-700 !flex !items-center !gap-2"
        >
         ✏️ Editar
        </button>
        <button
          onClick={handleDelete}
          className="!px-4 !py-2 !bg-red-700 !text-white !rounded hover:!bg-red-800 !flex !items-center !gap-2"
        >
          🗑️ Eliminar
        </button>

        <button
          onClick={() => navigate('/lawyer/case-dashboard')}
          className="!px-4 !py-2 !bg-indigo-700 !text-white !rounded hover:!bg-indigo-800 !flex !items-center !gap-2"
        >
          ↩️ Volver a dashboard
        </button>
      </div>
    </div>
  );
};

export default CaseInfo;



