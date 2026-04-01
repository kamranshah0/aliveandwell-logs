import { useQuery } from "@tanstack/react-query";
import { fetchDosageForms } from "@/api/dosage-form.api";
import { decryptText } from "@/utils/decryptAES";

export const useDosageFormsList = () => {
  return useQuery({
    queryKey: ["dosage-forms-list"],
    queryFn: async () => {
      const res = await fetchDosageForms();
      const rawData = res.data.data;

      const decryptedData = await Promise.all(
        rawData.map(async (item: any) => ({
          ...item,
          name: await decryptText(item.name),
          description: item.description ? await decryptText(item.description) : "",
        }))
      );

      return decryptedData;
    },
  });
};
