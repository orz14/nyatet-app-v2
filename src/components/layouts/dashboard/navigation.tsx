import IsAdmin from "@/hoc/IsAdmin";
import EachUtils from "@/utils/EachUtils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type MenuItemProps = {
  href: string;
  label: string;
};

export default function Navigation() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [router]);

  const mainMenu = [
    {
      href: "/todo",
      label: "Todo",
    },
    {
      href: "/note",
      label: "Note",
    },
  ];

  const adminMenu = [
    {
      href: "/tools",
      label: "Tools",
    },
    {
      href: "/role",
      label: "Role Management",
    },
    {
      href: "/user",
      label: "User Management",
    },
    {
      href: "/backend-logs",
      label: "Backend Logs",
    },
    {
      href: "/frontend-logs",
      label: "Frontend Logs",
    },
  ];

  return (
    <>
      <nav className="block xl:hidden sticky top-0 left-0 w-full bg-gray-950 rounded-b-lg z-40">
        <section className="relative bg-gray-950 rounded-b-lg pt-4 z-30">
          <div className="bg-gray-950 border border-gray-900 rounded-lg p-4 cursor-pointer select-none" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="flex justify-between items-center gap-x-2">
              <span>Menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
              </svg>
            </div>
          </div>
        </section>

        <section
          className={`absolute w-full backdrop-blur-sm bg-gray-950/80 border-l border-r border-b border-gray-900 rounded-lg pt-7 pb-4 px-4 ${
            menuOpen ? "-mt-3" : "-mt-[100svh]"
          } space-y-4 overflow-hidden transition-all duration-200 ease-in-out z-20`}
        >
          <div>
            <div className="text-[9px] text-indigo-400">Main Menu</div>
            <div className="mt-2">
              <EachUtils
                of={mainMenu}
                render={(item: MenuItemProps, index: number) => (
                  <Link key={`mobileMainMenu-${index}`} href={item.href} className={`mobile-sidebar-menu ${router.pathname == item.href && "active"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                      <path
                        fillRule="evenodd"
                        d="M15.28 9.47a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L13.69 10 9.97 6.28a.75.75 0 0 1 1.06-1.06l4.25 4.25ZM6.03 5.22l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L8.69 10 4.97 6.28a.75.75 0 0 1 1.06-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{item.label}</span>
                  </Link>
                )}
              />
            </div>
          </div>

          <IsAdmin>
            <div>
              <div className="text-[9px] text-indigo-400">Admin Menu</div>
              <div className="mt-2">
                <EachUtils
                  of={adminMenu}
                  render={(item: MenuItemProps, index: number) => (
                    <Link key={`mobileAdminMenu-${index}`} href={item.href} className={`mobile-sidebar-menu ${router.pathname == item.href && "active"}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                        <path
                          fillRule="evenodd"
                          d="M15.28 9.47a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L13.69 10 9.97 6.28a.75.75 0 0 1 1.06-1.06l4.25 4.25ZM6.03 5.22l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L8.69 10 4.97 6.28a.75.75 0 0 1 1.06-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{item.label}</span>
                    </Link>
                  )}
                />
              </div>
            </div>
          </IsAdmin>
        </section>
      </nav>

      <aside className="hidden xl:block xl:sticky xl:top-4 xl:left-0 w-[300px] h-max bg-gray-950 border border-gray-900 rounded-lg p-6 z-40">
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
      </aside>
    </>
  );
}
