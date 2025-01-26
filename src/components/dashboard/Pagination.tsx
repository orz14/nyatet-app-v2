import { Button } from "../ui/button";

type PaginationType = {
  actionFunction: any;
  prevUrl: string;
  nextUrl: string;
  loading: boolean;
};

export default function Pagination({ actionFunction, prevUrl, nextUrl, loading }: PaginationType) {
  return (
    <div className="flex justify-between items-center gap-4">
      <Button variant="outline" onClick={() => actionFunction(prevUrl)} disabled={loading || !prevUrl}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
        </svg>
        <span>Previous</span>
      </Button>
      <Button variant="outline" onClick={() => actionFunction(nextUrl)} disabled={loading || !nextUrl}>
        <span>Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
        </svg>
      </Button>
    </div>
  );
}
