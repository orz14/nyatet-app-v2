import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";

export default function UbahPassword() {
  const { loadingContext } = useAppContext();

  return (
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
  );
}
