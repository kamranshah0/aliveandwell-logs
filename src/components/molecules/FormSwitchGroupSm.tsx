// components/FormSwitchGroup.tsx
import React from "react";
import clsx from "clsx";
import * as Switch from "@radix-ui/react-switch";
type Option = {
  label: string;
  value: string; // 🔑 backend permission name
  description?: string;
};

type FormSwitchGroupProps = {
  options: Option[];
  selected?: string[];
  onChange: (value: string[]) => void;
};

const FormSwitchGroupSm = ({
  options,
  selected = [],
  onChange,
}: FormSwitchGroupProps) => {
  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];

    onChange(newSelected);
  };

  return (
    <>
      {options.map((option) => {
        const isActive = selected.includes(option.value);

        return (
          <label
            key={option.value}
            className={`flex items-center justify-between gap-4 px-4 py-3 rounded-lg border cursor-pointer transition-all
              ${
                isActive
                  ? "border-primary bg-side-panel-card"
                  : "border-outline-med-em hover:border-primary"
              }`}
          >
            <span className="text-sm font-medium">
              {option.label}
            </span>

            <Switch.Root
              checked={isActive}
              onCheckedChange={() => handleToggle(option.value)}
              className={`w-[36px] h-[20px] rounded-full relative ${
                isActive ? "bg-primary" : "bg-light-grey-500"
              }`}
            >
              <Switch.Thumb
                className={`block size-4 bg-white rounded-full transition-transform ${
                  isActive ? "translate-x-4" : "translate-x-1"
                }`}
              />
            </Switch.Root>
          </label>
        );
      })}
    </>
  );
};

export default FormSwitchGroupSm;
