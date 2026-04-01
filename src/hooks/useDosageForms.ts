import { useQuery } from "@tanstack/react-query";
import { decryptText } from "@/utils/decryptAES";
import { api } from "@/api/axios";

export const useDosageForms = () =>
    useQuery({
        queryKey: ["dosage-forms"],
        queryFn: async () => {
            const res = await api.get("/dosage-forms");

            const result = await Promise.all(
                res.data.data.map(async (d: any) => {
                    const decrypted = await decryptText(d.name);
                    console.log("Encrypted:", d.name, "Decrypted:", decrypted);
                    return {
                        label: decrypted,
                        value: d.id,
                    };
                })
            );

            console.log("Final result:", result);
            return result;
        },
    });
