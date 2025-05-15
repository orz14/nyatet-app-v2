import Card from "@/components/Card";
import AuthLayout from "@/components/layouts/AuthLayout";
import MetaTag from "@/components/MetaTag";
import { Button } from "@/components/ui/button";
import useAuth from "@/configs/api/auth";
import Link from "next/link";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sanitizeInput } from "@/utils/sanitizeInput";
import { Loader2 } from "lucide-react";
import FormField from "@/components/FormField";
import { writeLogClient } from "@/lib/logClient";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: boolean; message: string } | null>(null);
  const [errEmail, setErrEmail] = useState<string | null>(null);

  type FormikType = {
    email: string;
  };

  const formik = useFormik<FormikType>({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .transform((value) => sanitizeInput(value))
        .email("Email tidak valid")
        .required("Email diperlukan"),
    }),
    validateOnMount: true,
    onSubmit: async (credential) => {
      setLoading(true);
      setStatus(null);
      setErrEmail(null);

      try {
        const res = await resetPassword(credential);
        if (res?.status === 200) {
          setStatus({
            type: res?.data.status,
            message: res?.data.message,
          });
        }
      } catch (err) {
        if (err.status === 422) {
          if (err.response.data.message.email) {
            setErrEmail(err.response.data.message.email[0]);
          }
        } else if (err.status === 404 || err.status === 429 || err.status === 500) {
          setStatus({
            type: err.response.data.status,
            message: err.response.data.message,
          });
        } else {
          setStatus({
            type: false,
            message: err.message,
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
    <>
      <MetaTag title={"Lupa Password"} />

      <AuthLayout>
        <Card>
          {status && (
            <div className={`w-full bg-gray-950 border border-gray-900 rounded-lg p-3 text-xs text-center mb-4 ${status.type ? "text-green-600" : "text-red-600"}`}>
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div className="text-xs">Masukkan alamat email yang terkait dengan akun Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.</div>

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
              disabled={loading}
              error={((errors.email && touched.email) || errEmail) && <span className="block text-xs text-red-600">{errors.email || errEmail}</span>}
            />

            <div className="flex flex-col-reverse min-[350px]:flex-row gap-4">
              <Button className={`w-full text-[12px] bg-gray-800 text-white hover:bg-gray-900 ${loading && "pointer-events-none opacity-50"}`} disabled={loading} asChild>
                <Link href={"/auth/login"}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                  <span>Kembali</span>
                </Link>
              </Button>

              <Button type="submit" className="w-full text-[12px] bg-indigo-600 text-white hover:bg-indigo-800" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  <>
                    <span>Kirim Tautan</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
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
