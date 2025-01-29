import { Button } from "@/components/ui/button";
import ModalDialog from "../ModalDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useRole from "@/configs/api/role";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sanitizeInput } from "@/utils/sanitizeInput";
import useLogout from "@/hooks/useLogout";
import { Loader2 } from "lucide-react";

type AddRoleType = {
  fetchFunction: any;
};

export default function AddRole({ fetchFunction }: AddRoleType) {
  const { store } = useRole();
  const { toast } = useToast();
  const { logoutAuth } = useLogout();
  const [loading, setLoading] = useState<boolean>(false);
  const [errRole, setErrRole] = useState<string | null>(null);

  const formik = useFormik<{ role: string }>({
    initialValues: {
      role: "",
    },
    validationSchema: Yup.object().shape({
      role: Yup.string()
        .transform((value) => sanitizeInput(value))
        .required("Nama role diperlukan"),
    }),
    validateOnMount: true,
    onSubmit: async (data) => {
      setLoading(true);
      setErrRole(null);

      try {
        const res = await store(data);
        if (res?.status === 201) {
          formik.resetForm();
          toast({
            variant: "default",
            description: res?.data.message,
          });
          await fetchFunction();
        }
      } catch (err) {
        if (err.status === 401) {
          await logoutAuth(true);
        } else if (err.status === 422) {
          if (err.response.data.message.role) {
            setErrRole(err.response.data.message.role[0]);
          }
        } else if (err.status === 500) {
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
    },
  });

  const { values, handleSubmit, handleChange, handleBlur, touched, errors } = formik;

  return (
    <ModalDialog
      trigger={<Button variant={"outline"}>Tambah Role</Button>}
      title="Tambah Role"
      content={
        <form id="addRoleForm" onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="role" className="text-[11px] font-normal md:font-medium">
              Nama Role
            </Label>
            <Input type="text" id="role" name="role" onChange={handleChange} onBlur={handleBlur} value={values.role} placeholder="Masukkan Nama Role" className={(errors.role && touched.role) || errRole ? "border-red-600" : ""} />
            {((errors.role && touched.role) || errRole) && <span className="block text-xs text-red-600">{errors.role || errRole}</span>}
          </div>
        </form>
      }
      footer={
        <Button type="submit" form="addRoleForm" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Please wait
            </>
          ) : (
            <span>Tambah</span>
          )}
        </Button>
      }
      closeText={"Tutup"}
    />
  );
}
