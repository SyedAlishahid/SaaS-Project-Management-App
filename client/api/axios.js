import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/users/v3/`,
  withCredentials: true,
});

export default api;
