// api/axios.ts
import axios from "axios";
import keycloak from "../keycloack/keycloak";
import { mapErrorMessage } from "../utils/mapErrorMessage";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const tokenService = {
  getToken: () => keycloak.token || null,

  refreshToken: async (minValidity = 5): Promise<string | null> => {
    try {
      const refreshed = await keycloak.updateToken(minValidity);
      if (refreshed) {
        return keycloak.token || null;
      }
      return null;
    } catch (error) {
      console.error("🔁 Token refresh failed:", error);
      keycloak.logout();
      return null;
    }
  },
};

// 📦 Request Interceptor: Add Bearer Token
api.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  const token = tokenService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 📦 Response Interceptor: Error Handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔁 401 Refresh Try
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await tokenService.refreshToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // Retry
      }
    }

    const status = error?.response?.status;
    const message = error?.response?.data?.message || "";

    // 🎯 შევამოწმოთ ლიცენზიის მესიჯი
    const isLicenseUnavailable = message.includes("License not available");

    // ✅ თუ ლიცენზიები გამოყენებულია – ჩვენი custom მოდალის event
    if (isLicenseUnavailable) {
      window.dispatchEvent(
        new CustomEvent("license-unavailable", {
          detail: {
            message: "ამჟამად ყველა ლიცენზია გამოყენებულია",
          },
        })
      );
    }
    // ✅ სხვა შემთხვევაში, access-forbidden
    else if (status === 403 || status === 400) {
      window.dispatchEvent(
        new CustomEvent("access-forbidden", { detail: status })
      );
    }

    // ❌ თუ არ გვინდა toast ამ შემთხვევაში, მოვაშოროთ:
    if (!isLicenseUnavailable) {
      const friendly = mapErrorMessage(message);
      toast.error(friendly);
    }

    return Promise.reject(error);
  }
);

export default api;
