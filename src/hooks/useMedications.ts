import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { decryptText } from "@/utils/decryptAES";

export const useMedications = () =>
  useQuery({
    queryKey: ["useMedications"],
    queryFn: async () => {
      const res = await api.get("/medications");
      return Promise.all(
        res.data.data.map(async (m: any) => {
          const medicineName = await decryptText(m.medicine?.name);
          const dosageTitle = await decryptText(m.dosage?.title);

          //   next refill (simple logic)
          const nextRefillDate = new Date(m.createdAt);
          nextRefillDate.setDate(
            nextRefillDate.getDate() + (m.rxDurationDays ?? 0),
          );

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const nextDate = new Date(nextRefillDate);
          nextDate.setHours(0, 0, 0, 0);

          const isOverdue = today > nextDate;
          const diffTime = nextDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return {
            id: m.id,
            name: m.patientName || "—",
            rxId: m.rxId ?? "—",
            medications: medicineName || "—",
            quantity: m.quantity,
            dosage: dosageTitle || "—",
            refills: m.refills,
            status: isOverdue
              ? "overdue"
              : (m.refills > 0 && m.refills <= 2) || (diffDays >= 0 && diffDays <= 7)
                ? "due soon"
                : m.status?.toLowerCase() || "active",
            nextRefill: nextRefillDate.toDateString(),
            category: m.category,
          };
        }),
      );
    },
  });
