import Header from "@/components/dashboard/Header";
import RefreshDataButton from "@/components/dashboard/RefreshDataButton";
import Layout from "@/components/layouts/dashboard/layout";
import AuthorizationCheckLoader from "@/components/loader/AuthorizationCheckLoader";
import MetaTag from "@/components/MetaTag";
import AdminCheck from "@/hoc/AdminCheck";
import { writeLogClient } from "@/lib/logClient";
import fs from "fs";
import { useRouter } from "next/router";
import path from "path";

function FrontendLogsPage({ authLoading, log }: any) {
  const title = "Frontend Logs";
  const breadcrumb = [
    {
      isLink: false,
      url: null,
      label: title,
    },
  ];

  const router = useRouter();

  function handleRefresh() {
    router.replace(router.pathname + "?refresh=" + Date.now());
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
                <RefreshDataButton actionFunction={handleRefresh} loading={false} />
              </div>

              <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4">
                {log.status === false ? (
                  <div className="w-full bg-indigo-950/20 text-center p-4 rounded-lg">
                    <span>No data available</span>
                  </div>
                ) : (
                  <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{JSON.stringify(log, null, 2)}</pre>
                )}
              </div>
            </>
          )}
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  const logPath = path.join(process.cwd(), "logs", "next-logs.json");
  try {
    const fileContents = fs.readFileSync(logPath, "utf-8");
    const json = JSON.parse(fileContents);

    return {
      props: {
        log: json,
      },
    };
  } catch (err) {
    await writeLogClient("error", err);
    return {
      props: {
        log: { status: false },
      },
    };
  }
}

export default AdminCheck(FrontendLogsPage);
