import { Button } from "@/components/ui/button";
// import useProfile from "@/configs/api/profile";
// import useService from "@/configs/api/service";
// import { useAppContext } from "@/contexts/AppContext";
// import { useToast } from "@/hooks/use-toast";
// import useLogout from "@/hooks/useLogout";
// import { Loader2 } from "lucide-react";
// import { useRouter } from "next/router";
// import { useState } from "react";
// import ConfirmationDialog from "../ConfirmationDialog";

export default function HapusAkun() {
  // const { loadingContext } = useAppContext();
  // const { destroyUser } = useProfile();
  // const { logoutAuth } = useLogout();
  // const { toast } = useToast();
  // const { removeToken } = useService();
  // const router = useRouter();
  // const [loading, setLoading] = useState<boolean>(false);

  // async function handleDestroy() {
  //   setLoading(true);

  //   try {
  //     const res = await destroyUser();
  //     if (res?.status === 200) {
  //       toast({
  //         variant: "default",
  //         description: res?.data.message,
  //       });

  //       await removeToken();
  //       localStorage.removeItem("userIp");
  //       localStorage.removeItem("encryptedData");

  //       router.push("/auth/login");
  //     }
  //   } catch (err) {
  //     if (err.status === 401) {
  //       await logoutAuth(true);
  //     } else if (err.status === 500) {
  //       toast({
  //         variant: "destructive",
  //         description: err.response.data.message,
  //       });
  //     } else {
  //       toast({
  //         variant: "destructive",
  //         description: err.message,
  //       });
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4 space-y-4 hover:border-indigo-900/60 transition-colors duration-300">
      <div className="w-full bg-gray-950 border border-indigo-900/60 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
          <span>Hapus Akun</span>
        </div>
      </div>

      <div>Setelah akun Anda dihapus, semua data akan dihapus secara permanen.</div>

      <div>
        <Button type="button" variant={"outline"} className="border-red-950/70 bg-red-950/50 hover:bg-red-950/70" disabled={true}>
          <span>Disabled For Now</span>
        </Button>

        {/* <ConfirmationDialog
          trigger={
            <Button type="button" variant={"outline"} className="border-red-950/70 bg-red-950/50 hover:bg-red-950/70" disabled={loadingContext || loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <span>Hapus Akun</span>
              )}
            </Button>
          }
          title={"Apakah kamu yakin?"}
          description={"Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus semua data secara permanen."}
          actionFunction={handleDestroy}
        /> */}
      </div>
    </div>
  );
}
