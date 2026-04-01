// src/api/auth.api.ts
import { api } from "./axios";

export const login = (payload: {
  email: string;
  password: string;
}) => api.post("/auth/admin/login", payload);

export const verifyMfa = (payload: {
  email: string;
  mfaCode: string;
  challengeName: string;
  session: string;
}) => api.post("/auth/admin/verify-mfa", payload);

export const refreshToken = () =>
  api.post("/auth/admin/refresh-token");

export const getMe = () =>
  api.get("/auth/admin/me");
export const logout = () => api.post("/auth/admin/logout");



export const forgotPassword = (email: string) => {
  return api.post("/auth/admin/forgot-password", { email });
};

export const confirmForgotPassword = (payload: {
  email: string;
  confirmationCode: string;
  newPassword: string;
}) => {
  return api.post("/auth/admin/confirm-forgot-password", payload);
};

export const changePassword = (payload: {
  currentPassword: string;
  newPassword: string;
}) => {
  return api.put("/auth/admin/change-password", payload);
};
