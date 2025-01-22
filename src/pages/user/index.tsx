import Layout from "@/components/layouts/dashboard/layout";
import MetaTag from "@/components/MetaTag";
import AdminCheck from "@/hoc/AdminCheck";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EachUtils from "@/utils/EachUtils";
import { useEffect, useState } from "react";
import useUser from "@/configs/api/user";
import Header from "@/components/dashboard/Header";
import Pagination from "@/components/dashboard/Pagination";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function UserIndexPage() {
  const title = "User Management";
  const breadcrumb = [
    {
      isLink: false,
      url: null,
      label: title,
    },
  ];

  const { getAllUser } = useUser();
  const [users, setUsers] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchAllUser(url?: string) {
    setLoading(true);
    try {
      const res = await getAllUser(url);
      if (res.status === 200) {
        setUsers(res.data);
      }
    } catch (err) {
      console.log("🚀 ~ fetchAllUser ~ err:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllUser();
  }, []);

  function Loader() {
    return Array.from({ length: 3 }).map((_, index) => (
      <TableRow key={index}>
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

  function getRole(role: string) {
    return role
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <>
      <MetaTag title={title} />

      <Layout>
        <div className="space-y-4">
          <Header
            title={title}
            breadcrumb={breadcrumb}
            Icon={() => (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            )}
          />

          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="h-auto p-2" onClick={() => fetchAllUser()} disabled={loading}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <EachUtils
                  of={users?.users}
                  isLoading={loading}
                  Loader={Loader}
                  render={(item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.username}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{getRole(item.role.role)}</TableCell>
                    </TableRow>
                  )}
                  Empty={() => (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No data available in table
                      </TableCell>
                    </TableRow>
                  )}
                />
              </TableBody>
            </Table>
          </div>

          <Pagination actionFunction={fetchAllUser} prevUrl={users?.pagination.prev_page_url} nextUrl={users?.pagination.next_page_url} loading={loading} />
        </div>
      </Layout>
    </>
  );
}

export default AdminCheck(UserIndexPage);
