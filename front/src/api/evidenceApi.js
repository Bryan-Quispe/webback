import axios from 'axios';
export const getEvidenciasByProcessId = async (processId) => {
  const res = await axios.get(
    `http://localhost:3000/legalsystem/evidences/process/${processId}`
  );
  return res.data;
};
