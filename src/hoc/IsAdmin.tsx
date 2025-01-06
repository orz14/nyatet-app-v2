import { useAuthContext } from "@/contexts/AuthContext";

export default function IsAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const roleId = user?.roleId ?? null;

  if (roleId != 1) return null;

  return <>{children}</>;
}
