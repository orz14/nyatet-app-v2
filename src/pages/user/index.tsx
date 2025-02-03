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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import TextSkeleton from "@/components/skeleton/TextSkeleton";
import useLogout from "@/hooks/useLogout";
import { roleNameFormat, timeFormat } from "@/utils/formatters";
import AuthorizationCheckLoader from "@/components/loader/AuthorizationCheckLoader";

function UserIndexPage({ authLoading }: any) {
  const title = "User Management";
  const breadcrumb = [
    {
      isLink: false,
      url: null,
      label: title,
    },
  ];

  const { getAllUser } = useUser();
  const { logoutAuth } = useLogout();
  const [users, setUsers] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchAllUser(url?: string) {
    setLoading(true);
    try {
      const res = await getAllUser(url);
      if (res?.status === 200) {
        setUsers(res?.data);
      }
    } catch (err) {
      if (err.status === 401) {
        await logoutAuth(true);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllUser();
  }, []);

  function Loader() {
    return Array.from({ length: 3 }).map((_, index) => (
      <TableRow key={`loader-user-${index}`}>
        <TableCell>
          <TextSkeleton />
          <TextSkeleton width="w-20" height="h-3" className="mt-1" />
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 sm:size-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
            )}
          />

          {authLoading ? (
            <AuthorizationCheckLoader />
          ) : (
            <>
              <div>
                <RefreshDataButton actionFunction={fetchAllUser} loading={loading} />
              </div>

              <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <EachUtils
                      of={users?.users}
                      isLoading={loading}
                      Loader={Loader}
                      render={(item: any, index: number) => (
                        <TableRow key={`user-${index}`}>
                          <TableCell className="max-w-[200px]">
                            <span className="block truncate">{item.name}</span>
                            <span className="block truncate text-[11px] text-muted-foreground font-bold">{item.username}</span>
                          </TableCell>
                          <TableCell className="max-w-[230px] truncate">{item.email}</TableCell>
                          <TableCell>{roleNameFormat(item.role.role)}</TableCell>
                          <TableCell className="max-w-44 truncate">{timeFormat(item.created_at, "d MMMM yyyy")}</TableCell>
                          <TableCell className="text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant={"ghost"} size={"icon"} className="[&_svg]:size-6 md:[&_svg]:size-7">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem className="cursor-pointer">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                    />
                                  </svg>
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer hover:!bg-red-950/50">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                  <span>Delete</span>
                                </DropdownMenuItem>
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
            </>
          )}
        </div>
      </Layout>
    </>
  );
}

export default AdminCheck(UserIndexPage);
