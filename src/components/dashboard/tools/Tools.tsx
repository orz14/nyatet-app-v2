import { Button } from "@/components/ui/button";
import useTools from "@/configs/api/tools";
import { useToast } from "@/hooks/use-toast";
import useLogout from "@/hooks/useLogout";
import { writeLogClient } from "@/lib/logClient";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function Tools({ action }: { action: string }) {
  const { databaseBackup, optimizeClear, clearExpiredToken, clearToken, clearPasswordToken } = useTools();
  const { toast } = useToast();
  const { logoutAuth } = useLogout();
  const [loading, setLoading] = useState<boolean>(false);

  async function handleBackupDownload() {
    setLoading(true);
    try {
      const res = await databaseBackup();
      const url = window.URL.createObjectURL(new Blob([res.data]));

      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = String(now.getFullYear()).slice(-2);
      const fileName = `orz-db-backup-${day}${month}${year}.sql`;

      toast({
        variant: "default",
        description: "Backup database sedang diunduh...",
      });

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err.status === 401) {
        await logoutAuth(true);
      } else if (err.status === 404 || err.status === 500) {
        toast({
          variant: "destructive",
          description: err.response.data.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: err.message,
        });
        await writeLogClient("error", err);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleTools() {
    setLoading(true);
    try {
      let res: any = null;
      if (action == "clear-optimize") {
        res = await optimizeClear();
      } else if (action == "clear-expired-token") {
        res = await clearExpiredToken();
      } else if (action == "clear-token") {
        res = await clearToken();
      } else if (action == "clear-password-token") {
        res = await clearPasswordToken();
      }

      if (res?.status === 200) {
        toast({
          variant: "default",
          description: res?.data.message,
        });
      }
    } catch (err) {
      if (err.status === 401) {
        await logoutAuth(true);
      } else if (err.status === 500) {
        toast({
          variant: "destructive",
          description: err.response.data.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: err.message,
        });
        await writeLogClient("error", err);
      }
    } finally {
      setLoading(false);
    }
  }

  function Component({ title }: { title: string }) {
    return (
      <div className="w-fit min-[380px]:w-full flex flex-row justify-between items-center gap-x-6 hover:bg-indigo-950/20 pl-4 pr-2 py-2 rounded-lg transition-colors duration-200">
        <div className="min-w-[150px] truncate">{title}</div>
        <div>
          <Button type="button" variant="outline" onClick={action == "backup-database" ? handleBackupDownload : handleTools} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
                <span>Run</span>
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (action == "backup-database") return <Component title="Backup Database" />;
  if (action == "clear-optimize") return <Component title="Clear Optimize" />;
  if (action == "clear-expired-token") return <Component title="Clear Expired Token" />;
  if (action == "clear-token") return <Component title="Clear Token" />;
  if (action == "clear-password-token") return <Component title="Clear Password Token" />;

  return null;
}
