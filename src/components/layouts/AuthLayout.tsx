import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Card from "../Card";
import { Loader2 } from "lucide-react";
import EachUtils from "@/utils/EachUtils";
import { useAppContext } from "@/contexts/AppContext";

type MenuItemProps = {
  href?: string;
  label?: string;
};

function MenuItem({ href, label }: MenuItemProps) {
  const router = useRouter();
  const isActive = router.pathname === href;
  const activeClass = isActive ? "bg-indigo-600 text-white" : "bg-gray-900 hover:bg-indigo-600/20";

  return (
    <Link href={href ?? "#"} className={`w-full px-4 py-2 text-center whitespace-nowrap rounded-md ${activeClass} transition-colors duration-200`}>
      {label ?? "Label"}
    </Link>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { loadingContext } = useAppContext();

  const menu = [
    {
      href: "/auth/login",
      label: "Login",
    },
    {
      href: "/auth/register",
      label: "Daftar",
    },
  ];

  return (
    <main className="w-full min-h-screen bg-gray-950 text-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md px-4 py-6 space-y-4">
        <header className="mb-10">
          <Image src="/logo.webp" alt="" width={500} height={500} className="w-full max-w-[140px] min-[448px]:max-w-[170px] h-auto mx-auto" priority={true} />
        </header>

        <nav className="bg-gray-900 rounded-lg p-2 text-[11px] font-normal min-[448px]:text-xs min-[448px]:font-medium flex justify-stretch gap-2 overflow-x-auto">
          <EachUtils of={menu} render={(item: MenuItemProps, index: number) => <MenuItem key={index} href={item.href} label={item.label} />} />
        </nav>

        {loadingContext ? (
          <Card>
            <div className="flex flex-row items-center justify-center text-xs">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span>Please wait</span>
            </div>
          </Card>
        ) : (
          children
        )}
      </div>
    </main>
  );
}
