import useServer from "@/configs/api/server";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import Offline from "@/components/Offline";
import useService from "@/configs/api/service";
import useAuth from "@/configs/api/auth";
import { useToast } from "@/hooks/use-toast";
import { decryptData } from "@/lib/crypto";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { logout: logoutUser } = useAuth();
  const { checkConnection } = useServer();
  const { getIp: getUserIp, getToken, removeToken } = useService();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [offline, setOffline] = useState(false);

  function logout() {
    setLoading(true);
    localStorage.removeItem("userIp");
    localStorage.removeItem("encryptedData");
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
      await removeToken();
      logout();

      toast({
        variant: "destructive",
        description: message,
      });

      router.push({
        pathname: "/auth/login",
        query: { callbackUrl },
      });
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
                localStorage.removeItem("encryptedData");
              } else if (resToken.status === 200) {
                const token = resToken?.data.token;
                const encryptedData = localStorage.getItem("encryptedData") ?? null;
                if (!encryptedData) {
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
                } else {
                  const decryptedData = decryptData(encryptedData);

                  if (decryptedData.ip != ip) {
                    try {
                      const resLogout = await logoutUser(token);

                      if (resLogout.status === 200) {
                        await handleLogout(callbackUrl, "Your ip address has changed. Please log in again.");
                      }
                    } catch (err) {
                      if (err.status === 401) {
                        await handleLogout(callbackUrl, "Token not valid. Please log in again.");
                      }
                    }
                  }

                  setUser({
                    token: decryptedData.token,
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
    <AuthContext.Provider value={{ loadingContext: loading, user, logout }}>
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
