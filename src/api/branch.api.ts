import { api } from "@/api/axios";

export const getBranches = () => api.get("/admin/branches");
