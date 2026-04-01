import { clx } from "@/lib/clx";
import React from "react"; 
interface FormCardBodyProps {
  children?: React.ReactNode;
  className?: string;
  gap?: number;
}

const FormCardBody: React.FC<FormCardBodyProps> = ({ children, className,gap }) => {
  return (
    <div className={clx("p-6", className)}>
      <div className="grid grid-cols-12" style={{gap:gap ? gap : 24}}>{children}</div>
    </div>
  );
};

export default FormCardBody;
