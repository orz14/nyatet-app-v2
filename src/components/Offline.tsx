import MetaTag from "./MetaTag";

export default function Offline() {
  return (
    <>
      <MetaTag title={"Offline"} />

      <div className="w-full min-h-screen flex items-center justify-center">
        <span>Server Offline</span>
      </div>
    </>
  );
}
