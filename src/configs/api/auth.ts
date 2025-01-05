import useAxiosInterceptors from "@/lib/axios";

function useAuth() {
  const axiosInstance = useAxiosInterceptors();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "https://nyatet.orzverse.com/api";

  async function login(credentials: { username: string; password: string; remember: boolean }) {
    try {
      const res = await axiosInstance.post(`${baseURL}/auth/login`, credentials);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function logout(token?: string) {
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

    try {
      const res = await axiosInstance.delete(`${baseURL}/auth/logout`, config);
      return res;
    } catch (err) {
      throw err;
    }
  }

  return {
    login,
    logout,
  };
}

export default useAuth;
