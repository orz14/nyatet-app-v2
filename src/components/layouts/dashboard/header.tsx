import Image from "next/image";
import { Github, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/configs/api/auth";
import MainLoader from "@/components/loader/MainLoader";
import { useState } from "react";
import useLogout from "@/hooks/useLogout";

export default function Header() {
  const { user } = useAppContext();
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
          <Image
            src="https://cdn.jsdelivr.net/gh/orz14/nyatet-app-v2@main/public/logo.webp"
            alt={process.env.NEXT_PUBLIC_APP_NAME || "Nyatet App"}
            width={476}
            height={140}
            className="w-full max-w-[90px] min-[448px]:max-w-[120px] h-auto"
            priority={true}
          />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-12 border-gray-900">
              {user?.avatar != null ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user?.avatar} alt={user?.name} className="size-7 rounded-full bg-indigo-950 object-cover" />
              ) : (
                <div className="flex justify-center items-center text-[14px] leading-[0] size-7 rounded-full bg-indigo-950 overflow-hidden">
                  <span>{user?.name[0]}</span>
                </div>
              )}
              <span className="max-w-[230px] truncate">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profil")}>
                <User />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => window.open("https://github.com/orz14/nyatet-app", "_blank")}>
                <Github />
                <span>Source Code</span>
              </DropdownMenuItem>
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
