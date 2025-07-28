import axios from 'axios';
export const getObservationsByProcessId = async (processId) => {
  const res = await axios.get(`http://localhost:3000/legalsystem/observations`);
  return res.data;
};
