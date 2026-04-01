// components/FormSwitchGroup.tsx
import React from "react";
import clsx from "clsx";
import * as Switch from "@radix-ui/react-switch";

type Option = {
  label: string;
  description?: string;
};

type FormSwitchGroupProps = {
  name?: string; // RHF use case ke liye optional
  options: Option[];
  selected?: string[]; // RHF use case ke liye optional
  onChange: (value: string[]) => void;
};

const FormSwitchGroup: React.FC<FormSwitchGroupProps> = ({
  name,
  options,
  selected = [], // default empty array
  onChange,
}) => {
  const handleToggle = (label: string) => {
    const newSelected = selected.includes(label)
      ? selected.filter((item) => item !== label)
      : [...selected, label];
    onChange(newSelected);
  };

  return (
    <>
      {options.map((option) => (
        <div key={option.label}>
          <label
            className={clsx(
              "text-sm relative flex items-center gap-4 justify-between px-4 py-3 rounded-lg border cursor-pointer transition-all duration-200",
              selected.includes(option.label)
                ? "border-primary bg-side-panel-card text-dark-grey-300"
                : "border-outline-med-em bg-surface-0 text-text-med-em hover:border-primary hover:bg-side-panel-card"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-text-high-em text-base font-medium">
                {option.label}
              </span>
              {option.description && (
                <span className="text-text-med-em font-medium text-sm mt-1 ps-0.5 block">
                  {option.description}
                </span>
              )}
            </div>
            <Switch.Root
              checked={selected.includes(option.label)}
              onCheckedChange={() => handleToggle(option.label)}
              name={name}
              className={clsx(
                "w-12 h-7 bg-surface-4 rounded-full relative",
                "peer",
                selected.includes(option.label) && "bg-primary"
              )}
            >
              <Switch.Thumb
                className={clsx(
                  "block w-6 h-6 bg-surface-0 rounded-full shadow-md transition-transform duration-200 ease-in-out dark:bg-white",
                  selected.includes(option.label)
                    ? "translate-x-5"
                    : "translate-x-1"
                )}
              />
            </Switch.Root>
          </label>
        </div>
      ))}
    </>
  );
};

export default FormSwitchGroup;
