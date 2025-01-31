import useAxiosInterceptors from "@/lib/axios";

function useLog() {
  const axiosInstance = useAxiosInterceptors();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/log` : "https://be-nyatet.orzverse.com/api/log";

  async function getLog(url?: string) {
    const apiUrl = url ?? baseURL;
    try {
      const res = await axiosInstance.get(apiUrl);
      return res;
    } catch (err) {
      throw err;
    }
  }

  return {
    getLog,
  };
}

export default useLog;
