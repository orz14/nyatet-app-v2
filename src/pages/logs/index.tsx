import Header from "@/components/dashboard/Header";
import Layout from "@/components/layouts/dashboard/layout";
import MetaTag from "@/components/MetaTag";
import AdminCheck from "@/hoc/AdminCheck";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { capitalize, timeFormat } from "@/utils/formatters";
import { useToast } from "@/hooks/use-toast";
import useLog from "@/configs/api/log";
import useLogout from "@/hooks/useLogout";
import { useEffect, useState } from "react";
import EachUtils from "@/utils/EachUtils";
import RefreshDataButton from "@/components/dashboard/RefreshDataButton";
import TextSkeleton from "@/components/skeleton/TextSkeleton";
import Pagination from "@/components/dashboard/Pagination";
import AuthorizationCheckLoader from "@/components/loader/AuthorizationCheckLoader";

function LogsIndexPage({ authLoading }: any) {
  const title = "Logs";
  const breadcrumb = [
    {
      isLink: false,
      url: null,
      label: title,
    },
  ];

  const { toast } = useToast();
  const { getLog } = useLog();
  const { logoutAuth } = useLogout();
  const [logs, setLogs] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchLogs(url?: string) {
    setLoading(true);
    try {
      const res = await getLog(url);
      if (res?.status === 200) {
        setLogs(res?.data);
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
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  function Loader() {
    return Array.from({ length: 3 }).map((_, index) => (
      <div key={`loader-logs-${index}`} className="bg-indigo-950/20 p-4 rounded-lg">
        <div className="w-full flex items-center gap-x-4">
          <TextSkeleton width="w-14" />
          <TextSkeleton width="w-44" />
          <TextSkeleton width="w-24" />
          <TextSkeleton width="w-full max-w-[400px]" />
        </div>
      </div>
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
                <Accordion type="single" collapsible className="w-full space-y-2">
                  <EachUtils
                    of={logs?.logs}
                    isLoading={loading}
                    Loader={Loader}
                    render={(item: any, index: number) => (
                      <AccordionItem key={`logs-${index}`} value={`item-${index + 1}`} className="border-none bg-indigo-950/20 hover:bg-indigo-950/10 px-4 rounded-lg transition-colors duration-200">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="w-full flex items-center gap-x-4">
                            <div className={`w-14 text-left truncate flex items-center gap-x-1 ${item.level == "INFO" ? "text-sky-600" : "text-red-600"}`}>
                              {item.level == "INFO" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                  <path
                                    fillRule="evenodd"
                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                  <path
                                    fillRule="evenodd"
                                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                              <span>{capitalize(item.level)}</span>
                            </div>
                            <div className="w-44 text-left truncate">{timeFormat(item.timestamp)}</div>
                            <div className="w-24 text-left truncate">{item.environment}</div>
                            <div className="w-full max-w-[400px] text-left truncate">{item.message}</div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>{item.message}</AccordionContent>
                      </AccordionItem>
                    )}
                    Empty={() => (
                      <div className="w-full bg-indigo-950/20 text-center p-4 rounded-lg">
                        <span>No data available</span>
                      </div>
                    )}
                  />
                </Accordion>
              </div>

              <Pagination actionFunction={fetchLogs} prevUrl={logs?.pagination.prev_page_url} nextUrl={logs?.pagination.next_page_url} loading={loading} />
            </>
          )}
        </div>
      </Layout>
    </>
  );
}

export default AdminCheck(LogsIndexPage);
