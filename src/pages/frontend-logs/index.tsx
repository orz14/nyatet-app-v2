import Header from "@/components/dashboard/Header";
import RefreshDataButton from "@/components/dashboard/RefreshDataButton";
import Layout from "@/components/layouts/dashboard/layout";
import AuthorizationCheckLoader from "@/components/loader/AuthorizationCheckLoader";
import MetaTag from "@/components/MetaTag";
import TextSkeleton from "@/components/skeleton/TextSkeleton";
import useLog from "@/configs/api/log";
import AdminCheck from "@/hoc/AdminCheck";
import { useToast } from "@/hooks/use-toast";
import useLogout from "@/hooks/useLogout";
import { writeLogClient } from "@/lib/logClient";
import { useEffect, useState } from "react";

function FrontendLogsPage({ authLoading }: any) {
  const title = "Frontend Logs";
  const breadcrumb = [
    {
      isLink: false,
      url: null,
      label: title,
    },
  ];

  const { toast } = useToast();
  const { getNextLog } = useLog();
  const { logoutAuth } = useLogout();
  const [logs, setLogs] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchLogs() {
    setLoading(true);
    setLogs(null);
    try {
      const res = await getNextLog();
      if (res?.status === 200) {
        setLogs(res.data);
      }
    } catch (err) {
      if (err.status === 401) {
        await logoutAuth(true);
      } else if (err.status === 404) {
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

  useEffect(() => {
    fetchLogs();
  }, []);

  function Loader() {
    return (
      <div className="flex flex-col gap-y-2">
        <TextSkeleton />
        <TextSkeleton />
        <TextSkeleton />
      </div>
    );
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
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            )}
          />

          {authLoading ? (
            <AuthorizationCheckLoader />
          ) : (
            <>
              <div>
                <RefreshDataButton actionFunction={fetchLogs} loading={loading} />
              </div>

              <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4">
                {loading ? (
                  <Loader />
                ) : logs?.logs?.length > 0 ? (
                  <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{JSON.stringify(logs.logs, null, 2)}</pre>
                ) : (
                  <div className="w-full bg-indigo-950/20 text-center p-4 rounded-lg">
                    <span>No data available</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Layout>
    </>
  );
}

export default AdminCheck(FrontendLogsPage);
