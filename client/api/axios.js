import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/users/v3/",
  withCredentials: true,
});

export default api;
