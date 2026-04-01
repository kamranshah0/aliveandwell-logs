import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";

export const usePharmacies = () =>
  useQuery({
    queryKey: ["UsePharmacies"],
    queryFn: async () => {
      const res = await api.get("/pharmacy");
      return res.data.data.map((p: any) => ({
        label: p.name,
        value: p.id,
      }));
    },
  });
