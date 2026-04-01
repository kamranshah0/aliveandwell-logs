import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isPassword?: boolean;
    error?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  Icon,
    error,
  isPassword = false,
}) => {
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow(!show);

  return (
    <div className="space-y-2 mb-4">
      <Label htmlFor={id} className="text-sm font-semibold text-white">
        {label}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-low-em w-5 h-5" />
        )}
        <Input
          id={id}
          type={isPassword ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`bg-white pl-12 ${
            isPassword ? "pr-12" : "pr-5"
          } h-12 text-base border-outline-med-em `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={handleToggle}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-high-em hover:text-gray-800 transition-colors"
          >
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
