export const parsePermission = (name: string) => {
  const [module, action] = name.split(".");
  return {
    module,
    action, // read | create | update | delete
  };
};

export const ACTIONS = ["view", "read", "create", "update", "delete"] as const;
