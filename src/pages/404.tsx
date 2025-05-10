import ErrorLayout from "@/components/layouts/error/layout";
import MetaTag from "@/components/MetaTag";

export default function NotFoundPage() {
  return (
    <>
      <MetaTag title={"Halaman Tidak Ditemukan"} />

      <ErrorLayout>
        <div>404 Not Found</div>
        <div className="text-xs text-gray-500">Halaman ini tidak ada, mungkin telah dihapus atau Anda tidak diizinkan mengaksesnya.</div>
      </ErrorLayout>
    </>
  );
}
