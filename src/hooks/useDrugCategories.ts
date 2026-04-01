import { useQuery } from "@tanstack/react-query";
import { decryptText } from "@/utils/decryptAES";
import { api } from "@/api/axios";

export const useDrugCategories = () =>
  useQuery({
    queryKey: ["drug-categories"],
    queryFn: async () => {
      const res = await api.get("/drug-categories");

      return Promise.all(
        res.data.data.map(async (c: any) => ({
          label: await decryptText(c.name),
          value: c.id,
        }))
      );
    },
  });
