import { useAppContext } from "@/contexts/AppContext";
import IsAdmin from "@/hoc/IsAdmin";
import EachUtils from "@/utils/EachUtils";
import Link from "next/link";
import { useRouter } from "next/router";

type MenuItemProps = {
  href: string;
  label: string;
};

export default function Sidebar() {
  const router = useRouter();
  const { loadingContext } = useAppContext();

  const mainMenu = [
    {
      href: "/todo",
      label: "Todo",
    },
    {
      href: "#",
      label: "Note",
    },
  ];

  const adminMenu = [
    {
      href: "#",
      label: "Role Management",
    },
    {
      href: "/user",
      label: "User Management",
    },
  ];

  return (
    <aside className="sticky top-4 left-0 w-[300px] h-max bg-gray-950 border border-gray-900 rounded-lg p-6">
      {loadingContext ? (
        <div className="space-y-2">
          <div className="w-2/3 h-4 bg-gray-700/30 rounded animate-pulse"></div>
          <div className="w-full h-4 bg-gray-700/30 rounded animate-pulse"></div>
          <div className="w-full h-4 bg-gray-700/30 rounded animate-pulse"></div>
        </div>
      ) : (
        <>
          <div>
            <div className="text-xs text-white flex gap-x-2 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              <span>Main Menu</span>
            </div>
            <div className="ml-[9px] mt-3">
              <EachUtils
                of={mainMenu}
                render={(item: MenuItemProps, index: number) => (
                  <Link key={`mainMenu-${index}`} href={item.href} className={`sidebar-menu ${router.pathname == item.href && "active"}`}>
                    {item.label}
                  </Link>
                )}
              />
            </div>
          </div>

          <IsAdmin>
            <div className="mt-6">
              <div className="text-xs text-white flex gap-x-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                  />
                </svg>
                <span>Admin Menu</span>
              </div>
              <div className="ml-[9px] mt-3">
                <EachUtils
                  of={adminMenu}
                  render={(item: MenuItemProps, index: number) => (
                    <Link key={`adminMenu-${index}`} href={item.href} className={`sidebar-menu ${router.pathname == item.href && "active"}`}>
                      {item.label}
                    </Link>
                  )}
                />
              </div>
            </div>
          </IsAdmin>
        </>
      )}
    </aside>
  );
}
