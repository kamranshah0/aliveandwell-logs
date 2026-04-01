// src/utils/refillReportMapper.ts
import { decryptText } from "@/utils/decryptAES";
import { formatDate } from "@/utils/dateUtils";

export const mapRefillSummaryReport = async (items: any[]) => {
  return Promise.all(
    items.map(async (item) => ({
      refillId: item.id?.slice(0, 8),
      patientId: item.patientId?.slice(0, 8),
      status: item.status,
      quantity: item.refillQuantity,
      createdAt: formatDate(item.createdAt),

      medication: await decryptText(item.medication?.medicine?.name),
      category: await decryptText(
        item.medication?.medicine?.drugCategory?.name
      ),
      dosage: await decryptText(item.medication?.dosage?.title),
      pharmacy: item.medication?.medicine?.pharmacy?.name ?? "—",
    }))
  );
};
