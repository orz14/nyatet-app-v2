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
import { getCookie, removeCookie, setCookie } from "@/lib/cookie";

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
  const { logout: logoutUser } = useAuth();
  const { checkConnection } = useServer();
  const { getIp: getUserIp, setToken, getToken, removeToken } = useService();
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
    const user = {
      name: credentials.data.data.name,
      username: credentials.data.data.username,
      email: credentials.data.data.email,
      roleId: credentials.data.data.role_id,
      avatar: credentials.data.data.avatar,
    };

    await setToken(token);
    const encryptedData = encryptData({ token, user });
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
    removeCookie("user-ip");
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

  async function getIp() {
    return new Promise(async (resolve, reject) => {
      const getIpBefore = getCookie("user-ip") ?? null;
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
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            secure: true,
            sameSite: "strict",
          });
        }
        resolve(ipAfter);
      } catch (err) {
        setCookie("user-ip", "", {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
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
    try {
      const resLogout = await logoutUser(token);
      if (resLogout.status === 200) {
        await handleLogout(callbackUrl, "Please log in again.");
      }
    } catch (err) {
      if (err.status === 401) {
        await handleLogout(callbackUrl, "Token not valid. Please log in again.");
      }
    }
  }

  useEffect(() => {
    async function checkAccess() {
      setLoading(true);
      console.log("AppContext executed!");
      const callbackUrl = encodeURI(router.asPath);

      try {
        await getIp();
        try {
          const resServer = await checkConnection();
          if (resServer.status === 200) {
            setOffline(false);
            setCookie("CSRF-TOKEN", resServer?.data.csrf_token || "", {
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
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
                    await handleDeleteToken(token, null);
                  }
                } else if (resToken.status === 200) {
                  const token = resToken?.data.token;
                  const encryptedData = localStorage.getItem("encryptedData") ?? null;

                  if (!encryptedData) {
                    await handleDeleteToken(token, callbackUrl);
                  } else {
                    const decryptedData = decryptData(encryptedData);
                    const tokenChanged = decryptedData.token != token;

                    if (tokenChanged) {
                      try {
                        const resLogout = await logoutUser(token);

                        if (resLogout.status === 200) {
                          if (tokenChanged) {
                            await handleLogout(callbackUrl, "Your token has changed. Please log in again.");
                          }
                        }
                      } catch (err) {
                        if (err.status === 401) {
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
                }
              } catch (err) {
                console.log("🚀 ~ checkAccess ~ err:", err);
              }
            }
          }
        } catch (err) {
          if (err.status === 500) {
            setOffline(true);
          } else {
            setOffline(true);
          }
        }
      } catch (err) {
        console.log("🚀 ~ checkAccess ~ err:", err);
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
