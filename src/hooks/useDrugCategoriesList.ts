import { useQuery } from "@tanstack/react-query";
import { decryptText } from "@/utils/decryptAES";
import { api } from "@/api/axios";

export const useDrugCategoriesList = () =>
  useQuery({
    queryKey: ["drug-categories-list"],
    queryFn: async () => {
      const res = await api.get("/drug-categories");
      const categories = res.data.data;

      return Promise.all(
        categories.map(async (c: any) => ({
          ...c,
          name: await decryptText(c.name),
          description: c.description ? await decryptText(c.description) : "",
        }))
      );
    },
  });
