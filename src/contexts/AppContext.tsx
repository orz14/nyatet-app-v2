import useServer from "@/configs/api/server";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import Offline from "@/components/Offline";
import useService from "@/configs/api/service";
import useAuth from "@/configs/api/auth";
import { useToast } from "@/hooks/use-toast";
import { decryptData, encryptData } from "@/lib/crypto";
import { Comfortaa } from "next/font/google";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { Toaster } from "@/components/ui/toaster";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { writeLogClient } from "@/lib/logClient";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import useLoginLog from "@/configs/api/login-log";

type AppContextType = {
  loadingContext: boolean;
  user: any;
  login: ((res: any) => Promise<void>) | any;
  logout: (() => Promise<void>) | any;
  updateUser: (() => Promise<void>) | any;
  handleUnauthenticated: (() => void) | any;
};

const defaultAppContext = {
  loadingContext: true,
  user: null,
  login: null,
  logout: null,
  updateUser: null,
  handleUnauthenticated: null,
};

export const AppContext = createContext<AppContextType>(defaultAppContext);

const comfortaa = Comfortaa({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

type UserType = {
  name: string | null;
  username: string | null;
  email: string | null;
  roleId: number | null;
  avatar: string | null;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser, logout: logoutUser } = useAuth();
  const { checkConnection } = useServer();
  const { getIp: getUserIp, setToken, getToken, removeToken } = useService();
  const { tokenInfo } = useLoginLog();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserType | null>({
    name: "Loading ...",
    username: null,
    email: null,
    roleId: null,
    avatar: "https://cdn.jsdelivr.net/gh/orz14/orzcode@main/img/blank.webp",
  });
  const [offline, setOffline] = useState<boolean>(false);
  const isOnline = useOnlineStatus();

  type LoginType = {
    token: string;
    data: {
      name: string;
      username: string;
      email: string;
      role_id: number;
      avatar: string;
    };
  };

  async function login(credentials: { data: LoginType }) {
    const token = credentials.data.token;
    const fingerprint = getCookie("fingerprint_") ?? "";
    const user = {
      name: credentials.data.data.name,
      username: credentials.data.data.username,
      email: credentials.data.data.email,
      roleId: credentials.data.data.role_id,
      avatar: credentials.data.data.avatar,
    };

    await setToken(token);
    const encryptedData = encryptData({ token, fingerprint, user });
    if (encryptedData) {
      localStorage.setItem("encryptedData", encryptedData);
    }
  }

  async function logout() {
    setLoading(true);
    setUser({
      name: "Loading ...",
      username: null,
      email: null,
      roleId: null,
      avatar: "https://cdn.jsdelivr.net/gh/orz14/orzcode@main/img/blank.webp",
    });
    await removeToken();
    deleteCookie("user-ip", { path: "/" });
    localStorage.removeItem("encryptedData");
  }

  type updateUserType = {
    name: string;
    email: string;
  };

  async function updateUser(data: updateUserType) {
    const tokenData = await getToken();
    const token = tokenData?.data.token;
    const newData = {
      name: data?.name,
      username: user?.username,
      email: data?.email,
      roleId: user?.roleId,
      avatar: user?.avatar,
    };

    const newEncryptedData = encryptData({ token, user: newData });
    if (newEncryptedData) {
      localStorage.setItem("encryptedData", newEncryptedData);
    }

    const encryptedData = localStorage.getItem("encryptedData");
    if (encryptedData) {
      const decryptedData = decryptData(encryptedData);

      setUser({
        name: decryptedData.user.name,
        username: decryptedData.user.username,
        email: decryptedData.user.email,
        roleId: decryptedData.user.roleId,
        avatar: decryptedData.user.avatar,
      });
    }
  }

  function handleUnauthenticated(err: { response: { data: { message: string } } }, url: string) {
    if (err.response?.data?.message == "Unauthenticated.") {
      setLoading(true);
      router.push(url);
    }
  }

  async function deviceId() {
    const getFingerprint = getCookie("fingerprint_") ?? null;
    if (!getFingerprint) {
      let fpb_: string = "";
      const getFpb_ = localStorage.getItem("fpb_") ?? null;

      if (getFpb_) {
        fpb_ = getFpb_;
      } else {
        const bytes = new Uint8Array(32 / 2);
        crypto.getRandomValues(bytes);
        fpb_ = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
        localStorage.setItem("fpb_", fpb_);
      }

      let fingerprint_: string = "";
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const deviceId = result.visitorId;

      if (deviceId != null && deviceId != undefined && deviceId != "") {
        fingerprint_ = deviceId;
      } else {
        fingerprint_ = fpb_;
      }

      setCookie("fingerprint_", fingerprint_, {
        path: "/",
        maxAge: 60 * 60 * 24,
        secure: true,
        sameSite: "strict",
      });
    }
  }

  async function getIp() {
    return new Promise(async (resolve, reject) => {
      const getIpBefore = (await getCookie("user-ip")) ?? null;
      let ipBefore: string | null = "";
      if (getIpBefore) {
        ipBefore = getIpBefore.replace("=", "");
      } else {
        ipBefore = null;
      }

      try {
        const res = await getUserIp();
        const ipAfter = res?.data.ip;

        if (ipBefore != ipAfter) {
          setCookie("user-ip", ipAfter, {
            path: "/",
            maxAge: 60 * 60 * 24,
            secure: true,
            sameSite: "strict",
          });
        }
        resolve(ipAfter);
      } catch (err) {
        setCookie("user-ip", "", {
          path: "/",
          maxAge: 60 * 60 * 24,
          secure: true,
          sameSite: "strict",
        });
        reject(err);
      }
    });
  }

  async function handleLogout(callbackUrl: string, message: string) {
    await logout();

    toast({
      variant: "destructive",
      description: message,
    });

    if (callbackUrl) {
      router.push({
        pathname: "/auth/login",
        query: { callbackUrl },
      });
    } else {
      router.push("/auth/login");
    }
  }

  async function handleDeleteToken(token: string, callbackUrl: string | any) {
    // DEBUG START
    const data = {
      token,
      callbackUrl,
    };
    // DEBUG END

    try {
      const resLogout = await logoutUser(token);
      if (resLogout.status === 200) {
        await handleLogout(callbackUrl, "Please log in again.");
      }
    } catch (err) {
      if (err.status === 401) {
        await writeLogClient("warning", {
          message: "Token not valid from handleDeleteToken function.",
          data,
        });
        await handleLogout(callbackUrl, "Token not valid. Please log in again.");
      }
    }
  }

  type decryptedDataType = {
    token: string;
    fingerprint: string;
    user: {
      name: string;
      username: string;
      email: string;
      roleId: number;
      avatar: string;
    };
  };

  async function next(token: string, decryptedData: decryptedDataType, callbackUrl: string | any) {
    const fingerprint_ = getCookie("fingerprint_") ?? "";
    const tokenChanged = decryptedData.token != token;
    const fingerprintChanged = decryptedData.fingerprint != fingerprint_;

    // DEBUG START
    const data = {
      token,
      decryptedData,
      callbackUrl,
      fingerprint_,
      tokenChanged,
      fingerprintChanged,
    };
    // DEBUG END

    if (tokenChanged || fingerprintChanged) {
      try {
        const resLogout = await logoutUser(token);

        if (resLogout.status === 200) {
          if (tokenChanged) {
            await handleLogout(callbackUrl, "Your token has changed. Please log in again.");
          } else if (fingerprintChanged) {
            await handleLogout(callbackUrl, "Your fingerprint has changed. Please log in again.");
          }
        }
      } catch (err) {
        if (err.status === 401) {
          await writeLogClient("warning", {
            message: "Token not valid from next function.",
            data,
          });
          await handleLogout(callbackUrl, "Token not valid. Please log in again.");
        }
      }
    }

    setUser({
      name: decryptedData.user.name,
      username: decryptedData.user.username,
      email: decryptedData.user.email,
      roleId: decryptedData.user.roleId,
      avatar: decryptedData.user.avatar,
    });
  }

  useEffect(() => {
    async function checkAccess() {
      setLoading(true);
      console.log("AppContext executed!");
      const callbackUrl = encodeURI(router.asPath);

      try {
        await deviceId();
        await getIp();
        try {
          const resServer = await checkConnection();
          if (resServer.status === 200) {
            setOffline(false);
            setCookie("CSRF-TOKEN", resServer?.data.csrf_token || "", {
              path: "/",
              maxAge: 60 * 60 * 24,
              secure: true,
              sameSite: "strict",
            });
            if (router.pathname != "/auth/callback") {
              try {
                const resToken = await getToken();
                if (resToken.status === 204) {
                  const encryptedData = localStorage.getItem("encryptedData") ?? null;
                  if (encryptedData) {
                    const decryptedData = decryptData(encryptedData);
                    const token = decryptedData.token;
                    await setToken(token);
                    await next(token, decryptedData, callbackUrl);
                  }
                } else if (resToken.status === 200) {
                  const token = resToken?.data.token;
                  const encryptedData = localStorage.getItem("encryptedData") ?? null;

                  if (!encryptedData) {
                    const fingerprint_ = getCookie("fingerprint_") ?? "";
                    try {
                      const resTokenInfo = await tokenInfo();
                      if (resTokenInfo?.status === 200) {
                        const resFingerprint = resTokenInfo?.data.data.fingerprint;
                        if (fingerprint_ == resFingerprint) {
                          try {
                            const resUser = await currentUser(token);
                            if (resUser?.status === 200) {
                              const user = {
                                name: resUser.data.data.name,
                                username: resUser.data.data.username,
                                email: resUser.data.data.email,
                                roleId: resUser.data.data.role_id,
                                avatar: resUser.data.data.avatar,
                              };

                              const encryptedData = encryptData({ token, fingerprint: resFingerprint, user });
                              if (encryptedData) {
                                localStorage.setItem("encryptedData", encryptedData);
                              }
                            }
                          } catch (err) {
                            await writeLogClient("error", err);
                            await handleDeleteToken(token, callbackUrl);
                          }
                        } else {
                          await handleDeleteToken(token, callbackUrl);
                        }
                      }
                    } catch (err) {
                      await writeLogClient("error", err);
                      await handleDeleteToken(token, callbackUrl);
                    }
                  } else {
                    const decryptedData = decryptData(encryptedData);
                    await next(token, decryptedData, callbackUrl);
                  }
                }
              } catch (err) {
                await writeLogClient("error", err);
              }
            }
          }
        } catch (err) {
          if (err.status === 401) {
            await writeLogClient("warning", {
              message: "Token not valid from checkConnection api.",
            });
            await handleLogout(callbackUrl, "Token not valid. Please log in again.");
          } else {
            setOffline(true);
            await writeLogClient("error", err);
          }
        }
      } catch (err) {
        await writeLogClient("error", err);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();

    const interval = setInterval(checkAccess, 1200000);
    // const interval = setInterval(checkAccess, 60000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <AppContext.Provider
      value={{
        loadingContext: loading,
        user,
        login,
        logout,
        updateUser,
        handleUnauthenticated,
      }}
    >
      <div className={comfortaa.className}>
        {(!isOnline || offline) && <Offline message={`${!isOnline ? "Internet Offline" : offline ? "Server Offline" : "Offline"}`} />}
        <div
          style={{
            zIndex: 10,
            ...(!isOnline || offline ? { pointerEvents: "none" } : {}),
          }}
        >
          {children}
        </div>
        <Toaster />
      </div>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
