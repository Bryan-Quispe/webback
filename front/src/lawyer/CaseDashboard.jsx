import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CaseDashboard() {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debe iniciar sesión");
      navigate("/unauthorized");
      return;
    }

    // Puedes reemplazar esto con tu llamada real al backend
    const mockCases = [
      { id: 1, title: "Martínez vs. Estado", status: "En proceso", startDate: "2025-07-18" },
      { id: 2, title: "Sánchez y asociados", status: "Audiencia pendiente", startDate: "2025-08-04" },
      { id: 3, title: "López contra Jurado", status: "Revisión documental", startDate: "2025-07-29" },
    ];
    setCases(mockCases);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📂 Panel de Casos</h1>
      {cases.length === 0 ? (
        <p className="text-gray-500">No hay casos registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((c) => (
            <div
              key={c.id}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-md cursor-pointer transition"
              onClick={() => navigate(`/lawyer/case-info/${c.id}`)}
            >
              <h2 className="text-lg font-semibold">{c.title}</h2>
              <p><strong>Estado:</strong> {c.status}</p>
              <p><strong>Inicio:</strong> {c.startDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



