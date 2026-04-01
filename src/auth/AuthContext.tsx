import { createContext } from "react";

export type AuthStatus =
  | "BOOTING"
  | "AUTHENTICATED"
  | "UNAUTHENTICATED";

export type AuthContextType = {
  user: any | null;
  permissions: string[];
  isAuthenticated: boolean;
  isAuthReady: boolean;

  // called after OTP success
  setAuth: (payload: {
    user: any;
    accessToken: string;
    permissions: string[];
  }) => Promise<void>;

  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
