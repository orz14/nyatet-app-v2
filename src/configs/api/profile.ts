import useAxiosInterceptors from "@/lib/axios";

function useProfile() {
  const axiosInstance = useAxiosInterceptors();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/current-user` : "https://be-nyatet.orzverse.com/api/auth/current-user";

  async function updateProfile(data: { name: string; email: string }) {
    try {
      const res = await axiosInstance.patch(`${baseURL}/profile`, data);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function updatePassword(data: { current_password: string; password: string; password_confirmation: string }) {
    try {
      const res = await axiosInstance.patch(`${baseURL}/password`, data);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function destroyUser() {
    try {
      const res = await axiosInstance.delete(`${baseURL}`);
      return res;
    } catch (err) {
      throw err;
    }
  }

  return {
    updateProfile,
    updatePassword,
    destroyUser,
  };
}

export default useProfile;
