import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProcesses } from '../../api/processApi';
import Navbar from '../../components/NavBarReader.jsx';
import ReaderFooter from '../../components/readerFooter.jsx';

export default function Lector() {
  const [processes, setProcesses] = useState([]);
  const [filteredProcesses, setFilteredProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    estado: '',
    tipo: '',
    provincia: '',
  });

  const navigate = useNavigate();

  const provinciasEcuador = [
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
  ];

  useEffect(() => {
    getAllProcesses()
      .then((data) => {
        const validProcesses = data.map((process) => ({
          ...process,
          processId: process.processId || process._id,
        }));
        setProcesses(validProcesses);
        setFilteredProcesses(validProcesses);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo cargar los procesos públicos.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtrado = processes.filter((p) => {
      return (
        (filters.estado === '' ||
          p.processStatus?.toLowerCase() === filters.estado.toLowerCase()) &&
        (filters.tipo === '' ||
          p.processType?.toLowerCase() === filters.tipo.toLowerCase()) &&
        (filters.provincia === '' ||
          p.province?.toLowerCase() === filters.provincia.toLowerCase())
      );
    });
    setFilteredProcesses(filtrado);
  }, [filters, processes]);

  const handleClick = (processId) => {
    if (!processId) return;
    navigate(`/lector/proceso/${processId}`);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-8">Procesos Públicos</h1>
      {/* Filtros */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
        {/* Estado */}
        <select
          className="p-2 rounded-md bg-white"
          value={filters.estado}
          onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
        >
          <option value="">Todos los estados</option>
          <option value="no iniciado">Abierto</option>
          <option value="in progress">In Proceso</option>
          <option value="completed">Completado</option>
        </select>

        {/* Tipo */}
        <select
          className="p-2 rounded-md bg-white"
          value={filters.tipo}
          onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
        >
          <option value="">Todos los tipos</option>
          <option value="Civil">Civil</option>
          <option value="Penal">Penal</option>
          <option value="Laboral">Laboral</option>
          <option value="Administrativo">Administrativo</option>
        </select>

        {/* Provincia */}
        <select
          className="p-2 rounded-md bg-white"
          value={filters.provincia}
          onChange={(e) =>
            setFilters({ ...filters, provincia: e.target.value })
          }
        >
          <option value="">Todas las provincias</option>
          {provinciasEcuador.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-center text-gray-300 text-lg">
          Cargando procesos...
        </div>
      )}

      {error && <div className="text-center text-red-500 text-lg">{error}</div>}

      {!loading && !error && filteredProcesses.length === 0 && (
        <div className="text-center text-gray-400">
          No hay procesos que coincidan con los filtros.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProcesses.map((process) => (
          <div
            key={process.processId}
            onClick={() => handleClick(process.processId)}
            className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">{process.title}</h2>
            <p className="text-gray-300 mb-2">{process.processDescription}</p>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  process.processStatus === 'Abierto'
                    ? 'bg-green-600 text-white'
                    : process.processStatus === 'Cerrado'
                    ? 'bg-red-600 text-white'
                    : 'bg-yellow-500 text-black'
                }`}
              >
                {process.processStatus}
              </span>
              <span className="bg-blue-700 text-white px-3 py-1 rounded-full text-sm">
                {process.processType}
              </span>
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                {process.province}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
