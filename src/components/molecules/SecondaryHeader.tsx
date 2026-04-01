import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface SecondaryHeaderProps {
  title?: string;
  description?: string;
  actionContent?: React.ReactNode;
    path?: string;
    onClick?: () => void;
}

const SecondaryHeader: React.FC<SecondaryHeaderProps> = ({
  title,
  actionContent,
    path = "",
    onClick,
}) => {
  return (
    <div className="flex justify-between">
      <Link to={path} onClick={onClick}>
        <div className="flex gap-4 items-center text-text-high-em ">
          <ArrowLeft className="size-5" />
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      </Link>

      {actionContent}
    </div>
  );
};

export default SecondaryHeader;
