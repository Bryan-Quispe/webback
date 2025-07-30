import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CaseInfo = () => {
  const { id: caseId } = useParams();
  const {
    handleSetSelected: isCaseSelected, 
    handleSetSelectedId: setCaseId
  }=useOutletContext();
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

  if (loading) return <p className="text-[#1C2C54]">Cargando información del caso...</p>;
  if (error) return <p className="text-[#6E1E2B]">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#F9F9F6] shadow-md rounded-lg border border-[#A0A0A0]">
      <h2 className="text-3xl font-bold mb-6 text-[#1C2C54]">{info.title}</h2>

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

      <hr className="border-t border-[#A0A0A0] my-6" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <button
          onClick={() => navigate(`/lawyer/event-dashboard/${caseId}`)}
          className="bg-[#1C2C54] text-white py-2 px-3 rounded hover:bg-[#15213F] transition"
        >
          Eventos
        </button>
        <button
          onClick={() => navigate(`/lawyer/evidence-dashboard/${caseId}`)}
          className="bg-[#6E1E2B] text-white py-2 px-3 rounded hover:bg-[#591623] transition"
        >
          Evidencias
        </button>
        <button
          onClick={() => navigate(`/lawyer/observation-dashboard/${caseId}`)}
          className="bg-[#C9A66B] text-white py-2 px-3 rounded hover:bg-[#B48E56] transition"
        >
          Observaciones
        </button>
        <button
          onClick={() => navigate(`/lawyer/pending-calendar/${caseId}`)}
          className="bg-[#4CAF50] text-white py-2 px-3 rounded hover:bg-[#3E9E44] transition"
        >
          Pendientes
        </button>
      </div>
    </div>
  );
};

export default CaseInfo;


