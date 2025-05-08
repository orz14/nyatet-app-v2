import MetaTag from "@/components/MetaTag";
import AuthLayout from "@/components/layouts/AuthLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Card from "@/components/Card";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import useAuth from "@/configs/api/auth";
import { sanitizeInput } from "@/utils/sanitizeInput";
import { useAppContext } from "@/contexts/AppContext";
import FormField from "@/components/FormField";
import { decryptData } from "@/lib/crypto";
import useService from "@/configs/api/service";
import { removeCookie } from "@/lib/cookie";
import { writeLogClient } from "@/lib/logClient";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { login: setLogin } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errUsername, setErrUsername] = useState<string | null>(null);
  const [errPassword, setErrPassword] = useState<string | null>(null);
  const callbackUrl = router.query?.callbackUrl as string | undefined;
  const { getToken } = useService();
  const attemptRef = useRef<number>(0);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    async function checktoken() {
      if (attemptRef.current >= 3) {
        clearInterval(intervalRef.current);
        return;
      }

      try {
        const resToken = await getToken();
        if (resToken?.status === 200) {
          const token = resToken?.data.token;
          const encryptedData = localStorage.getItem("encryptedData") ?? null;
          if (encryptedData) {
            const decryptedData = decryptData(encryptedData);
            if (decryptedData.token == token) {
              router.push(callbackUrl ?? "/todo");
            } else {
              localStorage.removeItem("encryptedData");
              removeCookie("fingerprint_");
              removeCookie("token");
              removeCookie("user-ip");
            }
          } else {
            removeCookie("fingerprint_");
            removeCookie("token");
            removeCookie("user-ip");
          }
        } else if (resToken?.status === 204) {
          attemptRef.current += 1;
          if (attemptRef.current >= 3) {
            clearInterval(intervalRef.current);
          }
        }
      } catch (err) {
        await writeLogClient("error", err);
      }
    }

    intervalRef.current = setInterval(checktoken, 2000);

    return () => clearInterval(intervalRef.current);
  }, []);

  type FormikType = {
    username: string;
    password: string;
    remember: boolean;
  };

  const formik = useFormik<FormikType>({
    initialValues: {
      username: "",
      password: "",
      remember: false,
    },
    validationSchema: Yup.object().shape({
      username: Yup.string()
        .transform((value) => sanitizeInput(value))
        .required("Username diperlukan"),
      password: Yup.string()
        .transform((value) => sanitizeInput(value))
        .required("Password diperlukan"),
    }),
    validateOnMount: true,
    onSubmit: async (credentials) => {
      setLoading(true);
      setError(null);
      setErrUsername(null);
      setErrPassword(null);

      try {
        const res = await login(credentials);
        if (res?.status === 200) {
          await setLogin(res);
          router.push(callbackUrl ?? "/todo");
        }
      } catch (err) {
        if (err.status === 401) {
          setError(err.response.data.message);
        } else if (err.status === 422) {
          if (err.response.data.message.username) {
            setErrUsername(err.response.data.message.username[0]);
          }
          if (err.response.data.message.password) {
            setErrPassword(err.response.data.message.password[0]);
          }
        } else {
          setError(err.message);
          await writeLogClient("error", err);
        }

        setLoading(false);
      }
    },
  });

  const { values, handleSubmit, handleChange, handleBlur, touched, errors } = formik;

  function handleLoginSocialite(endpoint: string) {
    setLoading(true);
    window.location.href = endpoint;
    setLoading(false);
  }

  return (
    <>
      <MetaTag title={"Login"} />

      <AuthLayout>
        <Card>
          {error && (
            <div className="w-full bg-gray-950 border border-gray-900 rounded-lg p-3 text-xs text-red-600 text-center mb-4">
              <span>Error: {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <FormField
              label="Username"
              name="username"
              className={(errors.username && touched.username) || errUsername ? "!border-red-600" : ""}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              placeholder="Masukkan Username"
              required={true}
              disabled={loading}
              error={((errors.username && touched.username) || errUsername) && <span className="block text-xs text-red-600">{errors.username || errUsername}</span>}
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
              disabled={loading}
              error={((errors.password && touched.password) || errPassword) && <span className="block text-xs text-red-600">{errors.password || errPassword}</span>}
            />

            <div className="block min-[260px]:flex min-[260px]:flex-row min-[260px]:items-center min-[260px]:justify-between text-[11px] md:text-xs">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" name="remember" onCheckedChange={(isChecked) => formik.setFieldValue("remember", isChecked)} onBlur={handleBlur} checked={values.remember} disabled={loading} />
                <Label htmlFor="remember" className="text-[11px] md:text-xs font-normal whitespace-nowrap">
                  Ingat Saya
                </Label>
              </div>

              <div className="text-right">
                <Link href={"/auth/forgot-password"} className="hover:text-indigo-400 whitespace-nowrap transition-colors duration-200">
                  Lupa Password?
                </Link>
              </div>
            </div>

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
                    <span>Masuk</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        <div className="w-full flex flex-row items-center justify-center gap-x-2 sm:gap-x-4">
          <div className="w-full h-[3px] border-t-2 border-gray-900" />
          <span className="text-nowrap text-[11px] text-muted-foreground">Atau Masuk Dengan</span>
          <div className="w-full h-[3px] border-t-2 border-gray-900" />
        </div>

        <section className="flex flex-col min-[350px]:flex-row gap-4">
          <Button type="button" className="w-full text-[12px] bg-gray-800 text-white hover:bg-gray-900" onClick={() => handleLoginSocialite(process.env.NEXT_PUBLIC_GITHUB_LOGIN_URL || "#")} disabled={loading}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 1792 1792">
              <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
            </svg>
            <span>GitHub</span>
          </Button>

          <Button type="button" className="w-full text-[12px] bg-red-700 text-white hover:bg-red-900" onClick={() => handleLoginSocialite(process.env.NEXT_PUBLIC_GOOGLE_LOGIN_URL || "#")} disabled={loading}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
              <path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z"></path>
            </svg>
            <span>Google</span>
          </Button>
        </section>
      </AuthLayout>
    </>
  );
}
