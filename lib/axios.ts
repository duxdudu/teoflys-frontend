import axios from "axios";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://teoflys-backend.onrender.com";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach tokens
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${BACKEND_URL}/api/auth/refresh-token`,
            {
              refreshToken,
            }
          );

          const { accessToken } = response.data;
          localStorage.setItem("accessToken", accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh token failed, redirect to login
          localStorage.clear();
          window.location.href = "/admin/login";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
