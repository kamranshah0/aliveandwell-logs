import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Skeleton } from "../skeletons/skeleton"; 

interface FormSelectProps {
  placeholder?: string;
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  name?: string;
  disabled?: boolean;
  loading?: boolean; // ✅ NEW
}

const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    {
      placeholder = "Select an option",
      options,
      value,
      onChange,
      className,
      disabled = false,
      loading = false,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <Select
        value={value}
        onValueChange={onChange}
        disabled={isDisabled}
        {...rest}
      >
        <SelectTrigger
          ref={ref}
          className={cn(
            "rounded-xl py-2 px-3 w-full shadow-none border-outline-med-em dark:bg-surface-0",
            loading && "cursor-not-allowed",
            className
          )}
          size="custom"
        >
          {loading ? (
            <div className="flex items-center gap-2 w-full">
              loading... please wait
            </div>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>

        {/* Only render options when NOT loading */}
        {!loading && (
          <SelectContent>
            {options.length > 0 ? (
              options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-text-low-em">
                No options available
              </div>
            )}
          </SelectContent>
        )}
      </Select>
    );
  }
);

FormSelect.displayName = "FormSelect";
export default FormSelect;
