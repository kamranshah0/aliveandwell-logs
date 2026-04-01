import { parsePermission } from "./permissionParser";

export const groupRolePermissions = (
  permissions: { name: string }[]
) => {
  const grouped: Record<string, Set<string>> = {};

  permissions.forEach((p) => {
    const { module, action } = parsePermission(p.name);

    if (!grouped[module]) {
      grouped[module] = new Set();
    }

    grouped[module].add(action);
  });

  return grouped;
};
