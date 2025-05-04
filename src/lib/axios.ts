import axios from "axios";
import { getCookie } from "./cookie";
import { decryptData } from "./crypto";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const axiosInstance = axios.create({
  headers,
  timeout: 60 * 1000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // X-CSRF-TOKEN
    const csrfToken = getCookie("CSRF-TOKEN") ?? null;
    if (csrfToken) {
      config.headers["X-CSRF-TOKEN"] = csrfToken;
    }

    // User-IP
    const getUserIp = getCookie("user-ip") ?? null;
    if (getUserIp) {
      const userIp = getUserIp.replace(/=/g, "");
      config.headers["User-IP"] = userIp;
    }

    // Fingerprint_
    const getFingerprint = getCookie("fingerprint_") ?? null;
    if (getFingerprint) {
      config.headers["Fingerprint_"] = getFingerprint;
    }

    // Authorization
    const encryptedData = localStorage.getItem("encryptedData") ?? null;
    if (encryptedData) {
      const decryptedData = decryptData(encryptedData);
      config.headers["Authorization"] = `Bearer ${decryptedData.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("🚀 Error response:", error.response);
    } else if (error.request) {
      console.error("🚀 Error request:", error.request);
    } else {
      console.error("🚀 Error message:", error.message);
    }

    if (error.response?.data?.message == "Unauthenticated.") {
      localStorage.removeItem("encryptedData");
    }

    return Promise.reject(error);
  }
);

function useAxiosInterceptors() {
  return axiosInstance;
}

export default useAxiosInterceptors;
