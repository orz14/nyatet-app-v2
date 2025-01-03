import axios from "axios";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const axiosInstance = axios.create({
  headers,
  timeout: 60 * 1000,
});

axiosInstance.interceptors.request.use(
  (config) => config,
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

    return Promise.reject(error);
  }
);

function useAxiosInterceptors() {
  return axiosInstance;
}

export default useAxiosInterceptors;
