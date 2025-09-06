import axios from "axios";
const DB_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: DB_URL,
  withCredentials: true,
  headers: { ContentType: "application/json" },
});
