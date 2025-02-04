import { Button } from "@/components/ui/button";

export default function Tools({ action }: { action: string }) {
  function Component({ title }: { title: string }) {
    return (
      <div className="w-fit min-[430px]:w-full flex flex-row justify-between items-center gap-x-6 hover:bg-indigo-950/20 pl-4 pr-2 py-2 rounded-lg transition-colors duration-200">
        <div className="min-w-[200px] truncate">{title}</div>
        <div>
          <Button type="button" variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
            <span>Run</span>
          </Button>
        </div>
      </div>
    );
  }

  if (action == "backup-database") return <Component title="Backup Database" />;
  if (action == "clear-optimize") return <Component title="Clear Optimize" />;
  if (action == "clear-expired-token") return <Component title="Clear Expired Token" />;

  return null;
}
