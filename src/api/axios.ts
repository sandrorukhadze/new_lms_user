// src/api/axios.ts
import axios from "axios";
import keycloak from "../keycloack/keycloak";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  if (keycloak.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
    console.log("✅ Token attached to request");
  } else {
    console.warn("⚠️ No Keycloak token found");
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      window.dispatchEvent(new CustomEvent("access-forbidden"));
      setTimeout(() => {
        keycloak.logout();
      }, 2000);
    }

    return Promise.reject(error);
  }
);

export default api;
