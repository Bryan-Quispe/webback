import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CaseDashboard() {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('Debe iniciar sesión');
      navigate('/unauthorized');
      return;
    }

    const fetchCases = async () => {
      try {
        const res = await axios.get('http://localhost:3000/legalsystem/processes', {
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

    fetchCases();
  }, [navigate, token]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = cases.filter((c) =>
      c.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCases(filtered);
  };

  const handleCreate = async () => {
    try {
      const res = await axios.post('http://localhost:3000/legalsystem/process', {
        accountId: 1,
        title: 'Nuevo proceso',
        processType: 'judicial',
        offense: 'Estafa',
        province: 'Pichincha',
        canton: 'Quito',
        clientGender: 'Femenino',
        clientAge: 32,
        processStatus: 'not started',
        endDate: null,
        processNumber: 'EXP-2025-001',
        processDescription: 'Caso inicial generado desde UI',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/lawyer/case-info/${res.data.processId}`);
    } catch (err) {
      alert('Error al crear proceso');
    }
  };

  const handleEdit = (processId) => {
    navigate(`/lawyer/edit-process/${processId}`);
  };

  const handleDelete = async (processId) => {
    if (!window.confirm('¿Eliminar este proceso? Esta acción no se puede deshacer.')) return;
    try {
      await axios.delete(`http://localhost:3000/legalsystem/process/${processId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFilteredCases((prev) => prev.filter((p) => p.processId !== processId));
      alert('Proceso eliminado');
    } catch (err) {
      alert('Error al eliminar proceso');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📂 Panel de Casos</h1>

      <button
        onClick={handleCreate}
        className="mb-6 px-4 py-2 bg-[#1C2C54] text-white rounded hover:bg-[#15213F]"
      >
        📝 Crear nuevo proceso
      </button>

      <input
        type="text"
        placeholder="🔍 Buscar por título..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-6 p-2 border rounded w-full max-w-md"
      />

      {loading ? (
        <p className="text-gray-500">Cargando casos...</p>
      ) : errorMsg ? (
        <p className="text-red-500">{errorMsg}</p>
      ) : filteredCases.length === 0 ? (
        <p className="text-gray-500">No hay coincidencias.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.map((c) => (
            <div key={c.processId} className="bg-white border rounded-lg p-4 shadow">
              <h2 className="text-lg font-semibold">{c.title}</h2>
              <p><strong>ID:</strong> {c.processId}</p>
              <p><strong>Estado:</strong> {c.processStatus}</p>
              <p><strong>Tipo:</strong> {c.processType}</p>
              <p><strong>Provincia:</strong> {c.province}</p>
              <p><strong>Inicio:</strong> {new Date(c.startDate).toLocaleDateString()}</p>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/lawyer/case-info/${c.processId}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Ver información completa
                </button>

                <button
                  onClick={() => handleEdit(c.processId)}
                  className="px-4 py-2 bg-[#C9A66B] text-white rounded hover:bg-[#B48E56]"
                >
                  ✏️ Editar
                </button>

                <button
                  onClick={() => handleDelete(c.processId)}
                  className="px-4 py-2 bg-[#6E1E2B] text-white rounded hover:bg-[#541722]"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}





