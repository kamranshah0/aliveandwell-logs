import { clx } from "@/lib/clx";
import React from "react";
interface Types {
  children?: React.ReactNode;
  className?: string;
}

const FormContainer: React.FC<Types> = ({ children, className }) => {
  return (
    <div className={clx("lg:px-[128px] md:px-[50px] px-[30px] py-8 bg-custom-bg-1", className)}>
       {children} 
    </div>
  );
};

export default FormContainer;
