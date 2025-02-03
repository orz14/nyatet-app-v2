import Header from "./header";
import Navigation from "./navigation";
import Footer from "./footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-gray-950 text-gray-50 text-xs sm:text-sm">
      <div className="container min-h-svh flex flex-col justify-between">
        <div>
          <Header />
          <main className="relative flex flex-col xl:flex-row gap-4">
            <Navigation />
            <section className="relative w-full h-max bg-gray-950 border border-gray-900 rounded-lg p-4 z-10">{children}</section>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
