// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\lib\api.ts

import axios, { AxiosInstance } from "axios";

/**
 * Base API URL for the DTC Backend.
 * Assumes backend is running on local port 5066 (from backend launch profile).
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5066/api";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Utility to set the Bearer token for authenticated requests.
 * @param token The JWT from Clerk session.
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// For Node.js environments (Server Components/Routes), handle self-signed certificates
if (typeof window === "undefined") {
  const https = require("https");
  api.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });
}

// Optional: Add axios interceptors for auth tokens if needed in the future
// api.interceptors.request.use((config) => { ... });

export default api;
