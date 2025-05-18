import useAxios from "@/hooks/useAxios";

function useLog() {
  const { axiosFetch } = useAxios();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "https://be-nyatet.orzverse.com/api";

  const getLog = (url?: string) => {
    const apiUrl = url ?? `${baseURL}/log`;
    return axiosFetch("get", apiUrl);
  };
  const getNextLog = () => axiosFetch("get", `${baseURL}/next-log`);
  const clearNextLog = () => axiosFetch("delete", `${baseURL}/next-log`);

  return {
    getLog,
    getNextLog,
    clearNextLog,
  };
}

export default useLog;
