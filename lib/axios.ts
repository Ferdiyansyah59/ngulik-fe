import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:1805/api/v1";

const axiosInstanse = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstanse.interceptors.request.use(
  (config) => {
    const { authHeader } = useAuthStore();

    if (authHeader) {
      config.headers.Authorization = authHeader;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstanse;
