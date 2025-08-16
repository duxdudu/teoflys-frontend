/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import {
  getStoredTokens,
  setStoredTokens,
  clearStoredTokens,
} from "./auth-storage";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://teoflys-backend.onrender.com"}/api`,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const tokens = getStoredTokens();
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const tokens = getStoredTokens();

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        response: {
          status: 0,
          data: {
            error: "Network error - Please check if the server is running",
            code: "NETWORK_ERROR",
          },
        },
      });
    }

    if (
      error.response?.status === 401 &&
      (error.response?.data?.code === "TOKEN_EXPIRED" ||
        error.response?.data?.code === "INVALID_TOKEN") &&
      !originalRequest._retry &&
      tokens?.refreshToken
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post("/auth/refresh-token", {
          refreshToken: tokens.refreshToken,
        });

        const newTokens = response.data;
        setStoredTokens(newTokens);

        // Update the Authorization header
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newTokens.accessToken}`;
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newTokens.accessToken}`;

        processQueue();
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        clearStoredTokens();
        window.location.href = "/admin/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
