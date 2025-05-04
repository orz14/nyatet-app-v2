import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import useAuth from "@/configs/api/auth";
import { useAppContext } from "@/contexts/AppContext";
import IsAdmin from "@/hoc/IsAdmin";
import { useToast } from "@/hooks/use-toast";
import { writeLogClient } from "@/lib/logClient";
import { useRouter } from "next/router";
import { useState } from "react";

export default function TestingPage() {
  const { loadingContext, user, logout: logoutAuth } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  const { logout: logoutUser } = useAuth();
  const [loading, setLoading] = useState(false);

  async function logout(notification = false) {
    await logoutAuth();

    if (notification) {
      toast({
        variant: "destructive",
        description: "Token not valid.",
      });
    }

    router.push("/auth/login");
  }

  async function handleLogout() {
    setLoading(true);

    try {
      const res = await logoutUser();
      if (res.status === 200) {
        await logout(false);
      }
    } catch (err) {
      if (err.status === 401) {
        await logout(true);
      } else {
        toast({
          variant: "destructive",
          description: err.message,
        });
        await writeLogClient("error", err.message);
      }
      setLoading(false);
    }
  }

  return (
    <>
      <div className="w-full min-h-svh flex flex-col items-center justify-center">
        <span>Testing Page</span>
        {loadingContext ? (
          <span>Loading ...</span>
        ) : (
          <>
            <span>Name : {user?.name ?? "null"}</span>

            <IsAdmin>
              <span>IS ADMIN</span>
            </IsAdmin>

            <Button onClick={handleLogout} disabled={loading}>
              {loading ? "Loading" : "Logout"}
            </Button>
          </>
        )}
      </div>
      <Toaster />
    </>
  );
}
