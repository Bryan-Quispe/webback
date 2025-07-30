import axios from 'axios';
const API = 'https://webback-x353.onrender.com/legalsystem/processes';
const APIONE = 'https://webback-x353.onrender.com/legalsystem/process';

export const getAllProcesses = async () => {
  try {
    const res = await axios.get(API);
    // Verifica que los datos tengan processId
    return res.data.map((item) => ({
      ...item,
      processId: item.processId || item._id, // Fallback por si acaso
    }));
  } catch (error) {
    console.error('Error fetching processes:', error);
    throw error;
  }
};

export const getProcessById = async (processId) => {
  try {
    const res = await axios.get(`${APIONE}/${processId}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching process:', error);
    throw error;
  }
};
