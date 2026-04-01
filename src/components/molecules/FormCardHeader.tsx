import React from "react";
import { clx } from "@/lib/clx";
import { Search } from "lucide-react";
import FormInput from "./FormInput";

interface FormCardHeaderProps {
  title?: string;
  title2?: string;
  icon?: React.ReactNode;
  htmlTitle?: React.ReactNode;
  htmlIcon?: React.ReactNode;
  className?: string;

  // Optional search & select all
  searchValue?: string;
  onSearchChange?: (val: string) => void;

  selectAll?: boolean;
  onToggleAll?: () => void;
}

const FormCardHeader: React.FC<FormCardHeaderProps> = ({
  title,
  title2,
  icon,
  htmlTitle,
  className,
  searchValue,
  htmlIcon,
  onSearchChange,
}) => {
  return (
    <div
      className={clx(
        " bg-surface-0 flex flex-wrap items-center justify-between gap-3 py-3 px-6 border-b border-outline-low-em",
        className
      )}
    >
      {htmlTitle ? (
        htmlTitle
      ) : (
        <h3 className="text-xl font-semibold text-text-high-em">{title}</h3>
      )}
      {title2 &&(
        <h3 className="text-xl font-semibold text-text-high-em">{title2}</h3>
      )}

      {
        icon && icon
      }
      {
        htmlIcon && htmlIcon
      }



      {onSearchChange && (
        <div className="relative">
          <Search className="absolute left-3 bottom-[50%] translate-y-[50%] text-text-high-em size-4 text-sm" />
          <FormInput
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search customer by name, company "
            className="pl-10 w-[310px]"
          />
        </div>
      )}
    </div>
  );
};

export default FormCardHeader;
