import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/router";
import { useToast } from "./use-toast";

export default function useLogout() {
  const { logout } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();

  async function logoutAuth(notification: boolean = false) {
    await logout();

    if (notification) {
      toast({
        variant: "destructive",
        description: "Token not valid.",
      });
    }

    router.push("/auth/login");
  }

  return { logoutAuth };
}
