import { Button } from "@/components/ui/button";
import useProfile from "@/configs/api/profile";
import { useAppContext } from "@/contexts/AppContext";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sanitizeInput } from "@/utils/sanitizeInput";
import useLogout from "@/hooks/useLogout";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import FormField from "@/components/FormField";

export default function InformasiProfil() {
  const { loadingContext, user, updateUser } = useAppContext();
  const { updateProfile } = useProfile();
  const { logoutAuth } = useLogout();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [errName, setErrName] = useState<string | null>(null);
  const [errEmail, setErrEmail] = useState<string | null>(null);

  type FormikType = {
    name: string;
    email: string;
  };

  const formik = useFormik<FormikType>({
    initialValues: {
      name: "",
      email: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .transform((value) => sanitizeInput(value))
        .required("Nama diperlukan"),
      email: Yup.string()
        .transform((value) => sanitizeInput(value))
        .email("Email tidak valid")
        .required("Email diperlukan"),
    }),
    validateOnMount: true,
    onSubmit: async (data) => {
      setLoading(true);
      setErrName(null);
      setErrEmail(null);

      try {
        const res = await updateProfile(data);
        if (res?.status === 200) {
          toast({
            variant: "default",
            description: res?.data.message,
          });

          await updateUser({
            name: values.name,
            email: values.email,
          });
        }
      } catch (err) {
        if (err.status === 401) {
          await logoutAuth(true);
        } else if (err.status === 422) {
          if (err.response.data.message.name) {
            setErrName(err.response.data.message.name[0]);
          }
          if (err.response.data.message.email) {
            setErrEmail(err.response.data.message.email[0]);
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

  useEffect(() => {
    formik.setFieldValue("name", user?.name ?? "");
    formik.setFieldValue("email", user?.email ?? "");
  }, [loadingContext]);

  return (
    <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-4 space-y-4 hover:border-indigo-900/60 transition-colors duration-300">
      <div className="w-full bg-gray-950 border border-indigo-900/60 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
            />
          </svg>
          <span>Informasi Profil</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4" autoComplete="off">
        <FormField
          label="Nama"
          name="name"
          className={(errors.name && touched.name) || errName ? "!border-red-600" : ""}
          onChange={handleChange}
          onBlur={handleBlur}
          value={loadingContext ? "Loading ..." : values.name}
          placeholder="Masukkan Nama"
          required={true}
          disabled={loadingContext}
          error={((errors.name && touched.name) || errName) && <span className="block text-xs text-red-600">{errors.name || errName}</span>}
        />

        <FormField label="Username" name="username" value={loadingContext ? "Loading ..." : user?.username} disabled={true} />

        <FormField
          label="Email"
          name="email"
          className={(errors.email && touched.email) || errEmail ? "!border-red-600" : ""}
          onChange={handleChange}
          onBlur={handleBlur}
          value={loadingContext ? "Loading ..." : values.email}
          placeholder="Masukkan Email"
          required={true}
          disabled={loadingContext}
          error={((errors.email && touched.email) || errEmail) && <span className="block text-xs text-red-600">{errors.email || errEmail}</span>}
        />

        <div>
          <Button type="submit" variant={"outline"} className="hover:bg-indigo-950/50" disabled={loadingContext || loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Please wait
              </>
            ) : (
              <span>Simpan Profil</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
