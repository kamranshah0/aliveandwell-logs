import { api } from "./axios";

export const fetchPermissions = () =>
  api.get("/permissions");
