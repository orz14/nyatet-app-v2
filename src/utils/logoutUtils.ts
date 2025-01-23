async function logoutUtils(logoutAuth: any, toast: any, router: any, notification: boolean = false) {
  await logoutAuth();

  if (notification) {
    toast({
      variant: "destructive",
      description: "Token not valid.",
    });
  }

  router.push("/auth/login");
}

export default logoutUtils;
