import AuthLayout from "@/components/layouts/AuthLayout";
import MetaTag from "@/components/MetaTag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <>
      <MetaTag title={"Register"} />

      <AuthLayout>
        <section className="bg-gray-950 border border-gray-900 rounded-lg p-4 min-[448px]:p-6">
          <form className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name" className="text-[11px] font-normal md:font-medium">
                Nama
              </Label>
              <Input type="text" id="name" placeholder="Masukkan Nama" />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="username" className="text-[11px] font-normal md:font-medium">
                Username
              </Label>
              <Input type="text" id="username" placeholder="Masukkan Username" />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email" className="text-[11px] font-normal md:font-medium">
                Email
              </Label>
              <Input type="email" id="email" placeholder="Masukkan Email" />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password" className="text-[11px] font-normal md:font-medium">
                Password
              </Label>
              <Input type="password" id="password" placeholder="Masukkan Password" />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password_confirmation" className="text-[11px] font-normal md:font-medium">
                Konfirmasi Password
              </Label>
              <Input type="password" id="password_confirmation" placeholder="Konfirmasi Password" />
            </div>

            <div>
              <Button type="submit" className="w-full text-[12px] bg-indigo-600 text-white hover:bg-indigo-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                </svg>
                <span>Daftar</span>
              </Button>
            </div>
          </form>
        </section>
      </AuthLayout>
    </>
  );
}
