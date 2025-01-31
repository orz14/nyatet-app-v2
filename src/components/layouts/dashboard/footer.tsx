import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full my-4 bg-gray-950 border border-gray-900 rounded-lg tracking-widest text-xs text-center select-none p-5">
      <span className="inline max-[475px]:block">
        &copy; {new Date().getFullYear()}{" "}
        <Link href={"/"} className="font-bold hover:underline">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>
      </span>
      <span className="max-[475px]:hidden"> &#183; </span>
      <span className="inline max-[475px]:block">
        Created with 💜 by{" "}
        <Link href={process.env.NEXT_PUBLIC_AUTHOR_URL || "#"} className="font-bold hover:underline" target="_blank">
          {process.env.NEXT_PUBLIC_AUTHOR_NAME}
        </Link>
      </span>
    </footer>
  );
}
