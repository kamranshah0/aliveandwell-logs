import { Upload, X, FileText } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  label: string;

  /** New selected file */
  file: File | null;

  /** Existing file URL (edit mode) */
  existingUrl?: string;

  onPick: (f: File | null) => void;
  onRemove: () => void;

  accept?: string;
};

const UploadCard = ({
  label,
  file,
  existingUrl,
  onPick,
  onRemove,
  accept = "image/*,application/pdf",
}: Props) => {
  const [preview, setPreview] = useState<string | null>(null);

  const hasFile = !!file;
  const hasExisting = !!existingUrl && !file;

  // 🔁 Preview for newly selected image
  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [file]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-text-low-em">{label}</span>

      <label className="relative flex items-center justify-center h-28 border rounded-lg cursor-pointer bg-surface-1 hover:border-primary overflow-hidden">
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />

        {/* ================= NEW FILE SELECTED ================= */}
        {hasFile && (
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-3">
              {preview ? (
                <img
                  src={preview}
                  className="w-14 h-14 rounded-md object-cover"
                  alt="preview"
                />
              ) : (
                <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center">
                  <FileText className="size-6 text-gray-500" />
                </div>
              )}

              <div>
                <div className="text-sm font-medium">{file.name}</div>
                <div className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <X className="text-red-500" />
            </button>
          </div>
        )}

        {/* ================= EXISTING FILE (EDIT MODE) ================= */}
        {!hasFile && hasExisting && (
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center">
                <FileText className="size-6 text-gray-500" />
              </div>

              <div>
                <a
                  href={existingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary underline"
                >
                  View uploaded file
                </a>
                <div className="text-xs text-gray-500">
                  Upload new file to replace
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <X className="text-red-500" />
            </button>
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!hasFile && !hasExisting && (
          <div className="flex flex-col items-center text-gray-400">
            <Upload />
            <span className="text-sm">Upload file</span>
          </div>
        )}
      </label>
    </div>
  );
};

export default UploadCard;
