import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ErrorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="w-full bg-gray-950 text-gray-50 text-center">
      <div className="container min-h-svh w-full flex flex-col justify-center items-center gap-y-5">
        <Link href={"/"}>
          <Image
            src="https://cdn.jsdelivr.net/gh/orz14/nyatet-app-v2@main/public/assets/logo/logo.webp"
            alt={process.env.NEXT_PUBLIC_APP_NAME || "Nyatet App"}
            width={476}
            height={140}
            className="w-full min-w-[90px] max-w-[90px] min-[448px]:max-w-[120px] h-auto"
            priority={true}
          />
        </Link>

        {children}

        <Button type="button" variant="outline" onClick={() => router.push("/")}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>

          <span>Kembali</span>
        </Button>
      </div>
    </div>
  );
}
