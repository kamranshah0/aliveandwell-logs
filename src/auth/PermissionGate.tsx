import { usePermissions } from "./usePermissions";

export function PermissionGate({
  permission,
  children
}: {
  permission?: string;
  children: React.ReactNode;
}) {
  const { can } = usePermissions();

  if (!permission || can(permission)) return <>{children}</>;
  return null;
}
