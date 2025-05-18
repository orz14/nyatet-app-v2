import useAxios from "@/hooks/useAxios";

function useAuth() {
  const { axiosRaw, axiosFetch, axiosLogout } = useAxios();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth` : "https://be-nyatet.orzverse.com/api/auth";

  type LoginType = {
    username: string;
    password: string;
    remember: boolean;
  };
  const login = (credentials: LoginType) => axiosRaw("post", `${baseURL}/login`, credentials);

  type RegisterType = {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
  };
  const register = (data: RegisterType) => axiosRaw("post", `${baseURL}/register`, data);

  const currentUser = (token: string) =>
    axiosFetch(
      "get",
      `${baseURL}/current-user`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  const logout = (token?: string) => axiosLogout(`${baseURL}/logout`, token);

  const resetPassword = (credential: { email: string }) => axiosRaw("post", `${baseURL}/reset-password`, credential);

  type NewPasswordType = {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
  };
  const newPassword = (credentials: NewPasswordType) => axiosRaw("post", `${baseURL}/new-password`, credentials);

  const setFingerprint = (token: string) =>
    axiosFetch(
      "patch",
      `${baseURL}/set-fingerprint`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return {
    login,
    register,
    currentUser,
    logout,
    resetPassword,
    newPassword,
    setFingerprint,
  };
}

export default useAuth;
