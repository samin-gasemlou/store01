// src/api/client.js
import axios from "axios";

const client = axios.create({
  baseURL: "https://01-app.liara.run",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("shop_access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ هم default داشته باش هم named export
export const api = client;
export default client;
