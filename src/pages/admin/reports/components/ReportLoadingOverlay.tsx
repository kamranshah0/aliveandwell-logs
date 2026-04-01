// File: src/components/reports/ReportLoadingOverlay.tsx
import { Loader2 } from "lucide-react";

const ReportLoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-lg font-medium">Generating Report...</p>
        <p className="text-sm text-gray-500">Please wait while we process your request</p>
      </div>
    </div>
  );
};

export default ReportLoadingOverlay;