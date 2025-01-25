import useAxiosInterceptors from "@/lib/axios";

function useAuth() {
  const axiosInstance = useAxiosInterceptors();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth` : "https://be-nyatet.orzverse.com/api/auth";

  type LoginType = {
    username: string;
    password: string;
    remember: boolean;
  };

  async function login(credentials: LoginType) {
    try {
      const res = await axiosInstance.post(`${baseURL}/login`, credentials);
      return res;
    } catch (err) {
      throw err;
    }
  }

  type RegisterType = {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
  };

  async function register(data: RegisterType) {
    try {
      const res = await axiosInstance.post(`${baseURL}/register`, data);
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
      const res = await axiosInstance.delete(`${baseURL}/logout`, config);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function resetPassword(credential: { email: string }) {
    try {
      const res = await axiosInstance.post(`${baseURL}/reset-password`, credential);
      return res;
    } catch (err) {
      throw err;
    }
  }

  type NewPasswordType = {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
  };

  async function newPassword(credentials: NewPasswordType) {
    try {
      const res = await axiosInstance.post(`${baseURL}/new-password`, credentials);
      return res;
    } catch (err) {
      throw err;
    }
  }

  return {
    login,
    register,
    logout,
    resetPassword,
    newPassword,
  };
}

export default useAuth;
