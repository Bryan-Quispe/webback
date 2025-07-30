import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';

export default function CaseDashboard() {
  const {
    handleSetSelected: isCaseSelected,
    handleSetSelectedId: setCaseId,
  } = useOutletContext();

  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '', type: '', province: '' });
  const [dates, setDates] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const baseURL = 'https://webback-x353.onrender.com/legalsystem';

  const provincias = [
    'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro',
    'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos',
    'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza', 'Pichincha',
    'Santa Elena', 'Santo Domingo de los Tsáchilas', 'Sucumbíos', 'Tungurahua',
    'Zamora Chinchipe',
  ];
  const tiposProceso = ['civil', 'penal', 'laboral', 'administrativo'];
  const estadosProceso = ['no iniciado', 'en curso', 'terminado'];
  const selectCase = (caseId) => {
    isCaseSelected(true);
    navigate(`/lawyer/case-info/${caseId}`);
  };

  const fetchAllCases = async () => {
    try {
      const res = await axios.get(`${baseURL}/processes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCases(res.data);
      setFilteredCases(res.data);
    } catch (error) {
      console.error('Error al obtener procesos:', error);
      setErrorMsg('Hubo un problema al cargar los procesos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      alert('Debe iniciar sesión');
      navigate('/unauthorized');
      return;
    }
    fetchAllCases();
  }, [navigate, token]);

  const handleSearchTitle = async (term) => {
    setSearchTerm(term);
    try {
      const res = await axios.get(`${baseURL}/processes/searchByTitle?title=${term}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFilteredCases(res.data);
    } catch (err) {
      console.error('Error al buscar por título:', err);
    }
  };

  const applyFilters = async () => {
    try {
      if (filters.status) {
        const res = await axios.get(`${baseURL}/processes/searchByStatus?status=${filters.status}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFilteredCases(res.data);
      }
      if (filters.type) {
        const res = await axios.get(`${baseURL}/processes/searchByType?type=${filters.type}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFilteredCases(res.data);
      }
      if (filters.province) {
        const res = await axios.get(`${baseURL}/processes/searchByProvince?province=${filters.province}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFilteredCases(res.data);
      }
      if (dates.start && dates.end) {
        const res = await axios.get(
          `${baseURL}/processes/searchByLastUpdate?start_date=${dates.start}&end_date=${dates.end}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFilteredCases(res.data);
      }
    } catch (err) {
      console.error('Error aplicando filtros:', err);
      setErrorMsg('No se pudo aplicar el filtro.');
    }
  };

  const handleCreate = () => {
    navigate(`/lawyer/create-case`);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white ">
      <h1 className="text-3xl font-bold mb-6">📂 Panel de Casos</h1>

      <button
        onClick={handleCreate}
        className="mb-6 px-4 py-2 !bg-blue-700 !text-white !rounded hover:!bg-blue-800"
      >
        ➕ Crear nuevo proceso
      </button>

      <div className="mb-4 flex flex-col md:flex-row md:items-end gap-4">
        <input
          type="text"
          placeholder="🔍 Buscar por título..."
          value={searchTerm}
          onChange={(e) => handleSearchTitle(e.target.value)}
          className="p-2 rounded border border-gray-600 bg-gray-800 text-white w-full md:max-w-xs placeholder-gray-400"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
        >
          <option value="">🛠 Estado</option>
          <option value="no iniciado"> no iniciado</option>
          <option value="en progreso"> en progreso</option>
          <option value="completado"> completado</option>
        </select>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
        >
          <option value="">Tipo</option>
          <option value="civil">civil</option>
          <option value="penal">penal</option>
          <option value="civil">administrativo</option>
          <option value="penal">laboral</option>
        </select>
        <select value={filters.province}
        onChange={(e) => setFilters({ ...filters, province: e.target.value })}
        className="p-2 rounded bg-gray-800 border border-gray-600 text-white">
          <option value="">📍 Provincia</option>
          {provincias.map((prov) => (
          <option key={prov} value={prov}>{prov}</option>
          ))}
          </select>
        <input
        type="date"
        value={dates.start}
        onChange={(e) => setDates({ ...dates, start: e.target.value })}
        className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
        />
        <button
          onClick={applyFilters}
          className="px-4 py-2 !bg-green-700 !text-white !rounded hover:!bg-green-800"
        >
        Aplicar filtros
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando casos...</p>
      ) : errorMsg ? (
        <p className="text-red-500">{errorMsg}</p>
      ) : filteredCases.length === 0 ? (
        <p className="text-gray-400">No hay coincidencias.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.map((c) => (
            <div
              key={c.processId}
              className="bg-gray-800 p-6 rounded shadow border-l-8 border-blue-600"
            >
              <h2 className="text-xl font-semibold mb-2">{c.title}</h2>
              <p className="text-gray-300"><strong>ID:</strong> {c.processId}</p>
              <p className="text-gray-300"><strong>Estado:</strong> {c.processStatus}</p>
              <p className="text-gray-300"><strong>Tipo:</strong> {c.processType}</p>
              <p className="text-gray-300"><strong>Provincia:</strong> {c.province}</p>
              <p className="text-gray-300 mb-3"><strong>Inicio:</strong> {new Date(c.startDate).toLocaleDateString()}</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => selectCase(c.processId)}
                  className="!px-4 !py-2 !bg-indigo-600 !text-white !rounded hover:!bg-indigo-700 !flex !items-center !gap-2"
                >
                  📄 Ver información completa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




