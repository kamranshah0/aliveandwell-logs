import { generateRefillSummary, uploadReportFile } from "@/api/report.api";
import { mapRefillSummaryReport } from "@/utils/refillReportMapper";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "@/utils/dateUtils";

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateRefillSummaryReport = async (
  from: string,
  to: string,
  format: "csv" | "pdf"
) => {
  const res = await generateRefillSummary(from, to);
    const apiData = res?.data?.data?.data ?? [];
  const summary = res?.data?.data?.summary ?? {};

  // 🛑 1️⃣ RAW API VALIDATION
  if (!Array.isArray(apiData) || apiData.length === 0) {
    throw new Error("No refill records found for selected date range");
  }



  const rows = await mapRefillSummaryReport(apiData);

  const fileName = `Refill_Summary_${from}_to_${to}`;
  let fileBlob: Blob;

  if (format === "csv") {
    const csv = [
      "Refill ID,Patient,Medication,Dosage,Pharmacy,Qty,Status,Date",
      ...rows.map(r =>
        [
          r.refillId,
          r.patientId,
          r.medication,
          r.dosage,
          r.pharmacy,
          r.quantity,
          r.status,
          r.createdAt,
        ].join(",")
      ),
    ].join("\n");

    fileBlob = new Blob([csv], { type: "text/csv;charset=utf-8" });

    // 🔥 DOWNLOAD CSV
    triggerDownload(fileBlob, `${fileName}.csv`);
  } else {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Healthcare Management System", 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.text("Refill Summary Report", 105, 32, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Period: ${formatDate(from)} to ${formatDate(to)}`, 105, 40, { align: "center" });

    autoTable(doc, {
      startY: 55,
      head: [[
        "Refill ID",
        "Patient",
        "Medication",
        "Dosage",
        "Pharmacy",
        "Qty",
        "Status",
        "Date",
      ]],
      body: rows.map(r => [
        r.refillId,
        r.patientId,
        r.medication,
        r.dosage,
        r.pharmacy,
        r.quantity,
        r.status,
        r.createdAt,
      ]),
      styles: { fontSize: 9, overflow: "ellipsize" },
    });

    fileBlob = doc.output("blob");

    // 🔥 DOWNLOAD PDF
    triggerDownload(fileBlob, `${fileName}.pdf`);
  }

  // 🔥 upload AFTER download trigger
  const formData = new FormData();
  formData.append("title", "Refill Summary Report");
  formData.append("type", "refill_summary");
  formData.append("file", fileBlob, `${fileName}.${format}`);

  await uploadReportFile(formData);

  return { count: rows.length, summary };
};
