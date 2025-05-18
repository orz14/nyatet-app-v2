import useAxios from "@/hooks/useAxios";

function useTools() {
  const { axiosFetch } = useAxios();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "https://be-nyatet.orzverse.com/api";

  const databaseBackup = () => axiosFetch("post", `${baseURL}/database-backup`, {}, { responseType: "blob" });
  const optimizeClear = () => axiosFetch("post", `${baseURL}/optimize-clear`);
  const clearExpiredToken = () => axiosFetch("delete", `${baseURL}/token/expired/clear`);
  const clearToken = () => axiosFetch("delete", `${baseURL}/token/clear`);
  const clearPasswordToken = () => axiosFetch("delete", `${baseURL}/token/password/clear`);

  return {
    databaseBackup,
    optimizeClear,
    clearExpiredToken,
    clearToken,
    clearPasswordToken,
  };
}

export default useTools;
