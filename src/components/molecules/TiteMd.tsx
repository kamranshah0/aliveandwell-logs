import { clx } from "@/lib/clx";
import React from "react";

interface Types {
  children?: React.ReactNode;
  className?: string;
}

const TitelMd: React.FC<Types> = ({ children, className }) => {
  return (
    <h3
      className={clx("text-text-high-em text-2xl font-semibold", className)}
    >
      {children}
    </h3>
  );
};

export default TitelMd;
