// components/FormRadioGroupIcon.tsx
import React from "react";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";

type Option = {
  label: string;
  fromIcon?: React.ReactNode;
  toIcon?: React.ReactNode;
  description?: string;
};

type FormRadioGroupIconProps = {
  name?: string; // optional for RHF
  options: Option[];
  selected?: string; // controlled ya RHF value
  onChange?: (value: string) => void; // controlled ya RHF setter
};

const FormRadioGroupIcon = React.forwardRef<
  HTMLInputElement,
  FormRadioGroupIconProps
>(({ name, options, selected, onChange }, ref) => {
  // Fallback agar selected undefined ho
  const currentValue = selected ?? "";

  return (
    <>
      {options.map((option) => {
        const isSelected = currentValue === option.label;

        return (
          <div key={option.label}>
            <button
            type="button"
              className={clsx(
                "text-sm relative flex-col flex items-center gap-1 justify-start px-4 py-3 rounded-lg border cursor-pointer transition-all duration-200",
                isSelected
                  ? "border-custom-stroke bg-custom-bg-icon text-text-high-em"
                  : "border-outline-med-em bg-surface-0 text-text-low-em hover:border-custom-stroke hover:bg-custom-bg-icon"
              )}
              onClick={() => onChange?.(option.label)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onChange?.(option.label);
                }
              }}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
            >
              <input
                type="radio"
                name={name}
                value={option.label}
                checked={isSelected}
                onChange={() => onChange?.(option.label)}
                ref={ref}
                className="sr-only"
              />

              <div className="flex items-center justify-center gap-1 w-full">
                {option.fromIcon && (
                  <span className="text-text-low-em">{option.fromIcon}</span>
                )}

                <div className="w-[80px] h-3 relative">
                  <div className="left-1 w-[70px] border-1 border-dashed border-dark-grey-400 absolute bottom-[50%] translate-y-[50%]"></div>
                  <div className="-right-[10%] absolute bottom-[50%] translate-y-[50%]">
                    <ChevronRight className="text-text-med-em" />
                  </div>
                </div>

                {option.toIcon && (
                  <span className="text-text-low-em">{option.toIcon}</span>
                )}
              </div>

              <span className="text-text-high-em text-sm font-medium">
                {option.label}
              </span>
            </button>

            {option.description && (
              <span className="text-text-med-em font-medium text-xs mt-1.5 ps-0.5 block text-right">
                {option.description}
              </span>
            )}
          </div>
        );
      })}
    </>
  );
});

FormRadioGroupIcon.displayName = "FormRadioGroupIcon";

export default FormRadioGroupIcon;
