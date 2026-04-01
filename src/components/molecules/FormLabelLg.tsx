import { Label } from "@/components/ui/label";
import { clx } from "@/lib/clx";
import React from "react";

interface Types {
  children?: React.ReactNode;
  className?: string;
}

const FormLabelLg: React.FC<Types> = ({ children, className }) => {
  return (
    <Label
      className={clx("text-text-high-em text-[20px] font-medium", className)}
    >
      {children}
    </Label>
  );
};

export default FormLabelLg;
