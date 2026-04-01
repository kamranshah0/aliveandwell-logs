import { FileText, X } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface FileItemsProps {
  files: File[];
  className?: string;
  onRemove: (fileName: string) => void; // new prop
}

const FileItems: React.FC<FileItemsProps> = ({ files, className, onRemove }) => {
  return (
    <>
      {files.map((file) => (
        <div
          key={file.name}
          className={cn(
            "flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg border-1 border-outline-low-em",
            className
          )}
        >
          {/* File info */}
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-text-low-em" />
            <div className="flex flex-col">
              <span
                className="truncate max-w-[120px] text-text-med-em text-sm font-medium"
                title={file.name}
              >
                {file.name}
              </span>
              <span className="text-xs text-text-low-em text-[10px]">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={() => onRemove(file.name)}
            className="p-1 rounded-full hover:bg-red-100 transition-colors"
          >
            <X className="size-4 text-red-500" />
          </button>
        </div>
      ))}
    </>
  );
};

export default FileItems;
