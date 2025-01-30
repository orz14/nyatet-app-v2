import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-gray-950 text-gray-50 text-sm">
      <div className="container min-h-svh flex flex-col justify-between">
        <div>
          <Header />
          <main className="relative h-full flex gap-x-4">
            <Sidebar />
            <section className="relative w-full h-max bg-gray-950 border border-gray-900 rounded-lg p-4">{children}</section>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
