import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import useRole from "@/configs/api/role";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sanitizeInput } from "@/utils/sanitizeInput";
import { writeLogClient } from "@/lib/logClient";

type EditRoleType = {
  data: {
    id: string;
    role: string;
  };
  fetchFunction: any;
};

export default function EditRole({ data, fetchFunction }: EditRoleType) {
  const { update } = useRole();
  const { toast } = useToast();
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
    onSubmit: async (dataRole) => {
      setLoading(true);
      setErrRole(null);

      try {
        const res = await update(data.id, dataRole);
        if (res?.status === 200) {
          toast({
            variant: "default",
            description: res?.data.message,
          });
          await fetchFunction();
        }
      } catch (err) {
        if (err.status === 404) {
          toast({
            variant: "destructive",
            description: err.response.data.message,
          });
          await fetchFunction();
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
          await writeLogClient("error", err);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const { values, handleSubmit, handleChange, handleBlur, touched, errors } = formik;

  useEffect(() => {
    formik.setFieldValue("role", data.role ?? "");
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <form id="editRoleForm" onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
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
      <DialogFooter className="gap-2 sm:space-x-0">
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={loading}>
            Batal
          </Button>
        </DialogClose>
        <Button type="submit" form="editRoleForm" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Please wait
            </>
          ) : (
            <span>Simpan</span>
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
