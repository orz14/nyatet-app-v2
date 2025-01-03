import useAxiosInterceptors from "@/lib/axios";

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
    try {
      const res = await axiosInstance.post("/api/remove-token");
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
