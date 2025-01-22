import Layout from "@/components/layouts/dashboard/layout";
import MetaTag from "@/components/MetaTag";
import AdminCheck from "@/hoc/AdminCheck";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EachUtils from "@/utils/EachUtils";
import { useEffect, useState } from "react";
import useAxiosInterceptors from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CustomBreadcrumb from "@/components/CustomBreadcrumb";

function UserIndexPage() {
  const title = "User Management";
  const breadcrumb = [
    {
      isLink: false,
      url: null,
      label: title,
    },
  ];

  const axiosInstance = useAxiosInterceptors();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "https://nyatet.orzverse.com/api";
  const [items, setItems] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchData() {
    try {
      const res = await axiosInstance.get(`${baseURL}/user`);
      setItems(res.data);
    } catch (err) {
      console.log("🚀 ~ fetchData ~ err:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function Loader() {
    return Array.from({ length: 3 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell className="font-bold text-center">
          <span className="block h-4 bg-gray-700/30 rounded animate-pulse"></span>
        </TableCell>
        <TableCell>
          <span className="block h-4 bg-gray-700/30 rounded animate-pulse"></span>
        </TableCell>
        <TableCell>
          <span className="block h-4 bg-gray-700/30 rounded animate-pulse"></span>
        </TableCell>
        <TableCell>
          <span className="block h-4 bg-gray-700/30 rounded animate-pulse"></span>
        </TableCell>
        <TableCell>
          <span className="block h-4 bg-gray-700/30 rounded animate-pulse"></span>
        </TableCell>
      </TableRow>
    ));
  }

  return (
    <>
      <MetaTag title={title} />

      <Layout>
        <div className="space-y-4">
          <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center gap-4">
              <h1 className="text-xl font-bold tracking-wider first-letter:text-indigo-400">{title}</h1>
              <CustomBreadcrumb list={breadcrumb} />
            </div>
          </div>

          <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-center">#</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <EachUtils
                  of={items?.users}
                  isLoading={loading}
                  Loader={Loader}
                  render={(item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-bold text-center">{index + 1}</TableCell>
                      <TableCell>{item.username}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.role_id}</TableCell>
                    </TableRow>
                  )}
                />
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center gap-4">
            <Button variant="outline" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Previous"}
            </Button>
            <Button variant="outline" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Next"}
            </Button>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default AdminCheck(UserIndexPage);
