import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sanitizeInput } from "@/utils/sanitizeInput";
import { Loader2 } from "lucide-react";
import useProfile from "@/configs/api/profile";
import FormField from "@/components/FormField";
import { writeLogClient } from "@/lib/logClient";

export default function UbahPassword() {
  const { loadingContext } = useAppContext();
  const { updatePassword } = useProfile();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [errCurrentPassword, setErrCurrentPassword] = useState<string | null>(null);
  const [errPassword, setErrPassword] = useState<string | null>(null);

  type FormikType = {
    current_password: string;
    password: string;
    password_confirmation: string;
  };

  const formik = useFormik<FormikType>({
    initialValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: Yup.object().shape({
      current_password: Yup.string()
        .transform((value) => sanitizeInput(value))
        .required("Password saat ini diperlukan"),
      password: Yup.string()
        .transform((value) => sanitizeInput(value))
        .required("Password baru diperlukan"),
      password_confirmation: Yup.string()
        .transform((value) => sanitizeInput(value))
        .required("Konfirmasi password baru diperlukan"),
    }),
    validateOnMount: true,
    onSubmit: async (data) => {
      setLoading(true);
      setErrCurrentPassword(null);
      setErrPassword(null);

      try {
        const res = await updatePassword(data);
        if (res?.status === 200) {
          formik.resetForm();
          toast({
            variant: "default",
            description: res?.data.message,
          });
        }
      } catch (err) {
        if (err.status === 422) {
          if (err.response.data.message.current_password) {
            setErrCurrentPassword(err.response.data.message.current_password[0]);
          }
          if (err.response.data.message.password) {
            setErrPassword(err.response.data.message.password[0]);
          }
        } else if (err.status === 400) {
          setErrCurrentPassword(err.response.data.message);
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

  return (
    <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4 space-y-4 hover:border-indigo-900/60 transition-colors duration-300">
      <div className="w-full bg-gray-950 border border-indigo-900/60 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 sm:size-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
            />
          </svg>
          <span>Ubah Password</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4" autoComplete="off">
        <FormField
          label="Password Saat Ini"
          type="password"
          name="current_password"
          className={(errors.current_password && touched.current_password) || errCurrentPassword ? "!border-red-600" : ""}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.current_password}
          placeholder="Masukkan Password Saat Ini"
          required={true}
          disabled={loadingContext || loading}
          error={((errors.current_password && touched.current_password) || errCurrentPassword) && <span className="block text-xs text-red-600">{errors.current_password || errCurrentPassword}</span>}
        />

        <FormField
          label="Password Baru"
          type="password"
          name="password"
          className={(errors.password && touched.password) || errPassword ? "!border-red-600" : ""}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
          placeholder="Masukkan Password Baru"
          required={true}
          disabled={loadingContext || loading}
          error={((errors.password && touched.password) || errPassword) && <span className="block text-xs text-red-600">{errors.password || errPassword}</span>}
        />

        <FormField
          label="Konfirmasi Password Baru"
          type="password"
          name="password_confirmation"
          className={errors.password_confirmation && touched.password_confirmation ? "!border-red-600" : ""}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password_confirmation}
          placeholder="Konfirmasi Password Baru"
          required={true}
          disabled={loadingContext || loading}
          error={errors.password_confirmation && touched.password_confirmation && <span className="block text-xs text-red-600">{errors.password_confirmation}</span>}
        />

        <div>
          <Button type="submit" variant={"outline"} className="hover:bg-indigo-950/50" disabled={loadingContext || loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Please wait
              </>
            ) : (
              <span>Simpan Password</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
