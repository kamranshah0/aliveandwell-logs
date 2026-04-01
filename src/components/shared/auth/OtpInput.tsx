import { useRef } from "react";
import { Input } from "@/components/ui/input";

interface Props {
  length?: number;
  onChange?: (otp: string) => void;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
}

const OtpInput = ({
  length = 6,
  onChange,
  onComplete,
  disabled,
}: Props) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const getOtp = () =>
    inputs.current.map((i) => i?.value || "").join("");

  const trigger = () => {
    const otp = getOtp();
    onChange?.(otp);

    if (otp.length === length) {
      onComplete?.(otp); // ✅ DIRECT OTP PASS
    }
  };

  const handleChange = (e: any, index: number) => {
    const val = e.target.value.replace(/\D/g, "");
    e.target.value = val;

    if (val && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    trigger();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, length);

    paste.split("").forEach((char, i) => {
      if (inputs.current[i]) {
        inputs.current[i]!.value = char;
      }
    });

    trigger();
  };

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Enter") {
      const otp = getOtp();
      if (otp.length === length) {
        onComplete?.(otp);
      }
    }

    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length }).map((_, i) => (
        <Input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          placeholder="-"
          maxLength={1}
          disabled={disabled}
          onChange={(e) => handleChange(e, i)}
          onPaste={handlePaste}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-12 text-center text-lg text-white bg-transparent border-white/60 placeholder:text-white/50 focus-visible:ring-primary"
        />
      ))}
    </div>
  );
};

export default OtpInput;
