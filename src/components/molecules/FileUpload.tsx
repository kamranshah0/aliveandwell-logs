// components/FileUpload.tsx
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import { Button } from "../ui/button";

type FileUploadProps = {
  onFilesAdded: (files: File[]) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onFilesAdded }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      accept: { "application/pdf": [".pdf"], "text/csv": [".csv"] }, // Customize file types
      multiple: true,
    });

  return (
    <div className="border-1 border-dashed border-outline-med-em bg-surface-1 rounded-lg p-6 text-center">
      <div
        {...getRootProps()}
        className={clsx(
          "cursor-pointer p-4"
          //   isDragActive ? "bg-gray-100" : "bg-surface-0"
        )}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="flex flex-col gap-2.5 justify-center items-center h-[100px]">
           <p className="text-text-high-em">Drop the files here...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 justify-center items-center">
            <p className="text-text-high-em text-xs font-medium">
              Drag your image to start uploading
            </p>
            <div className="flex items-center justify-center w-full gap-2">
              <span className="w-[10%] border-t border-1 border-dark-grey-950"></span>
              <span className="px-2 text-text-low-em">OR</span>
              <span className="w-[10%] border-t border-1 border-dark-grey-950"></span>
            </div>
            <Button
              variant={"outline"}
              className=" px-4 py-2 border-1 border-primary-600 text-primary-600 rounded-md hover:bg-surface-brand-primary-main hover:text-white"
            >
              Choose File
            </Button>
          </div>
        )}
      </div>
      {/* {acceptedFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {acceptedFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-outline-med-em"
            >
              <span className="text-text-high-em">{file.type === "application/pdf" ? "📄" : "📊"}</span>
              <span className="text-sm text-text-high-em">{file.name}</span>
              <span className="text-xs text-text-high-em">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default FileUpload;
