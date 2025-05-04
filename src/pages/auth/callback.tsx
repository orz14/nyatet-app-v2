import MetaTag from "@/components/MetaTag";
import useAuth from "@/configs/api/auth";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import useLogout from "@/hooks/useLogout";
import { writeLogClient } from "@/lib/logClient";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthorizationCallbackPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { login } = useAppContext();
  const { logoutAuth } = useLogout();

  async function handleLogin(token: string) {
    try {
      const res = await currentUser(token);
      if (res?.status === 200) {
        const credentials = {
          data: {
            token,
            data: res?.data.data,
          },
        };

        await login(credentials);
        router.push("/todo");
      }
    } catch (err) {
      if (err.status === 401) {
        await logoutAuth(true);
      } else {
        toast({
          variant: "destructive",
          description: err.message,
        });

        await writeLogClient("error", err.message);

        router.push("/auth/login");
      }
    }
  }

  useEffect(() => {
    const { token, status } = router.query;

    if (status && status == "failed") {
      toast({
        variant: "destructive",
        description: "Login failed.",
      });

      router.push("/auth/login");
    }

    if (token) {
      handleLogin(token as string);
    }
  }, [router.query]);

  return (
    <>
      <MetaTag title={"Authorization"} />

      <div className="fixed top-0 bottom-0 left-0 right-0 w-full min-h-svh bg-gray-950 text-gray-50">
        <div className="flex justify-center items-center w-full min-h-svh">
          <Loader2 className="animate-spin w-4 h-4 mr-2" />
          <span>Authorization</span>
        </div>
      </div>
    </>
  );
}
