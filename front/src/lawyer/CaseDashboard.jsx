import { useEffect, useState, Component } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import './lawyerFunctions.css';
import * as Icon from 'react-bootstrap-icons';

// 🛡️ Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false };

  componentDidCatch(error, info) {
    console.error('Error atrapado en ErrorBoundary:', error, info);
    this.setState({ hasError: true });
  }

  render() {
    return this.state.hasError ? (
      <div className="text-red-500 p-6">
        ⚠️ Algo salió mal al cargar el dashboard.
      </div>
    ) : (
      this.props.children
    );
  }
}

// 🧠 Main Component
function CaseDashboard() {
  const { handleSetSelected: isCaseSelected } = useOutletContext();
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    province: '',
  });
  const [dates, setDates] = useState({ start: '', end: '' });
  const [provincias, setProvincias] = useState([
    'Pichincha',
    'Guayas',
    'Azuay',
    'Manabí',
    'Loja',
  ]);
  const [reportType, setReportType] = useState('all'); // Nuevo estado para tipo de reporte
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const baseURL = 'https://webback-x353.onrender.com/legalsystem';

  useEffect(() => {
    isCaseSelected(false);
    if (!token) {
      navigate('/unauthorized');
      return;
    }

    const fetchCases = async () => {
      try {
        const res = await axios.get(`${baseURL}/processes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response:', res.data); // Log para inspeccionar datos
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

  const selectCase = (caseId) => {
    isCaseSelected(true);
    navigate(`/lawyer/case-info/${caseId}`);
  };

  const handleSearchTitle = (term) => {
    setSearchTerm(term);
    applyFilters();
  };

  const applyFilters = () => {
    let filtered = [...cases];

    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((c) => c.processStatus === filters.status);
    }

    if (filters.type) {
      filtered = filtered.filter((c) => c.processType === filters.type);
    }

    if (filters.province) {
      filtered = filtered.filter((c) => c.province === filters.province);
    }

    if (dates.start && dates.end) {
      filtered = filtered.filter((c) => {
        const startDate = new Date(dates.start);
        const endDate = new Date(dates.end);
        const caseDate = new Date(c.lastUpdate);
        return caseDate >= startDate && caseDate <= endDate;
      });
    }

    setFilteredCases(filtered);
  };

  const handleCreate = () => {
    navigate(`/lawyer/create-case`);
  };

  // Fetch detalles completos de un proceso
  const fetchCaseDetails = async (processId) => {
    try {
      const [processRes, summaryRes] = await Promise.all([
        axios.get(`${baseURL}/process/${processId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/process/${processId}/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      return {
        ...processRes.data,
        events: summaryRes.data.eventsList || [], // Lista de eventos
      };
    } catch (error) {
      console.error(
        `Error al obtener detalles del proceso ${processId}:`,
        error
      );
      throw error;
    }
  };

  // Generar e imprimir reporte
  const handlePrintReport = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Filtrar casos basados en el tipo de reporte (independiente de los filtros del dashboard)
      let reportCases = [...cases];
      if (reportType !== 'all') {
        reportCases = reportCases.filter((c) => c.processStatus === reportType);
      }

      if (reportCases.length === 0) {
        setErrorMsg('No hay casos para el tipo de reporte seleccionado.');
        return;
      }

      // Obtener detalles de los casos filtrados para el reporte
      const detailedCases = await Promise.all(
        reportCases.map((c) => fetchCaseDetails(c.processId))
      );

      // Generar HTML del reporte
      let html = `
        <html>
          <head>
            <title>Reporte de Procesos</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; color: #1C2C54; }
              h2 { color: #1C2C54; }
              h3 { color: #333; }
              ul { list-style-type: disc; padding-left: 20px; }
              p { margin: 5px 0; }
              .process { border: 1px solid #ccc; padding: 15px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <h1>Reporte ${
              reportType === 'all'
                ? 'General'
                : `de Procesos ${
                    reportType.charAt(0).toUpperCase() + reportType.slice(1)
                  }`
            }</h1>
            <p><strong>Fecha del reporte:</strong> ${new Date().toLocaleDateString(
              'es-ES',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            )}</p>
            <p><strong>Total de procesos:</strong> ${detailedCases.length}</p>
      `;

      detailedCases.forEach((dc) => {
        html += `
          <div class="process">
            <h2>${dc.title} (ID: ${dc.processId})</h2>
            <p><strong>Estado:</strong> ${dc.processStatus}</p>
            <p><strong>Tipo:</strong> ${dc.processType}</p>
            <p><strong>Provincia:</strong> ${
              dc.province || 'No especificada'
            }</p>
            <p><strong>Fecha de Inicio:</strong> ${new Date(
              dc.startDate
            ).toLocaleDateString('es-ES')}</p>
            <p><strong>Última Actualización:</strong> ${new Date(
              dc.lastUpdate
            ).toLocaleDateString('es-ES')}</p>
            <h3>Observaciones:</h3>
            <p>${dc.processDescription || 'Ninguna'}</p>
            <h3>Evidencias:</h3>
            <p>No disponible (pendiente de implementación)</p>
            <h3>Eventos:</h3>
        `;
        if (dc.events && dc.events.length > 0) {
          html += '<ul>';
          dc.events.forEach((ev) => {
            html += `
              <li>
                <strong>${ev.name}</strong> (Inicio: ${new Date(
              ev.dateStart
            ).toLocaleDateString('es-ES')}, 
                Fin: ${
                  ev.dateEnd
                    ? new Date(ev.dateEnd).toLocaleDateString('es-ES')
                    : 'Pendiente'
                })
              </li>
            `;
          });
          html += '</ul>';
        } else {
          html += '<p>Ninguno</p>';
        }
        html += '</div>';
      });

      html += '</body></html>';

      // Abrir ventana nueva y disparar impresión
      const printWindow = window.open('', '_blank', 'height=600,width=800');
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      // Opcional: printWindow.close(); // Cierra después de imprimir, pero mejor dejar abierto
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      setErrorMsg(
        'Hubo un problema al generar el reporte. Verifica la conexión o los datos.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          <Icon.Folder2Open className="h-10/12 inline-block" /> Mis casos
        </h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-[#1C2C54] text-white rounded hover:bg-[#15213F]"
          >
            ➕ Crear nuevo proceso
          </button>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
          >
            <option value="all">General (Todos)</option>
            <option value="no iniciado">No iniciado</option>
            <option value="en progreso">En progreso</option>
            <option value="completado">Completado</option>
          </select>
          <button
            onClick={handlePrintReport}
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 disabled:bg-gray-500"
            disabled={loading || cases.length === 0}
          >
            📄 Generar e Imprimir Reporte
          </button>
        </div>

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
            <option value="no iniciado">No iniciado</option>
            <option value="en progreso">En progreso</option>
            <option value="completado">Completado</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
          >
            <option value="">Tipo</option>
            <option value="civil">Civil</option>
            <option value="penal">Penal</option>
            <option value="administrativo">Administrativo</option>
            <option value="laboral">Laboral</option>
            <option value="constitucional">Constitucional</option>
            <option value="contencioso">Contencioso</option>
            <option value="violencia contra la mujer">
              Violencia contra la mujer
            </option>
          </select>
          <select
            value={filters.province}
            onChange={(e) =>
              setFilters({ ...filters, province: e.target.value })
            }
            className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
          >
            <option value="">🌍 Provincia</option>
            {provincias.map((provincia) => (
              <option key={provincia} value={provincia}>
                {provincia}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dates.start}
            onChange={(e) => setDates({ ...dates, start: e.target.value })}
            className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
          />
          <input
            type="date"
            value={dates.end}
            onChange={(e) => setDates({ ...dates, end: e.target.value })}
            className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
          />
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
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
                <p className="text-gray-300">
                  <strong>ID:</strong> {c.processId}
                </p>
                <p className="text-gray-300">
                  <strong>Estado:</strong> {c.processStatus}
                </p>
                <p className="text-gray-300">
                  <strong>Tipo:</strong> {c.processType}
                </p>
                <p className="text-gray-300">
                  <strong>Provincia:</strong> {c.province || 'No especificada'}
                </p>
                <p className="text-gray-300 mb-3">
                  <strong>Inicio:</strong>{' '}
                  {new Date(c.startDate).toLocaleDateString()}
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => selectCase(c.processId)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2"
                  >
                    📄 Ver información completa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default CaseDashboard;
