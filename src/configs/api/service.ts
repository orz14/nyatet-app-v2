import useAxios from "@/hooks/useAxios";

function useService() {
  const { axiosBasic, axiosRaw } = useAxios();

  const getIp = () => axiosRaw("get", "/api/get-ip");
  const setToken = (token: string) => axiosRaw("post", "/api/set-token", { token });
  const getToken = () => axiosRaw("get", "/api/get-token");
  const removeToken = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    return axiosBasic("post", "/api/remove-token", {}, config);
  };

  return {
    getIp,
    setToken,
    getToken,
    removeToken,
  };
}

export default useService;
