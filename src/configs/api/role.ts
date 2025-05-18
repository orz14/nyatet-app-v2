import useAxios from "@/hooks/useAxios";

function useRole() {
  const { axiosFetch } = useAxios();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "https://be-nyatet.orzverse.com/api";

  const getAllRole = () => axiosFetch("get", `${baseURL}/role`);
  const store = (data: { role: string }) => axiosFetch("post", `${baseURL}/role`, data);
  const update = (id: string, data: { role: string }) => axiosFetch("patch", `${baseURL}/role/${id}`, data);
  const destroy = (id: string) => axiosFetch("delete", `${baseURL}/role/${id}`);

  return {
    getAllRole,
    store,
    update,
    destroy,
  };
}

export default useRole;
