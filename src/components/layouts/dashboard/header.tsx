import Image from "next/image";
import { Github, Loader2, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/configs/api/auth";
import MainLoader from "@/components/loader/MainLoader";
import { useState } from "react";
import IsAdmin from "@/hoc/IsAdmin";
import useLogout from "@/hooks/useLogout";

export default function Header() {
  const { loadingContext, user } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  const { logout: logoutUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const { logoutAuth } = useLogout();

  async function handleLogout() {
    setLoading(true);

    try {
      const res = await logoutUser();
      if (res.status === 200) {
        await logoutAuth();
      }
    } catch (err) {
      if (err.status === 401) {
        await logoutAuth(true);
      } else {
        toast({
          variant: "destructive",
          description: err.message,
        });
      }
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <MainLoader />}

      <header className="w-full my-6 flex justify-between items-center">
        <Link href={"/"}>
          <Image src="/logo.webp" alt="" width={500} height={500} className="w-full max-w-[90px] min-[448px]:max-w-[120px] h-auto" priority={true} />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger disabled={loadingContext} asChild>
            <Button variant="outline" className="h-12 border-gray-900">
              {loadingContext ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {user?.avatar != null ? (
                    <img src={user?.avatar} alt="avatar" className="size-7 rounded-full bg-indigo-950 object-cover" />
                  ) : (
                    <div className="flex justify-center items-center size-7 rounded-full bg-indigo-950">
                      <User />
                    </div>
                  )}
                  <span className="max-w-[230px] truncate">{user?.name}</span>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profil")}>
                <User />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => window.open("https://github.com/orz14/nyatet-app", "_blank")}>
                <Github />
                <span>Source Code</span>
              </DropdownMenuItem>
              <IsAdmin>
                <DropdownMenuItem className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>
                  <span>Log</span>
                </DropdownMenuItem>
              </IsAdmin>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:!bg-red-950/50" onClick={handleLogout}>
              <LogOut />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </>
  );
}
