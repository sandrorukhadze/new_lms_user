// src/api/axios.ts
import axios from "axios";
import keycloak from "../keycloack/keycloak";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach token before each request
api.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  if (keycloak.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }

  return config;
});

// Handle 403 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Show modal message
      window.dispatchEvent(new CustomEvent("access-forbidden"));

      // Optionally, logout the user or redirect
      setTimeout(() => {
        keycloak.logout(); // ან keycloak.login() თუ გინდა თავიდან login
      }, 3000); // ცოტაოდენი პაუზა, სანამ მოდალი გამოჩნდება

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
