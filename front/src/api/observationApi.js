// api/observationApi.js
import axios from 'axios';

export const getObservationsByProcessId = async (processId) => {
  try {
    const response = await axios.get(
      `https://webback-x353.onrender.com/legalsystem/observations/process/${processId}`
    );
    console.log('Observaciones recibidas:', response.data); // Para depuración
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener observaciones: ' + error.message);
  }
};
