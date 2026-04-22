import { api } from "@/api/axios";

export const getAllAdmins = () => {
  return api.get("/auth/admin/all-admins");
};

export const createAdminUser = (payload: {
  username: string;
  password: string;
  name: string;
  roleId: string;
  designation?: string;
}) => {
  return api.post("/auth/admin/create-admin", payload);
};
  
export const deleteAdmin = (username: string) => {
  return api.delete("/auth/admin/delete-admin", {
    data: { username }, 
  });
};


export const getAdminByUsername = (username: string) =>
  api.get(`/auth/admin/by-username/${username}`);