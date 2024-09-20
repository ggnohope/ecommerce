import axios from "axios";
import { isAccessTokenExpired } from "../utils";
import { TOKEN } from "../constant";
import { refreshTokenApi } from "./authService";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
});

// Add interceptor for requests to include the access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling token refresh
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(TOKEN.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(TOKEN.REFRESH_TOKEN);
    if (token && !isAccessTokenExpired(token)) {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    }
    try {
      if (token && isAccessTokenExpired(token)) {
        const refreshResponse = await refreshTokenApi({ refreshToken });
        console.log(refreshResponse);
        if (!refreshResponse.data.accessToken) {
          localStorage.removeItem(TOKEN.ACCESS_TOKEN);
          localStorage.removeItem(TOKEN.REFRESH_TOKEN);
          localStorage.removeItem("user");
          window.location.reload();
        } else {
          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem(TOKEN.ACCESS_TOKEN, newAccessToken);
          config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
