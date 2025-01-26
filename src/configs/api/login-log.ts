import useAxiosInterceptors from "@/lib/axios";

function useLoginLog() {
  const axiosInstance = useAxiosInterceptors();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "https://be-nyatet.orzverse.com/api";

  async function tokenInfo() {
    try {
      const res = await axiosInstance.get(`${baseURL}/token/info`);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function getLoginLog() {
    try {
      const res = await axiosInstance.get(`${baseURL}/token/login-log`);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function logoutToken(tokenName: string) {
    try {
      const res = await axiosInstance.delete(`${baseURL}/token/logout/${tokenName}`);
      return res;
    } catch (err) {
      throw err;
    }
  }

  return {
    tokenInfo,
    getLoginLog,
    logoutToken,
  };
}

export default useLoginLog;
