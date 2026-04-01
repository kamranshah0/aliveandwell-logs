import { api } from "./axios";

export type RolePayload = {
  name: string;
  displayName: string;
  description?: string;
  permissionIds: string[];
};

export const getRoleById = (roleId: string) =>
  api.get(`/roles/${roleId}`);

export const createRole = (payload: {
  name: string;
  displayName: string;
  description: string;
  permissionIds: string[];
}) => {
  return api.post("/roles", payload);
};
 
export const updateRole = (
  roleId: string,
  payload: RolePayload
) => api.patch(`/roles/${roleId}`, payload);


export const fetchRoles = () => api.get("/roles");