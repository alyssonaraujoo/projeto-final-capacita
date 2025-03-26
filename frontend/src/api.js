import axios from "axios";

const api = axios.create({
  baseURL: "https://projeto-final-capacita.onrender.com", // URL do backend
  withCredentials: true,
});

export default api;
