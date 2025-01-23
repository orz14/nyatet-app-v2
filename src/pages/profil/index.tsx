import Header from "@/components/dashboard/Header";
import RiwayatLogin from "@/components/dashboard/profil/RiwayatLogin";
import Layout from "@/components/layouts/dashboard/layout";
import MetaTag from "@/components/MetaTag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";

export default function ProfilPage() {
  const title = "Profil";
  const breadcrumb = [
    {
      isLink: false,
      url: null,
      label: title,
    },
  ];

  const { loadingContext, user } = useAppContext();

  return (
    <>
      <MetaTag title={title} />

      <Layout>
        <div className="space-y-4">
          <Header
            title={title}
            breadcrumb={breadcrumb}
            Icon={() => (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4 space-y-4">
              <div className="w-full bg-gray-950 border border-indigo-900/60 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                    />
                  </svg>
                  <span>Informasi Profil</span>
                </div>
              </div>

              <form className="w-full space-y-4" autoComplete="off">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="name" className="text-[11px] font-normal md:font-medium">
                    Nama
                  </Label>
                  <Input type="text" id="name" name="name" className="border-gray-900" value={loadingContext ? "Loading ..." : user?.name} placeholder="Masukkan Nama" disabled={loadingContext} />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="username" className="text-[11px] font-normal md:font-medium">
                    Username
                  </Label>
                  <Input type="text" id="username" name="username" className="border-gray-900" value={loadingContext ? "Loading ..." : user?.username} placeholder="Masukkan Username" disabled={true} />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email" className="text-[11px] font-normal md:font-medium">
                    Email
                  </Label>
                  <Input type="email" id="email" name="email" className="border-gray-900" value={loadingContext ? "Loading ..." : user?.email} placeholder="Masukkan Email" disabled={loadingContext} />
                </div>

                <div>
                  <Button type="submit" variant={"outline"} className="hover:bg-indigo-950/50" disabled={loadingContext}>
                    Simpan Profil
                  </Button>
                </div>
              </form>
            </div>

            <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4 space-y-4">
              <div className="w-full bg-gray-950 border border-indigo-900/60 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                    />
                  </svg>
                  <span>Ubah Password</span>
                </div>
              </div>

              <form className="w-full space-y-4" autoComplete="off">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="current_password" className="text-[11px] font-normal md:font-medium">
                    Password Saat Ini
                  </Label>
                  <Input type="password" id="current_password" name="current_password" className="border-gray-900" placeholder="Masukkan Password Saat Ini" disabled={loadingContext} />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="password" className="text-[11px] font-normal md:font-medium">
                    Password Baru
                  </Label>
                  <Input type="password" id="password" name="password" className="border-gray-900" placeholder="Masukkan Password Baru" disabled={loadingContext} />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="password_confirmation" className="text-[11px] font-normal md:font-medium">
                    Konfirmasi Password Baru
                  </Label>
                  <Input type="password" id="password_confirmation" name="password_confirmation" className="border-gray-900" placeholder="Konfirmasi Password Baru" disabled={loadingContext} />
                </div>

                <div>
                  <Button type="submit" variant={"outline"} className="hover:bg-indigo-950/50" disabled={loadingContext}>
                    Simpan Password
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <RiwayatLogin />

          <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4 space-y-4">
            <div className="w-full bg-gray-950 border border-indigo-900/60 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
                <span>Hapus Akun</span>
              </div>
            </div>

            <div>Setelah akun Anda dihapus, semua data akan dihapus secara permanen.</div>

            <div>
              <Button type="submit" variant={"outline"} className="border-red-950/70 bg-red-950/50 hover:bg-red-950/70" disabled={loadingContext}>
                Hapus Akun
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
