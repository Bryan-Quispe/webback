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
  const [saving, setSaving] = useState(false);

  const { id: caseId } = useParams();
  const navigate = useNavigate();
  const { handleSetSelected: isCaseSelected, handleSetSelectedId: setCaseId } =
    useOutletContext();

  useEffect(() => {
    const token = localStorage.getItem('token');
    isCaseSelected(true);
    setCaseId(Number(caseId));

    const fetchInfo = async () => {
      try {
        const res = await fetch(
          `https://webback-x353.onrender.com/legalsystem/process/${caseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const text = await res.text();
        if (
          !res.ok ||
          !res.headers.get('content-type')?.includes('application/json')
        ) {
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
              daysElapsed: days,
            },
            eventsList: data.events || [],
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInlineSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!formData.title || !formData.processType) {
      alert('Título y tipo de proceso son obligatorios');
      return;
    }
    try {
      setSaving(true);
      await axios.put(
        `https://webback-x353.onrender.com/legalsystem/process/${caseId}/update`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInfo(formData);
      setIsEditing(false);
      setSaving(false);
    } catch (err) {
      console.error('Error al actualizar proceso:', err);
      alert('No se pudo actualizar el proceso');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (
      !window.confirm(
        '¿Eliminar este proceso? Esta acción no se puede deshacer.'
      )
    )
      return;
    try {
      await axios.delete(
        `https://webback-x353.onrender.com/legalsystem/process/${caseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Proceso eliminado correctamente');
      navigate('/lawyer/dashboard');
    } catch (err) {
      console.error('Error al eliminar proceso:', err);
      alert('Error al eliminar proceso');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1C2C54] mx-auto mb-4"></div>
          <p className="text-[#1C2C54] text-lg">
            Cargando información del caso...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-start">
          <div className="bg-red-100 p-3 rounded-full mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-800">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );

  return (
    <div
      className={`bg-white max-w-4xl mx-auto mt-4 p-6 shadow-md rounded-xl border ${
        isEditing ? 'border-yellow-500 border-2' : 'border-gray-300'
      }`}
    >
      {/* Banner de modo edición */}
      {isEditing && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <strong>Modo Edición:</strong> Estás editando este caso. Los cambios
            se guardarán cuando presiones "Guardar Cambios".
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <h2 className="text-3xl font-bold text-[#1C2C54]">
          {info.title}
          {isEditing && (
            <span className="ml-3 bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded">
              Editando
            </span>
          )}
        </h2>

        <div className="flex space-x-2">
          <button
            onClick={handleInlineEdit}
            disabled={isEditing}
            className={`px-3 py-1 rounded text-sm ${
              isEditing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}
          >
            ✏️ Editar
          </button>
          <button
            onClick={handleDelete}
            disabled={isEditing}
            className={`px-3 py-1 rounded text-sm ${
              isEditing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-700 text-white hover:bg-red-800'
            }`}
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#1C2C54] mb-6">
          <p>
            <strong>ID:</strong> {info.processId}
          </p>
          <p>
            <strong>Tipo:</strong> {info.processType}
          </p>
          <p>
            <strong>Delito:</strong> {info.offense}
          </p>
          <p>
            <strong>Provincia:</strong> {info.province} / {info.canton}
          </p>
          <p>
            <strong>Cliente:</strong> {info.clientGender}, {info.clientAge} años
          </p>
          <p>
            <strong>Estado:</strong> {info.processStatus}
          </p>
          <p>
            <strong>Inicio:</strong>{' '}
            {new Date(info.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Final:</strong>{' '}
            {info.endDate
              ? new Date(info.endDate).toLocaleDateString()
              : 'No definida'}
          </p>
          <p>
            <strong>N° de proceso:</strong> {info.processNumber}
          </p>
          <p className="md:col-span-2">
            <strong>Descripción:</strong> {info.processDescription}
          </p>
        </div>
      ) : (
        <form onSubmit={handleInlineSave} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-[#1C2C54]">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Título*
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Título del caso"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Delito
              </label>
              <input
                type="text"
                value={formData.offense}
                onChange={(e) => handleInputChange('offense', e.target.value)}
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Delito"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Cantón
              </label>
              <input
                type="text"
                value={formData.canton}
                onChange={(e) => handleInputChange('canton', e.target.value)}
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Cantón"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Tipo de proceso*
              </label>
              <select
                value={formData.processType}
                onChange={(e) =>
                  handleInputChange('processType', e.target.value)
                }
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              >
                <option value="">Seleccione tipo de proceso...</option>
                {[
                  'civil',
                  'penal',
                  'laboral',
                  'administrativo',
                  'constitucional',
                  'contencioso',
                  'violencia contra la mujer',
                ].map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Provincia
              </label>
              <select
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="">Seleccione provincia...</option>
                {[
                  'Azuay',
                  'Bolívar',
                  'Cañar',
                  'Carchi',
                  'Chimborazo',
                  'Cotopaxi',
                  'El Oro',
                  'Esmeraldas',
                  'Galápagos',
                  'Guayas',
                  'Imbabura',
                  'Loja',
                  'Los Ríos',
                  'Manabí',
                  'Morona Santiago',
                  'Napo',
                  'Orellana',
                  'Pastaza',
                  'Pichincha',
                  'Santa Elena',
                  'Santo Domingo de los Tsáchilas',
                  'Sucumbíos',
                  'Tungurahua',
                  'Zamora Chinchipe',
                ].map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Estado
              </label>
              <select
                value={formData.processStatus}
                onChange={(e) =>
                  handleInputChange('processStatus', e.target.value)
                }
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="">Seleccione estado...</option>
                {['no iniciado', 'en progreso', 'completado'].map((est) => (
                  <option key={est} value={est}>
                    {est}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Género del cliente
              </label>
              <select
                value={formData.clientGender}
                onChange={(e) =>
                  handleInputChange('clientGender', e.target.value)
                }
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="">Seleccione género...</option>
                {['masculino', 'femenino', 'otro'].map((gen) => (
                  <option key={gen} value={gen}>
                    {gen}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Edad del cliente
              </label>
              <input
                type="number"
                value={formData.clientAge}
                onChange={(e) =>
                  handleInputChange('clientAge', Number(e.target.value))
                }
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Edad"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Fecha de inicio
              </label>
              <input
                type="date"
                value={formData.startDate?.slice(0, 10)}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Fecha de finalización
              </label>
              <input
                type="date"
                value={formData.endDate?.slice(0, 10)}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                value={formData.processDescription}
                onChange={(e) =>
                  handleInputChange('processDescription', e.target.value)
                }
                className="border border-gray-300 p-2 rounded w-full h-32 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Descripción detallada del caso"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Número de proceso
              </label>
              <input
                type="text"
                value={formData.processNumber}
                readOnly
                className="border border-gray-300 p-2 rounded w-full bg-gray-100 text-gray-600"
                placeholder="Número de proceso"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-400"
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                '💾 Guardar Cambios'
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              ❌ Cancelar Edición
            </button>
          </div>
        </form>
      )}

      <hr className="border-t border-gray-300 my-6" />

      {summary ? (
        <p className="text-sm text-[#1C2C54] mb-4">
          <strong>Duración:</strong> {summary.elapsedTime.monthsElapsed} meses,{' '}
          {summary.elapsedTime.weeksElapsed} semanas,{' '}
          {summary.elapsedTime.daysElapsed} días
        </p>
      ) : (
        <p className="text-sm text-gray-500">
          No hay fechas definidas para calcular duración.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <button
          onClick={() => navigate('/lawyer/dashboard')}
          className="flex items-center justify-center bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Volver al dashboard
        </button>
        <button
          onClick={() => navigate(`/lawyer/event-dashboard/${caseId}`)}
          className="flex items-center justify-center bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          Ver eventos
        </button>
      </div>
    </div>
  );
};

export default CaseInfo;
