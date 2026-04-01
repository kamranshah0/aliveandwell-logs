import { generateUrgentRefillsReport, uploadReportFile } from "@/api/report.api";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { decryptText } from "@/utils/decryptAES";
import { formatDate } from "@/utils/dateUtils";

export const generateUrgentRefillsSummaryReport = async (
  from: string,
  to: string,
  format: "csv" | "pdf"
) => {
  const res = await generateUrgentRefillsReport(from, to, 70);
 

  const rows = res.data?.data?.data ?? [];

  // ✅ HARD GUARD
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("No urgent refill records found for selected date range");
  }

  const processed = await Promise.all(
    rows.map(async (r: any) => ({
      patientId: r.patientId.slice(0, 8),
      medication: await decryptText(r.medicine.name),
      pharmacy: r.medicine.pharmacy?.name ?? "—",
      remainingQty: r.remainingQuantity,
      daysLeft: r.daysLeft,
      dueDate: formatDate(r.dueDate),
      status: "Urgent",
    }))
  );

  const fileName = `Urgent_Refills_${from}_to_${to}`;
  let blob: Blob;

  if (format === "csv") {
    const csv =
      Object.keys(processed[0]).join(",") +
      "\n" +
      processed.map(r => Object.values(r).join(",")).join("\n");

    blob = new Blob([csv], { type: "text/csv" });
  } else {
    const doc = new jsPDF();
    doc.text("Urgent Refills Report (≤ 7 Days)", 105, 20, { align: "center" });

    autoTable(doc, {
      startY: 35,
      head: [Object.keys(processed[0])],
      body: processed.map(r => Object.values(r)),
      styles: { fontSize: 9 },
    });

    blob = doc.output("blob");
    doc.save(`${fileName}.pdf`);
  }

  const form = new FormData();
  form.append("title", "Urgent Refills Report");
  form.append("type", "urgent_refills");
  form.append("file", blob, `${fileName}.${format}`);

  await uploadReportFile(form);

  return { count: processed.length };
};
