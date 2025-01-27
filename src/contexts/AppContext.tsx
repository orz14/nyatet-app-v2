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
import { setCookie } from "@/lib/cookie";

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
  id: number;
  name: string;
  username: string;
  email: string;
  roleId: number;
  avatar: string;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { logout: logoutUser } = useAuth();
  const { checkConnection } = useServer();
  const { getIp: getUserIp, setToken, getToken, removeToken } = useService();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [offline, setOffline] = useState<boolean>(false);
  const isOnline = useOnlineStatus();

  type LoginType = {
    token: string;
    data: {
      id: number;
      name: string;
      username: string;
      email: string;
      role_id: number;
      avatar: string;
    };
  };

  async function login(credentials: { data: LoginType }) {
    const ip = localStorage.getItem("userIp") ?? null;
    const token = credentials.data.token;
    const user = {
      id: credentials.data.data.id,
      name: credentials.data.data.name,
      username: credentials.data.data.username,
      email: credentials.data.data.email,
      roleId: credentials.data.data.role_id,
      avatar: credentials.data.data.avatar,
    };

    await setToken(token);
    const encryptedData = encryptData({ token, ip, user });
    if (encryptedData) {
      localStorage.setItem("encryptedData", encryptedData);
    }
  }

  async function logout() {
    setLoading(true);
    setUser(null);
    await removeToken();
    localStorage.removeItem("userIp");
    localStorage.removeItem("encryptedData");
  }

  type updateUserType = {
    name: string;
    email: string;
  };

  async function updateUser(data: updateUserType) {
    const ip = localStorage.getItem("userIp") ?? null;
    const tokenData = await getToken();
    const token = tokenData?.data.token;
    const newData = {
      id: user?.id,
      name: data?.name,
      username: user?.username,
      email: data?.email,
      roleId: user?.roleId,
      avatar: user?.avatar,
    };

    const newEncryptedData = encryptData({ token, ip, user: newData });
    if (newEncryptedData) {
      localStorage.setItem("encryptedData", newEncryptedData);
    }

    const encryptedData = localStorage.getItem("encryptedData");
    if (encryptedData) {
      const decryptedData = decryptData(encryptedData);

      setUser({
        id: decryptedData.user.id,
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
      const ipBefore = localStorage.getItem("userIp") ?? null;
      try {
        const res = await getUserIp();
        const ipAfter = res?.data.ip;

        if (ipBefore != ipAfter) {
          localStorage.setItem("userIp", ipAfter);
        }
        resolve(ipAfter);
      } catch (err) {
        localStorage.setItem("userIp", "");
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
        const resServer = await checkConnection();
        if (resServer.status === 200) {
          setOffline(false);
          setCookie("CSRF-TOKEN", resServer?.data.csrf_token || "", {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            secure: true,
            sameSite: "strict",
          });
          try {
            await getIp();
            const ip = localStorage.getItem("userIp") ?? null;

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
                    const ipChanged = decryptedData.ip != ip;
                    const tokenChanged = decryptedData.token != token;

                    if (ipChanged || tokenChanged) {
                      try {
                        const resLogout = await logoutUser(token);

                        if (resLogout.status === 200) {
                          if (ipChanged) {
                            await handleLogout(callbackUrl, "Your ip address has changed. Please log in again.");
                          } else if (tokenChanged) {
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
                      id: decryptedData.user.id,
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
          } catch (err) {
            console.log("🚀 ~ checkAccess ~ err:", err);
          }
        }
      } catch (err) {
        if (err.status === 500) {
          setOffline(true);
        } else {
          setOffline(true);
        }
      } finally {
        setLoading(false);
      }
    }

    checkAccess();

    const interval = setInterval(checkAccess, 300000);
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
