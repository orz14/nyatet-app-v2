export const getCookie = (name: string) => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) {
      let decodedValue = decodeURIComponent(value);
      while (decodedValue.length % 4 !== 0) {
        decodedValue += "=";
      }
      return decodedValue;
    }
  }
  return null;
};

export const setCookie = (name: string, value: string, options: any = {}) => {
  let cookieString = `${name}=${value}; path=${options.path || "/"};`;
  if (options.expires) {
    cookieString += ` expires=${options.expires.toUTCString()};`;
  }
  if (options.secure) {
    cookieString += " Secure;";
  }
  if (options.sameSite) {
    cookieString += ` SameSite=${options.sameSite};`;
  }
  document.cookie = cookieString;
};
