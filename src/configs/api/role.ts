import useAxiosInterceptors from "@/lib/axios";

function useRole() {
  const axiosInstance = useAxiosInterceptors();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "https://be-nyatet.orzverse.com/api";

  async function getAllRole() {
    try {
      const res = await axiosInstance.get(`${baseURL}/role`);
      return res;
    } catch (err) {
      throw err;
    }
  }

  return {
    getAllRole,
  };
}

export default useRole;
