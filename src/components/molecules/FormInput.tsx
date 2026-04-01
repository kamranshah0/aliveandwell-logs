import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  rightPlaceHolder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
  name?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode; // ✅ new prop
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      placeholder = "",
      rightPlaceHolder = "",
      className = "",
      type = "text",
      rightIcon,
      leftIcon, // ✅ destructure
      ...rest
    },
    ref
  ) => {
    return (
      <div className="relative">
        <Input
          type={type}
          placeholder={placeholder}
          className={cn(
            `rounded-xl py-2.5 px-3 shadow-none placeholder:text-text-placeholder
             ${rightPlaceHolder || rightIcon ? "pr-[75px]" : ""}
             ${leftIcon ? "pl-[45px]" : ""}`, // ✅ extra padding for left icon
            className
          )}
          ref={ref}
          {...rest}
        />

        {/* ✅ Left Icon */}
        {leftIcon && (
          <span className="inline-block absolute left-[15px] bottom-[50%] translate-y-[50%]">
            {leftIcon}
          </span>
        )}

        {/* ✅ Right Placeholder */}
        {rightPlaceHolder && (
          <span className="inline-block absolute right-[20px] bottom-[50%] translate-y-[50%] text-sm font-medium text-primary-600">
            {rightPlaceHolder}
          </span>
        )}

        {/* ✅ Right Icon */}
        {rightIcon && (
          <span className="inline-block absolute right-[20px] bottom-[50%] translate-y-[50%]">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
export default FormInput;
