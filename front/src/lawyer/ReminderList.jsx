import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function ReminderList() {
  const [reminders, setReminders] = useState([]);
  const {
    handleSetSelected: isCaseSelected, 
    handleSetSelectedId: setCaseId
  }=useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    isCaseSelected(true);
    if (!token) {
      alert('Debe iniciar sesión');
      navigate('/unauthorized');
      return;
    }

    // Simulación de datos de recordatorios
    const mockReminders = [
      {
        id: 1,
        title: 'Revisar expediente del caso 102',
        description: 'Analizar documentos pendientes antes del viernes.',
        dueDate: '2025-07-30T10:00:00',
        status: 'pendiente'
      },
      {
        id: 2,
        title: 'Preparar argumentos para audiencia',
        description: 'Redactar resumen oral para el caso Sánchez.',
        dueDate: '2025-08-02T09:30:00',
        status: 'completado'
      },
      {
        id: 3,
        title: 'Enviar observaciones al juez',
        description: 'Correo con puntos clave del caso López.',
        dueDate: '2025-08-01T15:00:00',
        status: 'pendiente'
      }
    ];

    setReminders(mockReminders);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">⏰ Recordatorios Activos</h1>
      {reminders.length === 0 ? (
        <p className="text-gray-500">No hay recordatorios disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reminders.map((r) => (
            <div
              key={r.id}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-[#6E1E2B]">{r.title}</h2>
              <p><strong>Descripción:</strong> {r.description}</p>
              <p><strong>Fecha límite:</strong> {new Date(r.dueDate).toLocaleString('es-EC')}</p>
              <p>
                <strong>Estado:</strong>{' '}
                <span className={r.status === 'pendiente' ? 'text-yellow-700' : 'text-green-700'}>
                  {r.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}





