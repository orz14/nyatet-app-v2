import useAxios from "@/hooks/useAxios";

function useServer() {
  const { axiosRaw } = useAxios();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "https://be-nyatet.orzverse.com/api";

  const checkConnection = () => axiosRaw("get", `${baseURL}/check-connection`);

  return {
    checkConnection,
  };
}

export default useServer;
