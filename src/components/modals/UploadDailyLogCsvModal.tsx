import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkImportDailyLogsCsv } from "@/api/daily-log.api";
import { notify } from "@/components/ui/notify";

type Props = {
  open: boolean;
  onClose: () => void;
};

const UploadDailyLogCsvModal = ({ open, onClose }: Props) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<any | null>(null);

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
      notify.error("Please select a CSV file");
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
            Upload Daily Logs CSV
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
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </label>

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
