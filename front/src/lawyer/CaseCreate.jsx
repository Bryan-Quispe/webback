import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const provincias = [
  'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro',
  'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos',
  'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza', 'Pichincha',
  'Santa Elena', 'Santo Domingo de los Tsáchilas', 'Sucumbíos', 'Tungurahua',
  'Zamora Chinchipe',
];

const tiposProceso = ['civil', 'penal', 'laboral', 'administrativo'];
const estadosProceso = ['no iniciado', 'en progreso', 'completado'];
const generos = ['masculino', 'femenino', 'otro'];

// 🔢 Genera ID único tipo PROC-xxxxx
const generateProcessNumber = () => {
  const timestamp = Date.now().toString().slice(-5);
  return `PROC-${timestamp}`;
};

export default function CaseCreate() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    title: '',
    offense: '',
    canton: '',
    province: '',
    processType: '',
    clientGender: '',
    clientAge: '',
    processStatus: '',
    processNumber: generateProcessNumber(),
    processDescription: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Título requerido';
    if (!formData.processType) newErrors.processType = 'Tipo requerido';
    if (!formData.processStatus) newErrors.processStatus = 'Estado requerido';
    if (!formData.province) newErrors.province = 'Provincia requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'clientAge' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // Aquí el accountId fijo en 1 para pruebas
      const res = await axios.post(
        'https://webback-x353.onrender.com/legalsystem/process',
        {
          ...formData,
          accountId: 1,  // <- hardcodeado aquí
          endDate: null,
          lastUpdate: null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate(`/lawyer/case-info/${res.data.processId}`);
    } catch (err) {
      console.error('Error al crear proceso:', err.response?.data || err.message);
      alert('Error al crear proceso: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">📝 Crear nuevo proceso</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {[
          { label: 'Título', name: 'title' },
          { label: 'Delito', name: 'offense' },
          { label: 'Cantón', name: 'canton' },
          { label: 'Descripción', name: 'processDescription' },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block font-semibold mb-1">{label}</label>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            />
            {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
          </div>
        ))}

        <div>
          <label className="block font-semibold mb-1">Número de Proceso</label>
          <input
            type="text"
            name="processNumber"
            value={formData.processNumber}
            readOnly
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Edad del Cliente</label>
          <input
            type="number"
            name="clientAge"
            value={formData.clientAge}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Tipo de Proceso</label>
          <select
            name="processType"
            value={formData.processType}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
          >
            <option value="">Seleccione...</option>
            {tiposProceso.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errors.processType && <p className="text-red-500 text-sm mt-1">{errors.processType}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Provincia</label>
          <select
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
          >
            <option value="">Seleccione...</option>
            {provincias.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
          {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Estado del Proceso</label>
          <select
            name="processStatus"
            value={formData.processStatus}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
          >
            <option value="">Seleccione...</option>
            {estadosProceso.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
          {errors.processStatus && <p className="text-red-500 text-sm mt-1">{errors.processStatus}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Género del Cliente</label>
          <select
            name="clientGender"
            value={formData.clientGender}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
          >
            <option value="">Seleccione...</option>
            {generos.map((gen) => (
              <option key={gen} value={gen}>
                {gen}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="!px-4 !py-2 !bg-indigo-600 !text-white !rounded hover:!bg-indigo-700 !flex !items-center !gap-2"
        >
          Crear proceso
        </button>
      </form>
    </div>
  );
}







