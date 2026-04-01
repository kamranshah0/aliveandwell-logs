import React from "react";
import clsx from "clsx";

type Option = {
  label: string;
  icon?: React.ReactNode;
  description?: string;
};

type RecentlyUsedSuggestionProps = {
  options: Option[];
  selected?: string;
  onChange: (value: string) => void; // ✅ required now
  className?: string;
};

const RecentlyUsedSuggestion: React.FC<RecentlyUsedSuggestionProps> = ({
  options,
  onChange,
  className,
}) => {
  return (
    <>
      {options.map((option) => (
        <label
          tabIndex={0}
          key={option.label}
          onClick={() => onChange(option.label)} // ✅ call onChange
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onChange(option.label); // ✅ call onChange on Enter key
            }
          }}
          className={clsx(
            "text-sm relative flex items-center gap-2 justify-start p-4 py-2 rounded-lg border cursor-pointer transition-all duration-200 font-semibold",
            "bg-surface-0 text-text-low-em hover:bg-custom-bg-icon  border-outline-med-em hover:border-custom-stroke",className
          )}
        >
          <span>{option.label}</span>
        </label>
      ))}
    </>
  );
};

export default RecentlyUsedSuggestion;
