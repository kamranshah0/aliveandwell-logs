import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { decryptText } from "@/utils/decryptAES";
import type { SelectOption } from "@/types/common";

export const useMedicines = () =>
  useQuery<SelectOption[]>({
    queryKey: ["useMedicines"],
    queryFn: async () => {
      const res = await api.get("/medicines");

      return Promise.all(
        res.data.data.map(async (m: any) => {
          const medicineName = await decryptText(m.name);

          // Optional enrichment (safe even if null)
          const category = m.drugCategory?.name
            ? await decryptText(m.drugCategory.name)
            : null;

          const dosageForm = m.dosageForm?.name
            ? await decryptText(m.dosageForm.name)
            : null;

          return {
            value: m.id,
            label: [
              medicineName,
              dosageForm ? `(${dosageForm})` : null,
              category ? `– ${category}` : null,
            ]
              .filter(Boolean)
              .join(" "),
          };
        })
      );
    },
    staleTime: 10 * 60 * 1000,
  });
