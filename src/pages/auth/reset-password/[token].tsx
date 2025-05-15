import Card from "@/components/Card";
import AuthLayout from "@/components/layouts/AuthLayout";
import MetaTag from "@/components/MetaTag";
import { Button } from "@/components/ui/button";
import useAuth from "@/configs/api/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sanitizeInput } from "@/utils/sanitizeInput";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FormField from "@/components/FormField";
import { writeLogClient } from "@/lib/logClient";

export default function ResetPassword() {
  const router = useRouter();
  const { token, email } = router.query;
  const { newPassword } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errPassword, setErrPassword] = useState<string | null>(null);

  type FormikType = {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
  };

  const formik = useFormik<FormikType>({
    initialValues: {
      email: "",
      password: "",
      password_confirmation: "",
      token: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .transform((value) => sanitizeInput(value))
        .required("Password baru diperlukan"),
      password_confirmation: Yup.string()
        .transform((value) => sanitizeInput(value))
        .required("Konfirmasi password baru diperlukan"),
    }),
    validateOnMount: true,
    onSubmit: async (credentials) => {
      setLoading(true);
      setError(null);
      setErrPassword(null);

      try {
        const res = await newPassword(credentials);
        if (res?.status === 200) {
          toast({
            variant: "default",
            description: res?.data.message,
          });

          router.push("/auth/login");
        }
      } catch (err) {
        if (err.status === 422) {
          if (err.response.data.message.email) {
            setError(err.response.data.message.email[0]);
          }
          if (err.response.data.message.token) {
            setError(err.response.data.message.token[0]);
          }
          if (err.response.data.message.password) {
            setErrPassword(err.response.data.message.password[0]);
          }
        } else if (err.status === 404 || err.status === 400 || err.status === 500) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
          await writeLogClient("error", err);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const { values, handleSubmit, handleChange, handleBlur, touched, errors } = formik;

  useEffect(() => {
    formik.setFieldValue("email", email ?? "");
    formik.setFieldValue("token", token ?? "");
  }, [router]);

  return (
    <>
      <MetaTag title={"Reset Password"} />

      <AuthLayout>
        <Card>
          {error && (
            <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-3 text-xs text-red-600 text-center mb-4">
              <span>Error: {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            <input type="hidden" id="token" name="token" value={values.token} />
            <input type="hidden" id="email" name="email" value={values.email} />

            <div className="space-y-4">
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
                disabled={loading}
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
                disabled={loading}
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
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                        />
                      </svg>
                      <span>Reset Password</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </AuthLayout>
    </>
  );
}
