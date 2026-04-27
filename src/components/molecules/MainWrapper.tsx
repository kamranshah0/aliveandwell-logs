 import { clx } from "@/lib/clx";
import React from "react";
interface Types {
  children?: React.ReactNode;
  className?: string;
}

const MainWrapper: React.FC<Types> = ({ children, className }) => {
  return (
    <div className={clx("p-6 bg-custom-bg-1 w-full min-w-0 max-w-[1440px] mx-auto", className)}>
       {children} 
    </div>
  );
};

export default MainWrapper;
