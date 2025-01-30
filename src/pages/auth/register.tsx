import Card from "@/components/Card";
import AuthLayout from "@/components/layouts/AuthLayout";
import MetaTag from "@/components/MetaTag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/configs/api/auth";
import { useAppContext } from "@/contexts/AppContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useState } from "react";
import { sanitizeInput } from "@/utils/sanitizeInput";
import { Loader2 } from "lucide-react";
import FormField from "@/components/FormField";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { login } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errName, setErrName] = useState<string | null>(null);
  const [errUsername, setErrUsername] = useState<string | null>(null);
  const [errEmail, setErrEmail] = useState<string | null>(null);
  const [errPassword, setErrPassword] = useState<string | null>(null);

  type FormikType = {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
  };

  const formik = useFormik<FormikType>({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .transform((value) => sanitizeInput(value))
        .required("Nama diperlukan"),
      username: Yup.string()
        .transform((value) => sanitizeInput(value))
        .required("Username diperlukan"),
      email: Yup.string()
        .transform((value) => sanitizeInput(value))
        .email("Email tidak valid")
        .required("Email diperlukan"),
      password: Yup.string()
        .transform((value) => sanitizeInput(value))
        .required("Password diperlukan"),
      password_confirmation: Yup.string()
        .transform((value) => sanitizeInput(value))
        .required("Konfirmasi Password diperlukan"),
    }),
    validateOnMount: true,
    onSubmit: async (data) => {
      setLoading(true);
      setError(null);
      setErrName(null);
      setErrUsername(null);
      setErrEmail(null);
      setErrPassword(null);

      try {
        const res = await register(data);
        if (res?.status === 201) {
          await login(res);
          router.push("/todo");
        }
      } catch (err) {
        if (err.status === 500 && err.response.data.type == "login_failed") {
          setError("Registrasi berhasil namun anda gagal saat login, silahkan coba login kembali.");
        } else if (err.status === 500 && err.response.data.type == "server_error") {
          setError(err.response.data.message);
        } else if (err.status === 422) {
          if (err.response.data.message.name) {
            setErrName(err.response.data.message.name[0]);
          }
          if (err.response.data.message.username) {
            setErrUsername(err.response.data.message.username[0]);
          }
          if (err.response.data.message.email) {
            setErrEmail(err.response.data.message.email[0]);
          }
          if (err.response.data.message.password) {
            setErrPassword(err.response.data.message.password[0]);
          }
        } else {
          setError(err.message);
        }

        setLoading(false);
      }
    },
  });

  const { values, handleSubmit, handleChange, handleBlur, touched, errors } = formik;

  return (
    <>
      <MetaTag title={"Register"} />

      <AuthLayout marginTop="mt-10">
        <Card>
          {error && (
            <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-3 text-xs text-red-600 text-center mb-4">
              <span>Error: {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <FormField
              label="Nama"
              name="name"
              className={(errors.name && touched.name) || errName ? "!border-red-600" : ""}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              placeholder="Masukkan Nama"
              required={true}
              error={((errors.name && touched.name) || errName) && <span className="block text-xs text-red-600">{errors.name || errName}</span>}
            />

            <FormField
              label="Username"
              name="username"
              className={(errors.username && touched.username) || errUsername ? "!border-red-600" : ""}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              placeholder="Masukkan Username"
              required={true}
              error={((errors.username && touched.username) || errUsername) && <span className="block text-xs text-red-600">{errors.username || errUsername}</span>}
            />

            <FormField
              label="Email"
              type="email"
              name="email"
              className={(errors.email && touched.email) || errEmail ? "!border-red-600" : ""}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              placeholder="Masukkan Email"
              required={true}
              error={((errors.email && touched.email) || errEmail) && <span className="block text-xs text-red-600">{errors.email || errEmail}</span>}
            />

            <FormField
              label="Password"
              type="password"
              name="password"
              className={(errors.password && touched.password) || errPassword ? "!border-red-600" : ""}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              placeholder="Masukkan Password"
              required={true}
              error={((errors.password && touched.password) || errPassword) && <span className="block text-xs text-red-600">{errors.password || errPassword}</span>}
            />

            <FormField
              label="Konfirmasi Password"
              type="password"
              name="password_confirmation"
              className={errors.password_confirmation && touched.password_confirmation ? "!border-red-600" : ""}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password_confirmation}
              placeholder="Konfirmasi Password"
              required={true}
              error={errors.password_confirmation && touched.password_confirmation && <span className="block text-xs text-red-600">{errors.password_confirmation}</span>}
            />

            <div>
              <Button type="submit" className="w-full text-[12px] bg-indigo-600 text-white hover:bg-indigo-800" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                    </svg>
                    <span>Daftar</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </AuthLayout>
    </>
  );
}
