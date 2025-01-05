import useServer from "@/configs/api/server";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import Offline from "@/components/Offline";
import useService from "@/configs/api/service";
import useAuth from "@/configs/api/auth";
import { useToast } from "@/hooks/use-toast";
import { decryptData, encryptData } from "@/lib/crypto";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { logout: logoutUser } = useAuth();
  const { checkConnection } = useServer();
  const { getIp: getUserIp, setToken, getToken, removeToken } = useService();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [offline, setOffline] = useState(false);

  async function login(res) {
    const ip = localStorage.getItem("userIp") ?? null;
    const token = res.data.token;
    const user = {
      id: res.data.data.id,
      name: res.data.data.name,
      username: res.data.data.username,
      email: res.data.data.email,
      roleId: res.data.data.role_id,
      avatar: res.data.data.avatar,
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

  function handleUnauthenticated(err, url) {
    if (err.response?.data?.message == "Unauthenticated.") {
      setLoading(true);
      router.push(url);
    }
  }

  useEffect(() => {
    async function getIp() {
      return new Promise(async (resolve, reject) => {
        const ipBefore = localStorage.getItem("userIp") ?? null;
        try {
          const res = await getUserIp();
          let ipAfter = res?.data.ip;

          if (ipBefore != ipAfter) {
            localStorage.setItem("userIp", ipAfter);
          }
          resolve(ipAfter);
        } catch (err) {
          localStorage.setItem("userIp", null);
          reject(err);
        }
      });
    }

    async function handleLogout(callbackUrl, message) {
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

    async function handleDeleteToken(token, callbackUrl) {
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

    async function checkAccess() {
      setLoading(true);
      console.log("AuthContext executed!");
      const callbackUrl = encodeURI(router.asPath);

      try {
        const resServer = await checkConnection();
        if (resServer.status === 200) {
          setOffline(false);
          try {
            await getIp();
            const ip = localStorage.getItem("userIp") ?? null;

            try {
              const resToken = await getToken();
              if (resToken.status === 204) {
                const encryptedData = localStorage.getItem("encryptedData") ?? null;
                if (encryptedData) {
                  const decryptedData = decryptData(encryptedData);
                  const token = decryptedData.token;
                  handleDeleteToken(token, null);
                }
              } else if (resToken.status === 200) {
                const token = resToken?.data.token;
                const encryptedData = localStorage.getItem("encryptedData") ?? null;

                if (!encryptedData) {
                  handleDeleteToken(token, callbackUrl);
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

    // const interval = setInterval(checkAccess, 300000);
    const interval = setInterval(checkAccess, 60000);

    return () => clearInterval(interval);
  }, [router, toast]);

  return (
    <AuthContext.Provider
      value={{
        loadingContext: loading,
        user,
        login,
        logout,
        handleUnauthenticated,
      }}
    >
      <div style={{ zIndex: 10 }}>{offline ? <Offline /> : children}</div>
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
