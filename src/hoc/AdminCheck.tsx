/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
import { useAppContext } from "@/contexts/AppContext";
import { decryptString } from "@/lib/crypto";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminCheck(WrappedComponent: any) {
  return (props: any) => {
    const router = useRouter();
    const { loadingContext, user } = useAppContext();
    const encryptedRoleId = user?.roleId ?? null;
    let roleId: number | null = null;
    if (encryptedRoleId) {
      roleId = Number(decryptString(encryptedRoleId));
    }
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
