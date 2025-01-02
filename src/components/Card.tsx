export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-gray-950 bg-clip-border border border-gray-900 rounded-lg">
      <div className="flex-auto p-4 min-[448px]:p-6 text-gray-50 text-sm">{children}</div>
    </div>
  );
}
