import Header from "@/components/dashboard/Header";
import RefreshDataButton from "@/components/dashboard/RefreshDataButton";
import Layout from "@/components/layouts/dashboard/layout";
import MetaTag from "@/components/MetaTag";
import TextSkeleton from "@/components/skeleton/TextSkeleton";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useRole from "@/configs/api/role";
import AdminCheck from "@/hoc/AdminCheck";
import { useToast } from "@/hooks/use-toast";
import useLogout from "@/hooks/useLogout";
import EachUtils from "@/utils/EachUtils";
import { roleNameFormat } from "@/utils/formatters";
import { useEffect, useState } from "react";
import AddRole from "@/components/dashboard/role/AddRole";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DeleteRole from "@/components/dashboard/role/DeleteRole";
import EditRole from "@/components/dashboard/role/EditRole";
import AuthorizationCheckLoader from "@/components/loader/AuthorizationCheckLoader";

function RoleIndexPage({ authLoading }: any) {
  const title = "Role Management";
  const breadcrumb = [
    {
      isLink: false,
      url: null,
      label: title,
    },
  ];

  const { getAllRole } = useRole();
  const { logoutAuth } = useLogout();
  const { toast } = useToast();
  const [roles, setRoles] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openedDialog, setOpenedDialog] = useState<"delete" | "edit">();

  async function fetchAllRole() {
    setLoading(true);
    try {
      const res = await getAllRole();
      if (res?.status === 200) {
        setRoles(res?.data);
      }
    } catch (err) {
      if (err.status === 401) {
        await logoutAuth(true);
      } else {
        toast({
          variant: "destructive",
          description: err.message,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllRole();
  }, []);

  function Loader() {
    return Array.from({ length: 3 }).map((_, index) => (
      <TableRow key={`loader-role-${index}`}>
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
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>
            )}
          />

          {authLoading ? (
            <AuthorizationCheckLoader />
          ) : (
            <>
              <div className="flex items-center gap-x-2">
                <RefreshDataButton actionFunction={fetchAllRole} loading={loading} />
                <AddRole fetchFunction={fetchAllRole} />
              </div>

              <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Related Users</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <EachUtils
                      of={roles?.roles}
                      isLoading={loading}
                      Loader={Loader}
                      render={(item: any, index: number) => (
                        <TableRow key={`role-${index}`}>
                          <TableCell className="text-center">{index + 1}</TableCell>
                          <TableCell>{roleNameFormat(item.role)}</TableCell>
                          <TableCell>{item.users_count} users</TableCell>
                          <TableCell className="text-center">
                            <Dialog>
                              <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                  <Button variant={"outline"} size={"icon"} className="bg-indigo-950/40 border-indigo-950/90">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                    </svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <DialogTrigger
                                      className="w-full flex items-center gap-x-2"
                                      onClick={() => {
                                        setOpenedDialog("edit");
                                      }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                        />
                                      </svg>
                                      <span>Edit</span>
                                    </DialogTrigger>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer hover:!bg-red-950/50">
                                    <DialogTrigger
                                      className="w-full flex items-center gap-x-2"
                                      onClick={() => {
                                        setOpenedDialog("delete");
                                      }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                        />
                                      </svg>
                                      <span>Delete</span>
                                    </DialogTrigger>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <DialogContent className="sm:max-w-[500px]">
                                {openedDialog == "delete" ? (
                                  <DeleteRole id={item.id} fetchFunction={fetchAllRole} />
                                ) : (
                                  <EditRole
                                    data={{
                                      id: item.id,
                                      role: roleNameFormat(item.role),
                                    }}
                                    fetchFunction={fetchAllRole}
                                  />
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
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
            </>
          )}
        </div>
      </Layout>
    </>
  );
}

export default AdminCheck(RoleIndexPage);
