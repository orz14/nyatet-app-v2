import MetaTag from "@/components/MetaTag";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ForbiddenPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <MetaTag title={"Forbidden"} />

      <div className="fixed top-0 bottom-0 left-0 right-0 w-full min-h-svh bg-gray-950 text-gray-50 z-[999]">
        <div className="flex justify-center items-center w-full min-h-svh">
          <Loader2 className="animate-spin w-4 h-4 mr-2" />
          <span>Anda tidak memiliki akses, mengalihkan...</span>
        </div>
      </div>
    </>
  );
}
