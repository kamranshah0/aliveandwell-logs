import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import type { SelectOption } from "@/types/common";

export const useDoctors = () =>
  useQuery<SelectOption[]>({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await api.get("/auth/admin/doctors"); 
      return res.data.data.map((d: any) => ({
        value: d.id,
        label: d.name,
      }));
    },
    staleTime: 10 * 60 * 1000,
  });
