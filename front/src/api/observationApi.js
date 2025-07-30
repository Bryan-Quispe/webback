import axios from 'axios';
export const getObservationsByProcessId = async (processId) => {
  const res = await axios.get(`https://webback-x353.onrender.com/legalsystem/observations`);
  return res.data;
};
