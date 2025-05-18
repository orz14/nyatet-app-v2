import useAxios from "@/hooks/useAxios";

function useUser() {
  const { axiosFetch } = useAxios();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "https://be-nyatet.orzverse.com/api";

  const getAllUser = (url?: string) => {
    const apiUrl = url ?? `${baseURL}/user`;
    return axiosFetch("get", apiUrl);
  };

  return {
    getAllUser,
  };
}

export default useUser;
