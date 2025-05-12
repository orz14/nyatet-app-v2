import useAxiosInterceptors from "@/lib/axios";
import { decryptData } from "@/lib/crypto";
import { writeLogClient } from "@/lib/logClient";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

function useAuth() {
  const axiosInstance = useAxiosInterceptors();
  const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth` : "https://be-nyatet.orzverse.com/api/auth";

  type LoginType = {
    username: string;
    password: string;
    remember: boolean;
  };

  async function login(credentials: LoginType) {
    try {
      const res = await axiosInstance.post(`${baseURL}/login`, credentials);
      return res;
    } catch (err) {
      throw err;
    }
  }

  type RegisterType = {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
  };

  async function register(data: RegisterType) {
    try {
      const res = await axiosInstance.post(`${baseURL}/register`, data);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function currentUser(token: string) {
    try {
      const res = await axiosInstance.get(`${baseURL}/current-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function getCsrfToken(method: any) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "https://be-nyatet.orzverse.com/api";

    if (method && ["post", "put", "patch", "delete"].includes(method)) {
      try {
        const resServer = await axiosInstance.get(`${baseURL}/check-connection`);
        if (resServer?.status === 200) {
          setCookie("CSRF-TOKEN", resServer?.data.csrf_token || "", {
            path: "/",
            maxAge: 60 * 60 * 24,
            secure: true,
            sameSite: "strict",
          });
        }
      } catch (err) {
        await writeLogClient("error", err);
        window.location.reload();
      }
    }
  }

  async function logout(token?: string) {
    // X-CSRF-TOKEN
    const csrfToken = (await getCookie("CSRF-TOKEN")) ?? "";

    // User-IP
    let userIp: string = "";
    const getUserIp = (await getCookie("user-ip")) ?? null;
    if (getUserIp) {
      const parsedUserIp = getUserIp.replace(/=/g, "");
      userIp = parsedUserIp;
    }

    // Fingerprint_
    const fingerprint = (await getCookie("fingerprint_")) ?? "";

    // Authorization
    let bearerToken: string = "";
    if (token) {
      bearerToken = `Bearer ${token}`;
    } else {
      const cookieToken = (await getCookie("token")) ?? null;
      if (cookieToken) {
        bearerToken = `Bearer ${cookieToken}`;
      } else {
        const encryptedData = localStorage.getItem("encryptedData") ?? null;
        if (encryptedData) {
          const decryptedData = decryptData(encryptedData);
          bearerToken = `Bearer ${decryptedData.token}`;
        }
      }
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": csrfToken,
        "User-IP": userIp,
        Fingerprint_: fingerprint,
        Authorization: bearerToken,
      },
    };

    try {
      const res = await axios.delete(`${baseURL}/logout`, config);
      const method = res.config.method;
      await getCsrfToken(method);

      return res;
    } catch (err) {
      const method = err.config?.method;
      await getCsrfToken(method);

      throw err;
    }
  }

  async function resetPassword(credential: { email: string }) {
    try {
      const res = await axiosInstance.post(`${baseURL}/reset-password`, credential);
      return res;
    } catch (err) {
      throw err;
    }
  }

  type NewPasswordType = {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
  };

  async function newPassword(credentials: NewPasswordType) {
    try {
      const res = await axiosInstance.post(`${baseURL}/new-password`, credentials);
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function setFingerprint(token: string) {
    try {
      const res = await axiosInstance.patch(
        `${baseURL}/set-fingerprint`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res;
    } catch (err) {
      throw err;
    }
  }

  return {
    login,
    register,
    currentUser,
    logout,
    resetPassword,
    newPassword,
    setFingerprint,
  };
}

export default useAuth;
