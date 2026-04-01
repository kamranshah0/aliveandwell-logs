import { useEffect, useMemo, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";

import { refreshToken, getMe, logout as logoutApi } from "@/api/auth.api";

// import { getRoleById } from "@/api/role.api";
import { setAccessToken, clearAccessToken } from "@/api/axios";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [status, setStatus] = useState<
    "BOOTING" | "AUTHENTICATED" | "UNAUTHENTICATED"
  >("BOOTING");

  /* =====================================================
     APP BOOTSTRAP (PAGE LOAD / REFRESH)
     refresh-token → getMe → role → permissions
  ===================================================== */
  useEffect(() => {
    let cancelled = false;

    const bootstrapAuth = async () => {
      try {
        //  get fresh access token (cookie based)
        const tokenRes = await refreshToken();
        if (cancelled) return;

        console.log("Refreshed access token");
        // console.log(tokenRes.data.data.accessToken);

        setAccessToken(tokenRes.data.data.accessToken);
        // setAccessToken('eyJraWQiOiJrdjdWclFkXC8xK0cyb3RqMVl4NkVwNWlSTFZsN0ZKM2s5WWVUcTJOSzEyST0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzMTJiYTU0MC03MGYxLTcwNmEtNDUyMy0zNThmOTU1NDQ5Y2MiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl85SFFvRGpLeEQiLCJjbGllbnRfaWQiOiIzaGFmYWh2M2lpaTZtZmxmZGdxMmwzbzJnbCIsIm9yaWdpbl9qdGkiOiI3MWZjNzkyOC0wOWNmLTRlYWEtYmE1ZS1kYjM4YjVlOTlhMmIiLCJldmVudF9pZCI6IjA4ODUwNjhmLTQxMGMtNGM4YS04NjViLTM1NzVmNDhhOGRlYiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NjY3Njk1MTAsImV4cCI6MTc2Njc3MzExMCwiaWF0IjoxNzY2NzY5NTEwLCJqdGkiOiJiYzVkMjFiMy03Yzk1LTQ4MTItYmYzNi01NzVkNDIyYzFhZjkiLCJ1c2VybmFtZSI6IjMxMmJhNTQwLTcwZjEtNzA2YS00NTIzLTM1OGY5NTU0NDljYyJ9.iLNvYExOn4GaIOampkxgfwA-JWbMWRa5MEyi76in5OpeqegqJ0jMvSuDrhn_PFVW6zHsm_IyZNvKD1LKvJgPSnASi6Gibjgm_Wc-qhluknLMSNHkbRUCUPBcLJw5KXv6Qb2zdhHvwucGrI05Jn08m1dlE2Pidf3POgAoDoif-a6NUdyP9FjxZ7fSsCfZbfM1IJYbuPkG41UsNBgey4ZpvmR6L4jZYN-0B3lbzDkVbKX58N916luDctxAduM57SF28hGhPvAIOXsc5u-zyEumfYKtBuJrT_ul9d2qW0ZB6zdwHw9PUcXMV97VHnxtXeky7kKVI80SckwB3CGs3MG0pg');

        // 2️⃣ fetch user profile
        const meRes = await getMe();
        if (cancelled) return;

        setUser(meRes.data.data);
        const roleName = meRes.data.data.role?.name;
        const perms = meRes.data.data.role?.permissions || [];
        
        // if (roleName === "receptionist") {
        //   document.body.classList.add("receptionist-theme");
        // } else {
        //   document.body.classList.remove("receptionist-theme");
        // }

        console.log("AuthProvider: Permissions from getMe (direct):", perms);
        setPermissions(perms);
        setStatus("AUTHENTICATED");
      } catch (err) {
        clearAccessToken();
        setUser(null);
        setPermissions([]);
        setStatus("UNAUTHENTICATED");
      }
    };

    bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =====================================================
     OTP SUCCESS ENTRY POINT
     verify-mfa → setAuth()
  ===================================================== */
  const setAuth = useCallback(
    async ({
      user,
      accessToken,
      permissions,
    }: {
      user: any;
      accessToken: string;
      permissions: string[];
    }) => {
      setStatus("BOOTING");

      setAccessToken(accessToken);
      setUser(user);
      
      const roleName = user.role?.name;
      if (roleName === "receptionist") {
        document.body.classList.add("receptionist-theme");
      } else {
        document.body.classList.remove("receptionist-theme");
      }

      setPermissions(permissions);
      setStatus("AUTHENTICATED");
    },
    []
  );

  /* =====================================================
     LOGOUT
  ===================================================== */
  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      clearAccessToken();
      setUser(null);
      setPermissions([]);
      setStatus("UNAUTHENTICATED");
      window.location.href = "/login";
    }
  };

  /* =====================================================
     CONTEXT VALUE
  ===================================================== */
  const value = useMemo(
    () => ({
      user,
      permissions,
      isAuthenticated: status === "AUTHENTICATED",
      isAuthReady: status !== "BOOTING",
      setAuth,
      logout,
    }),
    [user, permissions, status, setAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
