import { api } from "@/api/axios";

export const getAllAdmins = () => {
  return api.get("/auth/admin/all-admins");
};

export const createAdminUser = (payload: {
  email: string;
  password: string;
  name: string;
  roleId: string;
  designation?: string;
}) => {
  return api.post("/auth/admin/create-admin", payload);
};
  
export const deleteAdmin = (email: string) => {
  return api.delete("/auth/admin/delete-admin", {
    data: { email }, 
  });
};


export const getAdminByUsername = (username: string) =>
  api.get(`/auth/admin/by-username/${username}`);