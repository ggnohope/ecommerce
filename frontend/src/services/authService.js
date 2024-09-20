import { TOKEN } from "../constant";
import axiosInstance from "./axios";

export const login = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  localStorage.setItem("accessToken", response.data.data.tokens.accessToken);
  localStorage.setItem("refreshToken", response.data.data.tokens.refreshToken);
  localStorage.setItem("user", JSON.stringify(response.data.data.shop));
  return response.data.data.shop;
};

export const signup = async (userDetails) => {
  try {
    const response = await axiosInstance.post("/auth/signup", userDetails);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getMe = async () => {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data.data.shop;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export async function refreshTokenApi({ refreshToken }) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
    {
      method: "POST",
      body: JSON.stringify({ refreshToken: refreshToken }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    localStorage.removeItem(TOKEN.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN.REFRESH_TOKEN);
    localStorage.removeItem("user");
    window.location.reload();
    throw new Error(`Refresh API call failed with status ${response.status}`);
  }

  return await response.json();
}
