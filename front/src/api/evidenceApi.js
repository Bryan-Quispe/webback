import axios from 'axios';

export const getEvidenciasByProcessId = async (processId) => {
  try {
    const response = await axios.get(
      `https://webback-x353.onrender.com/legalsystem/evidences/process/${processId}`
    );
    console.log('Evidencias recibidas:', response.data); // Para depuración
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener evidencias: ' + error.message);
  }
};
