import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { decryptText } from "@/utils/decryptAES";
import type { SelectOption } from "@/types/common";

export const useMedicationDosages = () =>
  useQuery<SelectOption[]>({
    queryKey: ["medication-dosages", "options"],
    queryFn: async () => {
      const res = await api.get("/medication-dosages");

      return Promise.all(
        res.data.data.map(async (d: any) => ({
          value: d.id,
          label: d.title
            ? await decryptText(d.title)
            : `${d.value} ${d.unitType.toLowerCase()}`,
        }))
      );
    },
    staleTime: 10 * 60 * 1000,
  });
