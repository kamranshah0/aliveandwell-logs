import React, { useState } from "react";
import clsx from "clsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormInput from "./FormInput";

type Option = {
  label: string;
  icon?: React.ReactNode;
  description?: string;
  type?: string;
  placeholder?: string;
  modalHeader?: string;
  labelWith?: string;
};

type FormRadioGroupProps = {
  options: Option[];
  name?: string;
  className?: string;
  selected?: string;
  onChange?: (value: string) => void;
};

const FormRadioGroup = React.forwardRef<HTMLInputElement, FormRadioGroupProps>(
  ({ name, options, selected, onChange, className }, ref) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [tempCustom, setTempCustom] = useState("");
    const [activeCustomOption, setActiveCustomOption] = useState<Option | null>(
      null
    );
    const [customUnit, setCustomUnit] = useState("Days"); // ✅ dropdown value

    const isCustomBase = (label: string) =>
      label === "Custom" || label === "Other";

    const handleCustomSave = () => {
      const suffix = ` ${customUnit}`; // ✅ dropdown se lena
      onChange?.(`(${tempCustom}${suffix})`);
      setDialogOpen(false);
      setTempCustom("");
      setActiveCustomOption(null);
      setCustomUnit("Days");
    };

    return (
      <>
        {options.map((option) => {
          const baseLabel = option.label;
          const isCustom = isCustomBase(baseLabel);

          const currentValue = selected ?? "";
          const isSelected = isCustom
            ? currentValue.startsWith("(")
            : currentValue === baseLabel;

          const displayLabel =
            isSelected && isCustom ? currentValue : baseLabel;

          return (
            <div key={baseLabel}>
              <button
                type="button"
                className={clsx(
                  "w-full text-sm relative flex items-center gap-2 justify-start px-4 py-3 rounded-lg border cursor-pointer transition-all duration-200",
                  isSelected
                    ? "border-custom-stroke bg-custom-bg-icon text-text-high-em"
                    : "border-outline-med-em bg-surface-0 text-text-low-em hover:custom-stroke hover:bg-custom-bg-icon",
                  className
                )}
                onClick={() => {
                  if (isCustom) {
                    setDialogOpen(true);
                    setActiveCustomOption(option);
                  } else {
                    onChange?.(baseLabel);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (isCustom) {
                      setDialogOpen(true);
                      setActiveCustomOption(option);
                    } else {
                      onChange?.(baseLabel);
                    }
                  }
                }}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
              >
                <input
                  type="radio"
                  name={name}
                  value={baseLabel}
                  checked={isSelected}
                  onChange={() => onChange?.(baseLabel)}
                  ref={ref}
                  className="sr-only"
                />

                {isCustom
                  ? !currentValue.startsWith("(") && (
                      <Plus size={16} className="text-muted-foreground" />
                    )
                  : option.icon && (
                      <span className="text-text-med-em">{option.icon}</span>
                    )}

                <span className="text-text-high-em text-sm font-medium">
                  {displayLabel}
                </span>
              </button>

              {option.description && (
                <span className="text-xs text-text-med-em">
                  {option.description}
                </span>
              )}
            </div>
          );
        })}

        {/* Custom Input Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-surface-0">
            <DialogHeader>
              <DialogTitle className="pb-3 border-b-1 border-outline-low-em">
                {activeCustomOption?.modalHeader || "Enter Custom Value"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-2 relative">
              <FormInput
                type={activeCustomOption?.type || "text"}
                placeholder={`Please Enter ${customUnit}`} 
                value={tempCustom}
                onChange={(e) => setTempCustom(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tempCustom) {
                    handleCustomSave();
                  }
                }}
              />

              <Select value={customUnit} onValueChange={setCustomUnit}>
                <SelectTrigger className="outline-none shadow-none border-none absolute right-[20px] bottom-[55%] translate-y-[50%] text-sm font-medium text-primary-600 bg-transparent dark:bg-transparent ">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Days">Days</SelectItem>
                    <SelectItem value="Hours">Hours</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={handleCustomSave}
                disabled={!tempCustom}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

FormRadioGroup.displayName = "FormRadioGroup";

export default FormRadioGroup;
