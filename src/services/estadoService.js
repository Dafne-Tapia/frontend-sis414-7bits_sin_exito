import axios from 'axios';

const API_URL = 'https://estado-q8dw.onrender.com/api/estado';

export const listarEstados = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const buscarEstadoPorId = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const guardarEstado = async (estado) => {
  const res = await axios.post(API_URL, estado);
  return res.data;
};

export const actualizarEstado = async (id, estado) => {
  const res = await axios.put(`${API_URL}/${id}`, estado);
  return res.data;
};

export const eliminarEstado = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};