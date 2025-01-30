import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import useRole from "@/configs/api/role";
import { useToast } from "@/hooks/use-toast";
import useLogout from "@/hooks/useLogout";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type DeleteRoleType = {
  id: string;
  fetchFunction: any;
};

export default function DeleteRole({ id, fetchFunction }: DeleteRoleType) {
  const { destroy } = useRole();
  const { toast } = useToast();
  const { logoutAuth } = useLogout();
  const [loading, setLoading] = useState<boolean>(false);

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      const res = await destroy(id);
      if (res?.status === 200) {
        toast({
          variant: "default",
          description: res?.data.message,
        });
        await fetchFunction();
      }
    } catch (err) {
      if (err.status === 401) {
        await logoutAuth(true);
      } else if (err.status === 404) {
        toast({
          variant: "destructive",
          description: err.response.data.message,
        });
        await fetchFunction();
      } else if (err.status === 400 || err.status === 500) {
        toast({
          variant: "destructive",
          description: err.response.data.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: err.message,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Apakah kamu yakin?</DialogTitle>
        <DialogDescription className="pt-2">Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus data secara permanen.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={loading}>
            Batal
          </Button>
        </DialogClose>
        <Button type="button" onClick={() => handleDelete(id)} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Please wait
            </>
          ) : (
            <span>Hapus</span>
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
