import { Loader2 } from "lucide-react";

export default function AuthorizationCheckLoader() {
  return (
    <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4">
      <div className="w-full flex flex-row justify-center items-center gap-x-2">
        <Loader2 className="animate-spin w-4 h-4" />
        <span>Authorization check</span>
      </div>
    </div>
  );
}
