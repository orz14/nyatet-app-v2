import { useAuthContext } from "@/contexts/AuthContext";

export default function TestingPage() {
  const { user } = useAuthContext();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <span>Testing Page</span>
      <span>Name : {user?.name ?? "null"}</span>
    </div>
  );
}
