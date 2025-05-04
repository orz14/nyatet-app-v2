import { Button } from "@/components/ui/button";
import ModalDialog from "../ModalDialog";
import useRole from "@/configs/api/role";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sanitizeInput } from "@/utils/sanitizeInput";
import useLogout from "@/hooks/useLogout";
import { Loader2 } from "lucide-react";
import FormField from "@/components/FormField";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { writeLogClient } from "@/lib/logClient";

type AddRoleType = {
  fetchFunction: any;
};

export default function AddRole({ fetchFunction }: AddRoleType) {
  const { store } = useRole();
  const { toast } = useToast();
  const { logoutAuth } = useLogout();
  const [loading, setLoading] = useState<boolean>(false);
  const [errRole, setErrRole] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

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
          setOpen(false);
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
        } else if (err.status === 409) {
          setErrRole(err.response.data.message);
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
          await writeLogClient("error", err.message);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const { values, handleSubmit, handleChange, handleBlur, touched, errors } = formik;

  return (
    <ModalDialog
      trigger={
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"outline"} onClick={() => setOpen(true)}>
                Tambah Role
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tambah Role</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
      title="Tambah Role"
      open={open}
      setOpen={setOpen}
      content={
        <form id="addRoleForm" onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <FormField
            label="Nama Role"
            name="role"
            className={(errors.role && touched.role) || errRole ? "!border-red-600" : ""}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.role}
            placeholder="Masukkan Nama Role"
            required={true}
            disabled={loading}
            error={((errors.role && touched.role) || errRole) && <span className="block text-xs text-red-600">{errors.role || errRole}</span>}
          />
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
      loading={loading}
    />
  );
}
