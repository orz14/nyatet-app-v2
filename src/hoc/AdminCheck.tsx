import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminCheck(WrappedComponent: any) {
  return (props: any) => {
    const router = useRouter();
    const { loadingContext, user } = useAppContext();
    const roleId = user?.roleId ?? null;
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      setLoading(true);
      if (!loadingContext) {
        if (roleId != 1) {
          router.replace("/forbidden");
        }
        setLoading(false);
      }
    }, [loadingContext]);

    return <WrappedComponent authLoading={loading} {...props} />;
  };
}
