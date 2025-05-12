import useAxiosInterceptors from "@/lib/axios";

function useLog() {
  const axiosInstance = useAxiosInterceptors();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "https://be-nyatet.orzverse.com/api";

  async function getLog(url?: string) {
    const apiUrl = url ?? `${baseURL}/log`;
    try {
      const res = await axiosInstance.get(apiUrl);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function getNextLog() {
    try {
      const res = await axiosInstance.get(`${baseURL}/next-log`);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function clearNextLog() {
    try {
      const res = await axiosInstance.delete(`${baseURL}/next-log`);
      return res;
    } catch (err) {
      throw err;
    }
  }

  return {
    getLog,
    getNextLog,
    clearNextLog,
  };
}

export default useLog;
