import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { decryptText } from "@/utils/decryptAES";
import type { SelectOption } from "@/types/common";

export const usePatients = () =>
  useQuery<SelectOption[]>({
    queryKey: ["usePatients"],
    queryFn: async () => {
      const res = await api.get("/admin/patients");

      return Promise.all(
        res.data.data.map(async (p: any) => ({
          value: p.id,
          label: await decryptText(p.name),
        })),
      );
    },
    staleTime: 5 * 60 * 1000,
  });
