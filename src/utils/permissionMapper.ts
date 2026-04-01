export type BackendPermission = {
  id: string;
  name: string; // pharmacy.read
};

export type PermissionGroup = {
  module: string;
  actions: {
    read?: string;
    create?: string;
    update?: string;
    delete?: string;
  };
};

export function mapPermissions(
  permissions: BackendPermission[]
): PermissionGroup[] {
  const map: Record<string, PermissionGroup> = {};

  permissions.forEach((p) => {
    const [module, action] = p.name.split(".");

    if (!map[module]) {
      map[module] = {
        module,
        actions: {},
      };
    }

    if (["read", "create", "update", "delete"].includes(action)) {
      map[module].actions[action as keyof PermissionGroup["actions"]] = p.name;
    }
  });

  return Object.values(map);
}
