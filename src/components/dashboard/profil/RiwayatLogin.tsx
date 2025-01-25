import TextSkeleton from "@/components/skeleton/TextSkeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useLoginLog from "@/configs/api/login-log";
import { useToast } from "@/hooks/use-toast";
import useLogout from "@/hooks/useLogout";
import EachUtils from "@/utils/EachUtils";
import { timeFormat } from "@/utils/formatters";
import { LogOut } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ConfirmationDialog from "../ConfirmationDialog";

export default function RiwayatLogin() {
  const router = useRouter();
  const { toast } = useToast();
  const { tokenInfo, getLoginLog, logoutToken } = useLoginLog();
  const { logoutAuth } = useLogout();
  const [tokenName, setTokenName] = useState<any>(null);
  const [logs, setLogs] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingLogout, setLoadingLogout] = useState<boolean>(false);

  async function fetchTokenName() {
    try {
      const res = await tokenInfo();
      if (res?.status === 200) {
        setTokenName(res?.data.data.name);
      }
    } catch (err) {
      if (err.status === 401) {
        await logoutAuth(true);
      }
    }
  }

  async function fetchLoginLog() {
    setLoading(true);
    try {
      const res = await getLoginLog();
      if (res?.status === 200) {
        setLogs(res?.data.logs);
      }
    } catch (err) {
      console.log("🚀 ~ fetchLoginLog ~ err:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTokenName();
    fetchLoginLog();
  }, [router]);

  function Loader() {
    return Array.from({ length: 3 }).map((_, index) => (
      <TableRow key={`loader-login-log-${index}`}>
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

  async function handleLogoutToken(tokenName: string) {
    setLoadingLogout(true);
    try {
      const res = await logoutToken(tokenName);
      if (res?.status === 200) {
        toast({
          variant: "default",
          description: res?.data.message,
        });
        await fetchLoginLog();
      }
    } catch (err) {
      if (err.status === 401) {
        await logoutAuth(true);
      } else if (err.status === 404 || err.status === 403 || err.status === 500) {
        toast({
          variant: "destructive",
          description: err.response.data.message,
        });
        await fetchLoginLog();
      } else {
        toast({
          variant: "destructive",
          description: err.message,
        });
        await fetchLoginLog();
      }
    } finally {
      setLoadingLogout(false);
    }
  }

  return (
    <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4 space-y-4 hover:border-indigo-900/60 transition-colors duration-300">
      <div className="w-full bg-gray-950 border border-indigo-900/60 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
          </svg>
          <span>Riwayat Login</span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">IP Address</TableHead>
            <TableHead>User Agent</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead className="whitespace-nowrap">Terakhir Digunakan</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <EachUtils
            of={logs}
            isLoading={loading}
            Loader={Loader}
            render={(item: any, index: number) => (
              <TableRow key={`login-log-${index}`}>
                <TableCell className="whitespace-nowrap">{item.ip_address}</TableCell>
                <TableCell>{item.user_agent}</TableCell>
                <TableCell>{item.city ? item.city + ", " + item.region + ", " + item.country : "-"}</TableCell>
                <TableCell className="whitespace-nowrap">{item.token_name == tokenName ? <span className="text-green-600">Sesi Saat Ini</span> : item.token.last_used_at ? timeFormat(item.token.last_used_at) : "-"}</TableCell>
                <TableCell className="text-center">
                  {item.token_name != tokenName && (
                    <ConfirmationDialog
                      trigger={
                        <Button variant={"outline"} size={"sm"} className="border-red-950/70 bg-red-950/50 hover:bg-red-950/70" disabled={loadingLogout}>
                          <LogOut />
                          <span>Log out</span>
                        </Button>
                      }
                      title={"Apakah kamu yakin?"}
                      description={"Tindakan ini tidak dapat dibatalkan. Tindakan ini akan mengeluarkan akun yang berada di perangkat lain."}
                      actionFunction={() => handleLogoutToken(item.token_name)}
                    />
                  )}
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
  );
}
