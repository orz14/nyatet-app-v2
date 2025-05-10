import ErrorLayout from "@/components/layouts/error/layout";
import MetaTag from "@/components/MetaTag";

export default function InternalServerErrorPage() {
  return (
    <>
      <MetaTag title={"Internal Server Error"} />

      <ErrorLayout>
        <div>500 Internal Server Error</div>
        <div className="text-xs text-gray-500">Terjadi kesalahan pada server, mohon coba beberapa saat lagi.</div>
      </ErrorLayout>
    </>
  );
}
