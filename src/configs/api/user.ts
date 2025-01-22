import useAxiosInterceptors from "@/lib/axios";

function useUser() {
  const axiosInstance = useAxiosInterceptors();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "https://nyatet.orzverse.com/api";

  async function getAllUser(url?: string) {
    const apiUrl = url ?? `${baseURL}/user`;
    try {
      const res = await axiosInstance.get(apiUrl);
      return res;
    } catch (err) {
      throw err;
    }
  }

  return {
    getAllUser,
  };
}

export default useUser;
