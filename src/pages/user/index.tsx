import Layout from "@/components/layouts/dashboard/layout";
import MetaTag from "@/components/MetaTag";
import AdminCheck from "@/hoc/AdminCheck";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EachUtils from "@/utils/EachUtils";
import { useEffect, useState } from "react";
import useUser from "@/configs/api/user";
import Header from "@/components/dashboard/Header";
import Pagination from "@/components/dashboard/Pagination";
import RefreshDataButton from "@/components/dashboard/RefreshDataButton";
import { roleNameFormat } from "@/hooks/useFormatter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import TextSkeleton from "@/components/skeleton/TextSkeleton";

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
          <TextSkeleton />
        </TableCell>
        <TableCell>
          <TextSkeleton />
        </TableCell>
        <TableCell>
          <TextSkeleton />
        </TableCell>
        <TableCell>
          <TextSkeleton />
        </TableCell>
        <TableCell>
          <TextSkeleton />
        </TableCell>
      </TableRow>
    ));
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
            <RefreshDataButton actionFunction={fetchAllUser} loading={loading} />
          </div>

          <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead></TableHead>
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
                      <TableCell>{roleNameFormat(item.role.role)}</TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant={"outline"} size={"icon"} className="bg-indigo-950/40 border-indigo-950/90">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )}
                  Empty={() => (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
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
