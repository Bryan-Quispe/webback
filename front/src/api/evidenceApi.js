import axios from 'axios';
export const getEvidenciasByProcessId = async (processId) => {
  const res = await axios.get(
    `https://webback-x353.onrender.com/legalsystem/evidences/process/${processId}`
  );
  return res.data;
};
