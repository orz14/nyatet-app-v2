import useAxiosInterceptors from "@/lib/axios";

function useServer() {
  const axiosInstance = useAxiosInterceptors();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "https://nyatet.orzverse.com/api";

  async function checkConnection() {
    try {
      const res = await axiosInstance.get(`${baseURL}/check-connection`);
      return res;
    } catch (err) {
      throw err;
    }
  }

  return {
    checkConnection,
  };
}

export default useServer;
