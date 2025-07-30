import { useParams, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';

const EvidenceDashboard = () => {
  const { caseId } = useParams();
  const {
    handleSetSelected: isCaseSelected, 
    handleSetSelectedId: setCaseId
  }=useOutletContext();
  const [evidences, setEvidences] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPath, setUploadPath] = useState('');
  const token = localStorage.getItem('token');
  const baseURI='https://webback-x353.onrender.com/legalsystem';

  useEffect(() => {
    isCaseSelected(true);
    setCaseId(caseId);
    fetch(baseURI+`/evidences/process/${caseId}`)
      .then(res => res.json())
      .then(data => setEvidences(data))
      .catch(err => setError(err.message));
  }, [caseId]);

  const handleDelete = async (evidenceId) => {
    try {
      const res = await fetch(baseURI+`/evidence/${evidenceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('No se pudo eliminar evidencia');
      setEvidences(prev => prev.filter(ev => ev.evidenceId !== evidenceId));
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const handleEditToggle = (ev) => {
    setEditingId(ev.evidenceId);
    setEditForm({
      evidenceType: ev.evidenceType,
      evidenceName: ev.evidenceName,
      filePath: ev.filePath,
      eventId: ev.eventId
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(baseURI+`/evidence/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!res.ok) throw new Error('Error al actualizar evidencia');
      const updated = await res.json();
      setEvidences(prev => prev.map(ev => ev.evidenceId === editingId ? updated : ev));
      setEditingId(null);
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const res = await fetch(baseURI+'/evidence/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error('Error al subir archivo');
      const { filePath } = await res.json();
      setUploadPath(filePath);
      alert('Archivo subido con éxito');
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#F9F9F6] border border-[#A0A0A0] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-[#1C2C54]">🧾 Evidencias del proceso #{caseId}</h2>

      {error && <p className="text-[#6E1E2B]">{error}</p>}

      {/* Subida de archivo */}
      <div className="mb-4">
        <input type="file" onChange={e => setUploadFile(e.target.files[0])} className="mb-2" />
        <button
          onClick={handleUpload}
          className="bg-[#1C2C54] text-white px-4 py-2 rounded shadow-sm"
        >
          📤 Subir Archivo
        </button>
        {uploadPath && <p className="text-sm text-[#A0A0A0] mt-2">Archivo guardado en: {uploadPath}</p>}
      </div>

      {evidences.length === 0 ? (
        <p className="text-[#A0A0A0] text-sm">No hay evidencias registradas para este proceso.</p>
      ) : (
        <ul className="space-y-4">
          {evidences.map((ev) => (
            <li key={ev.evidenceId} className="p-4 bg-white border-l-4 border-[#1C2C54] rounded shadow-sm">
              {editingId === ev.evidenceId ? (
                <>
                  <input
                    name="evidenceName"
                    value={editForm.evidenceName}
                    onChange={handleEditChange}
                    className="block mb-1 border px-2 py-1 w-full"
                  />
                  <input
                    name="evidenceType"
                    value={editForm.evidenceType}
                    onChange={handleEditChange}
                    className="block mb-1 border px-2 py-1 w-full"
                  />
                  <input
                    name="filePath"
                    value={editForm.filePath}
                    onChange={handleEditChange}
                    className="block mb-1 border px-2 py-1 w-full"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-[#1C2C54] text-white px-3 py-1 rounded"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-[#6E1E2B]">{ev.evidenceName}</h3>
                  <p className="text-sm text-[#1C2C54]">Tipo: {ev.evidenceType}</p>
                  <p className="text-xs text-[#A0A0A0]">Ruta: {ev.filePath}</p>
                  <p className="text-xs text-[#C9A66B]">Evento: {ev.eventId}</p>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEditToggle(ev)}
                      className="bg-[#1C2C54] text-white py-1 px-2 rounded text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(ev.evidenceId)}
                      className="bg-[#6E1E2B] text-white py-1 px-2 rounded text-sm"
                    >
                      Borrar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EvidenceDashboard;

