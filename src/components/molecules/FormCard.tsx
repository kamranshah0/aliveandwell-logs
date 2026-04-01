import { cn } from "@/lib/utils";
import React from "react";

interface FormCardProps {
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
   id?: string;
   className?: string;
}

const FormCard: React.FC<FormCardProps> = ({ children,ref,id,className }) => {
  return (
    <div id={id} ref={ref} className={cn("rounded-2xl bg-surface-0  overflow-hidden",className)}>
      {children}
      
    </div>
  );
};

export default FormCard;
