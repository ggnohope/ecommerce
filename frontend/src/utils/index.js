import { jwtDecode } from "jwt-decode";

export function isAccessTokenExpired(accessToken) {
  try {
    if (!accessToken) {
      return {
        name: "No Token Found!",
        message: "You are not logged in",
      };
    }
    const decoded = jwtDecode(accessToken);
    if (decoded.exp) {
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    }
  } catch {
    return true; // Assume expired if decoding fails (better to be cautious)
  }
}
