import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, AlertTriangle, Download } from "lucide-react";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { bulkImportDailyLogsCsv, getDailyLogFields } from "@/api/daily-log.api";
import { notify } from "@/components/ui/notify";
import { format } from "date-fns";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
};

const UploadDailyLogCsvModal = ({ open, onClose }: Props) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<any | null>(null);

  const { data: fieldsRes } = useQuery({
    queryKey: ["dailyLogFields"],
    queryFn: getDailyLogFields,
  });

  const fields = fieldsRes?.data?.data || [];

  const handleDownloadSample = () => {
    if (!fields || fields.length === 0) {
      toast.error("No fields configured yet");
      return;
    }

    const headers = fields.map((f: any) => `"${f.label.replace(/"/g, '""')}"`);
    const sampleRow = fields.map((f: any) => {
      let val = "Sample Data";
      if (f.type === "date") val = format(new Date(), "MM/dd/yyyy");
      if (f.type === "checkbox") val = "no";
      if (f.type === "select") val = f.options?.[0] || "None";
      if (f.type === "number") val = "0";
      return `"${String(val).replace(/"/g, '""')}"`;
    });

    const csvContent = [headers.join(","), sampleRow.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily_log_template_${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleDownloadSampleExcel = () => {
    if (!fields || fields.length === 0) {
      toast.error("No fields configured yet");
      return;
    }

    const sampleRow: any = {};
    fields.forEach((f: any) => {
      let val = "Sample Data";
      if (f.type === "date") val = format(new Date(), "MM/dd/yyyy");
      if (f.type === "checkbox") val = "no";
      if (f.type === "select") val = f.options?.[0] || "None";
      if (f.type === "number") val = "0";
      sampleRow[f.label] = val;
    });

    const worksheet = XLSX.utils.json_to_sheet([sampleRow]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Log Template");
    
    XLSX.writeFile(workbook, `daily_log_template_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const mutation = useMutation({
    mutationFn: bulkImportDailyLogsCsv,
    onSuccess: (res) => {
      notify.success("File processed successfully");
      queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
      queryClient.invalidateQueries({ queryKey: ["adminDailyLogReports"] });
      setSummary(res.data?.data?.summary);
      setFile(null);
    },
    onError: () => {
      notify.error("Failed to import daily logs");
    },
  });

  const handleUpload = () => {
    if (!file) {
      notify.error("Please select a file");
      return;
    }
    mutation.mutate(file);
  };

  const handleClose = () => {
    setFile(null);
    setSummary(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Upload className="size-5" />
            Upload Daily Logs
          </DialogTitle>
        </DialogHeader>

        {!summary && (
          <div className="mt-4 flex flex-col gap-4 text-primary">
            <label
              htmlFor="csv-upload"
              className="border-2 border-dashed rounded-xl p-6 cursor-pointer
              hover:border-primary transition flex flex-col items-center gap-2"
            >
              <FileSpreadsheet className="size-10 text-text-low-em" />
              <span className="text-sm text-text-low-em text-center font-medium">
                {file ? file.name : "Click to upload CSV file"}
              </span>

              <input
                id="csv-upload"
                type="file"
                accept=".csv, .xlsx, .xls"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </label>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-text-low-em italic">
                * Please use the sample format for importing logs.
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="link" 
                    className="text-primary h-auto p-0 w-fit font-bold"
                  >
                    <Download className="size-4 mr-1" /> Download Sample Template
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleDownloadSample}>
                    CSV Format
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadSampleExcel}>
                    Excel (XLSX) Format
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleUpload} disabled={mutation.isPending}>
                {mutation.isPending ? "Uploading..." : "Upload File"}
              </Button>
            </div>
          </div>
        )}

        {summary && (
          <div className="mt-4 flex flex-col gap-4 text-primary">
            <div className="rounded-lg border p-4 flex flex-col gap-2 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 text-sm font-bold">
                <AlertTriangle className="size-4" />
                <span>Import Summary</span>
              </div>
              <div className="text-sm space-y-1">
                <p>Total Rows: <b>{summary.totalRows}</b></p>
                <p className="text-green-600">Successful: <b>{summary.successCount}</b></p>
                <p className="text-red-600">Failed: <b>{summary.failedCount}</b></p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleClose}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadDailyLogCsvModal;
