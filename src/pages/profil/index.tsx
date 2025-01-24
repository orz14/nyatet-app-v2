import Header from "@/components/dashboard/Header";
import HapusAkun from "@/components/dashboard/profil/HapusAkun";
import InformasiProfil from "@/components/dashboard/profil/InformasiProfil";
import RiwayatLogin from "@/components/dashboard/profil/RiwayatLogin";
import UbahPassword from "@/components/dashboard/profil/UbahPassword";
import Layout from "@/components/layouts/dashboard/layout";
import MetaTag from "@/components/MetaTag";

export default function ProfilPage() {
  const title = "Profil";
  const breadcrumb = [
    {
      isLink: false,
      url: null,
      label: title,
    },
  ];

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
            <InformasiProfil />
            <UbahPassword />
          </div>
          <RiwayatLogin />
          <HapusAkun />
        </div>
      </Layout>
    </>
  );
}
