import MetaTag from "@/components/MetaTag";
import useAuth from "@/configs/api/auth";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { writeLogClient } from "@/lib/logClient";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthorizationCallbackPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser, setFingerprint } = useAuth();
  const { login } = useAppContext();

  async function handleCatch(err: any) {
    if (err.status !== 401) {
      toast({
        variant: "destructive",
        description: err.message,
      });

      await writeLogClient("error", err);

      router.push("/auth/login");
    }
  }

  async function handleLogin(token: string) {
    try {
      const resFingerprint = await setFingerprint(token);
      if (resFingerprint?.status === 200) {
        try {
          const resUser = await currentUser(token);
          if (resUser?.status === 200) {
            const credentials = {
              data: {
                token,
                data: resUser?.data.data,
              },
            };

            await login(credentials);
            router.push("/todo");
          }
        } catch (err) {
          handleCatch(err);
        }
      }
    } catch (err) {
      handleCatch(err);
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
