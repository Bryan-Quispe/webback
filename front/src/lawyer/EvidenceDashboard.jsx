import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const API_URL = 'https://webback-x353.onrender.com/legalsystem'; // Ajusta según tu backend

export default function EvidenceDashboard() {
  const { register, handleSubmit, reset } = useForm();
  const [evidences, setEvidences] = useState([]);
  const [file, setFile] = useState(null);
  const [token, setToken] = useState(''); // Puedes obtenerlo desde login

  // Subir archivo y obtener ruta
  const uploadFile = async () => {
    if (!file) return '';
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`${API_URL}/evidence/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.filePath;
  };

  // Crear evidencia
  const onSubmit = async (data) => {
    try {
      const filePath = await uploadFile();
      const res = await axios.post(
        `${API_URL}/evidence`,
        { ...data, filePath },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Evidencia creada');
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  // Obtener por eventId
  const fetchByEventId = async (eventId) => {
    const res = await axios.get(`${API_URL}/evidences/event/${eventId}`);
    setEvidences(res.data);
  };

  // Obtener por processId
  const fetchByProcessId = async (processId) => {
    const res = await axios.get(`${API_URL}/evidences/process/${processId}`);
    setEvidences(res.data);
  };

  // Obtener una evidencia
  const fetchById = async (evidenceId) => {
    const res = await axios.get(`${API_URL}/evidence/${evidenceId}`);
    setEvidences([res.data]);
  };

  // Actualizar evidencia
  const updateEvidence = async (id, updateData) => {
    const res = await axios.put(`${API_URL}/evidence/${id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Actualizado');
  };

  // Eliminar evidencia
  const deleteEvidence = async (id) => {
    await axios.delete(`${API_URL}/evidence/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Eliminado');
    setEvidences(evidences.filter((e) => e.evidenceId !== id));
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Gestión de Evidencias</h1>

      <input
        className="border px-2 py-1 w-full"
        placeholder="Token de autenticación"
        onChange={(e) => setToken(e.target.value)}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 border p-4">
        <h2 className="font-semibold">Crear Evidencia</h2>
        <input {...register('eventId')} placeholder="eventId" className="border px-2 py-1 w-full" />
        <input {...register('evidenceType')} placeholder="evidenceType" className="border px-2 py-1 w-full" />
        <input {...register('evidenceName')} placeholder="evidenceName" className="border px-2 py-1 w-full" />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button className="bg-blue-500 text-white px-4 py-1 rounded" type="submit">Crear</button>
      </form>

      <div className="space-y-2">
        <h2 className="font-semibold">Buscar Evidencias</h2>
        <input
          placeholder="Buscar por evidenceId"
          className="border px-2 py-1 w-full"
          onKeyDown={(e) => e.key === 'Enter' && fetchById(e.target.value)}
        />
        <input
          placeholder="Buscar por eventId"
          className="border px-2 py-1 w-full"
          onKeyDown={(e) => e.key === 'Enter' && fetchByEventId(e.target.value)}
        />
        <input
          placeholder="Buscar por processId"
          className="border px-2 py-1 w-full"
          onKeyDown={(e) => e.key === 'Enter' && fetchByProcessId(e.target.value)}
        />
      </div>

      <div>
        <h2 className="font-semibold">Resultados</h2>
        {evidences.length === 0 && <p>No hay evidencias</p>}
        <ul className="space-y-2">
          {evidences.map((evidence) => (
            <li key={evidence.evidenceId} className="border p-2 rounded">
              <p><strong>ID:</strong> {evidence.evidenceId}</p>
              <p><strong>Nombre:</strong> {evidence.evidenceName}</p>
              <p><strong>Tipo:</strong> {evidence.evidenceType}</p>
              <p><strong>Archivo:</strong> {evidence.filePath}</p>

              <button
                className="bg-red-500 text-white px-2 py-1 mr-2 mt-2 rounded"
                onClick={() => deleteEvidence(evidence.evidenceId)}
              >
                Eliminar
              </button>

              <button
                className="bg-yellow-500 text-white px-2 py-1 mt-2 rounded"
                onClick={() =>
                  updateEvidence(evidence.evidenceId, {
                    evidenceName: prompt('Nuevo nombre'),
                  })
                }
              >
                Actualizar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


