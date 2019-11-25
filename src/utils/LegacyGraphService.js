import axios from 'axios';

export const legacyGraph = async (endpoint, payload) => {
  const instance = axios.create({
    endpoint,
    headers: { 'Content-Type': 'application/json' },
  });
  try {
    return await instance.post(`${endpoint}`, payload);
  } catch (err) {
    return err.response;
  }
};
