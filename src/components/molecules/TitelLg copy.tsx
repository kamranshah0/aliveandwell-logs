import { clx } from "@/lib/clx";
import React from "react";

interface Types {
  children?: React.ReactNode;
  className?: string;
}

const TitelLg: React.FC<Types> = ({ children, className }) => {
  return (
    <h2
      className={clx("text-text-high-em text-3xl font-bold", className)}
    >
      {children}
    </h2>
  );
};

export default TitelLg;
