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

  async function store(data: { role: string }) {
    try {
      const res = await axiosInstance.post(`${baseURL}/role`, data);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function destroy(id: string) {
    try {
      const res = await axiosInstance.delete(`${baseURL}/role/${id}`);
      return res;
    } catch (err) {
      throw err;
    }
  }

  return {
    getAllRole,
    store,
    destroy,
  };
}

export default useRole;
