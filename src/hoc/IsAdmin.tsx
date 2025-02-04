import { useAppContext } from "@/contexts/AppContext";

export default function IsAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAppContext();
  const roleId = user?.roleId ?? null;

  if (roleId != 1) return null;

  return <>{children}</>;
}
