import useAxiosInterceptors from "@/lib/axios";
import axios from "axios";

function useService() {
  const axiosInstance = useAxiosInterceptors();

  async function getIp() {
    try {
      const res = await axiosInstance.get("/api/get-ip");
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function setToken(token: string) {
    try {
      const res = await axiosInstance.post("/api/set-token", { token });
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function getToken() {
    try {
      const res = await axiosInstance.get("/api/get-token");
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function removeToken() {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      const res = await axios.post("/api/remove-token", {}, config);
      return res;
    } catch (err) {
      throw err;
    }
  }

  return {
    getIp,
    setToken,
    getToken,
    removeToken,
  };
}

export default useService;
