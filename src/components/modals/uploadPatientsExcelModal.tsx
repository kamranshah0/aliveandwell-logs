"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Download, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkImportPatientsExcel } from "@/api/patient.api";
import { notify } from "@/components/ui/notify";

type ImportSummary = {
  totalRows: number;
  successCount: number;
  failedCount: number;
  successRate: string;
  fileName: string;
  fileType: string;
  s3FileUrl?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const UploadPatientsExcelModal = ({ open, onClose }: Props) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);

  const mutation = useMutation({
    mutationFn: bulkImportPatientsExcel,
    onSuccess: (res) => {
      notify.success("File processed successfully");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["allProgramStats"] });
      queryClient.invalidateQueries({ queryKey: ["enrollPatients"] });

      const apiSummary = res.data?.summary;

      if (apiSummary) {
        setSummary({
          totalRows: apiSummary.totalRows,
          successCount: apiSummary.successCount,
          failedCount: apiSummary.failedCount,
          successRate: apiSummary.successRate,
          fileName: apiSummary.fileName,
          fileType: apiSummary.fileType,
          s3FileUrl: apiSummary.s3FileUrl,
        });
      }

      setFile(null);
    },
    onError: () => {
      notify.error("Failed to import patients");
    },
  });

  const handleUpload = () => {
    if (!file) {
      notify.error("Please select an Excel or CSV file");
      return;
    }
    mutation.mutate(file);
  };

  const handleDownloadFailed = () => {
    if (!summary?.s3FileUrl) return;
    window.open(summary.s3FileUrl, "_blank");
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
          <DialogTitle className="flex items-center gap-2">
            <Upload className="size-5" />
            Upload Patients Excel / CSV
          </DialogTitle>
        </DialogHeader>

        {/* UPLOAD AREA */}
        {!summary && (
          <div className="mt-4 flex flex-col gap-4">
            <label
              htmlFor="excel-upload"
              className="border-2 border-dashed rounded-xl p-6 cursor-pointer
              hover:border-primary transition flex flex-col items-center gap-2"
            >
              <FileSpreadsheet className="size-10 text-text-low-em" />
              <span className="text-sm text-text-low-em text-center">
                {file ? file.name : "Click to upload Excel / CSV file"}
              </span>

              <input
                id="excel-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </label>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>

              <Button onClick={handleUpload} disabled={mutation.isPending}>
                {mutation.isPending ? "Uploading..." : "Upload File"}
              </Button>
            </div>
          </div>
        )}

        {/* RESULT SUMMARY */}
        {summary && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="rounded-lg border p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="size-4 text-warning-500" />
                <span className="font-medium">Import Summary</span>
              </div>

              <div className="text-sm text-text-low-em space-y-1">
                <p>
                  Total Rows: <b>{summary.totalRows}</b>
                </p>
                <p>
                  Successful: <b>{summary.successCount}</b>
                </p>
                <p>
                  Failed: <b>{summary.failedCount}</b>
                </p>
                <p>
                  Success Rate: <b>{summary.successRate}</b>
                </p>
              </div>
            </div>

            {/* DOWNLOAD FAILED FILE */}
            {summary.failedCount > 0 && summary.s3FileUrl && (
              <Button
                variant="outlinedestructive"
                className="w-full"
                onClick={handleDownloadFailed}
              >
                <Download className="size-4" />
                Download Failed Records
              </Button>
            )}

            <div className="flex justify-end">
              <Button onClick={handleClose}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadPatientsExcelModal;
