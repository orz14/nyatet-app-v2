import AuthLayout from "@/components/layouts/AuthLayout";
import MetaTag from "@/components/MetaTag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <>
      <MetaTag title={"Lupa Password"} />

      <AuthLayout>
        <section className="bg-gray-950 border border-gray-900 rounded-lg p-4 min-[448px]:p-6">
          <form className="space-y-4">
            <div className="text-xs">Masukkan alamat email yang terkait dengan akun Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.</div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email" className="text-[11px] font-normal md:font-medium">
                Email
              </Label>
              <Input type="email" id="email" placeholder="Masukkan Email" />
            </div>

            <div className="flex flex-col-reverse min-[350px]:flex-row gap-4">
              <Button className="w-full text-[12px] bg-gray-800 text-white hover:bg-gray-900" asChild>
                <Link href={"/auth/login"}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                  <span>Kembali</span>
                </Link>
              </Button>

              <Button type="submit" className="w-full text-[12px] bg-indigo-600 text-white hover:bg-indigo-800">
                <span>Kirim Tautan</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </Button>
            </div>
          </form>
        </section>
      </AuthLayout>
    </>
  );
}
