import MetaTag from "./MetaTag";

export default function Offline({ message }: { message?: string }) {
  return (
    <>
      <MetaTag title={"Offline"} />

      <div className="fixed top-0 bottom-0 left-0 right-0 w-full min-h-screen flex items-center justify-center bg-gray-950/90 text-gray-50 z-[9999]">
        <span className="font-semibold" style={{ textShadow: "0px 0px 10px #4f46e5" }}>
          {message ?? "Offline"}
        </span>
      </div>
    </>
  );
}
