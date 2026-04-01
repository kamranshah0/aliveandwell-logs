import { cn } from "@/lib/utils";
import { ArrowRight, Loader2 } from "lucide-react";

const AuthButton = ({
  children,
  className = "",
  loading = false,
  icon = true,
  ...props
}: any) => {
  return (
    <button
      disabled={loading}
      className={cn(
        "w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition disabled:opacity-70",
        "bg-gradient-to-b from-[#114655] to-[#3F6C23]",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          Verifying...
        </>
      ) : (
        <>
          {children}
          {icon && <ArrowRight size={18} />}
        </>
      )}
    </button>
  );
};

export default AuthButton;
