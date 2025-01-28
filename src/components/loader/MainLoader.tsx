import { Loader2 } from "lucide-react";

export default function MainLoader() {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 w-full min-h-svh bg-gray-950/90 text-gray-50 z-[999]">
      <div className="flex justify-center items-center w-full min-h-svh">
        <Loader2 className="animate-spin w-4 h-4 mr-2" />
        <span>Please wait</span>
      </div>
    </div>
  );
}
