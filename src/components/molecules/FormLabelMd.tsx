import { Label } from "@/components/ui/label";
import { clx } from "@/lib/clx";
import React from "react";

interface Types {
  children?: React.ReactNode;
  className?: string;
}

const FormLabelMd: React.FC<Types> = ({ children, className }) => {
  return (
    <Label
      className={clx("text-base text-text-high-em font-semibold mb-2", className)}
    >
      {children}
    </Label>
  );
};

export default FormLabelMd;
