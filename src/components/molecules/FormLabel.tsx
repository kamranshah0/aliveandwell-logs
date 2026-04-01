import { Label } from "@/components/ui/label";
import { clx } from "@/lib/clx";
import React from "react";

interface Types {
  children?: React.ReactNode;
  className?: string;
}

const FormLabel: React.FC<Types> = ({ children, className }) => {
  return (
    <Label
      className={clx("mb-2 ps-1 text-text-med-em text-xs semibold", className)}
    >
      {children}
    </Label>
  );
};

export default FormLabel;
