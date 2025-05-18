import useAxios from "@/hooks/useAxios";

function useProfile() {
  const { axiosFetch } = useAxios();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/current-user` : "https://be-nyatet.orzverse.com/api/auth/current-user";

  const updateProfile = (data: { name: string; email: string }) => axiosFetch("patch", `${baseURL}/profile`, data);
  const updatePassword = (data: { current_password: string; password: string; password_confirmation: string }) => axiosFetch("patch", `${baseURL}/password`, data);
  const destroyUser = () => axiosFetch("delete", baseURL);

  return {
    updateProfile,
    updatePassword,
    destroyUser,
  };
}

export default useProfile;
