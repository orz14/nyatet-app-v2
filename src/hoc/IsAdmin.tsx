import { useAppContext } from "@/contexts/AppContext";
import { decryptString } from "@/lib/crypto";

export default function IsAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAppContext();
  const encryptedRoleId = user?.roleId ?? null;
  let roleId: number | null = null;
  if (encryptedRoleId) {
    roleId = Number(decryptString(encryptedRoleId));
  }

  if (roleId != 1) return null;

  return <>{children}</>;
}
