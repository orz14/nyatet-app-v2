import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";

export default function InformasiProfil() {
  const { loadingContext, user } = useAppContext();

  return (
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
  );
}
