import useAxiosInterceptors from "@/lib/axios";

function useTools() {
  const axiosInstance = useAxiosInterceptors();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "https://be-nyatet.orzverse.com/api";

  async function databaseBackup() {
    try {
      const res = await axiosInstance.post(`${baseURL}/database-backup`, {}, { responseType: "blob" });
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function optimizeClear() {
    try {
      const res = await axiosInstance.post(`${baseURL}/optimize-clear`);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function clearExpiredToken() {
    try {
      const res = await axiosInstance.delete(`${baseURL}/token/expired/clear`);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function clearToken() {
    try {
      const res = await axiosInstance.delete(`${baseURL}/token/clear`);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function clearPasswordToken() {
    try {
      const res = await axiosInstance.delete(`${baseURL}/token/password/clear`);
      return res;
    } catch (err) {
      throw err;
    }
  }

  return {
    databaseBackup,
    optimizeClear,
    clearExpiredToken,
    clearToken,
    clearPasswordToken,
  };
}

export default useTools;
