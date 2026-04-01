import { useAuth } from "./useAuth";

export const usePermissions = () => {
  const { permissions } = useAuth();

  const can = (permission: string) =>
    permissions.includes(permission);

  return { can };
};
