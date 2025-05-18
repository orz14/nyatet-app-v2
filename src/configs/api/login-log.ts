import useAxios from "@/hooks/useAxios";

function useLoginLog() {
  const { axiosRaw, axiosFetch } = useAxios();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "https://be-nyatet.orzverse.com/api";

  const tokenInfo = () => axiosFetch("get", `${baseURL}/token/info`);
  const getLoginLog = () => axiosRaw("get", `${baseURL}/token/login-log`);
  const logoutToken = (tokenName: string) => axiosFetch("delete", `${baseURL}/token/logout/${tokenName}`);

  return {
    tokenInfo,
    getLoginLog,
    logoutToken,
  };
}

export default useLoginLog;
