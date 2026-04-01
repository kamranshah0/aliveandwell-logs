import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export const useRoles = () =>
  useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await api.get("/roles");
      return res.data.data.map((r: any) => ({
        label: r.displayName,
        value: r.id,
      }));
    },
  });
