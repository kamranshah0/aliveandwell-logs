export type Permission = {
  id: string;
  name: string;
  displayName: string;
  description: string;
};

export type RoleDetails = {
  id: string;
  name: string;
  displayName: string;
  permissions: Permission[];
};
