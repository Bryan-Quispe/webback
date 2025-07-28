import axios from 'axios';
export const getRelatedCases = async (processId) => {
  const res = await axios.get(
    `http://localhost:3000/legalsystem/relations/${processId}`
  );
  return res.data;
};
