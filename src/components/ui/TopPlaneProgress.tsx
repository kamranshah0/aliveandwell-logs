import { IoAirplaneOutline } from "react-icons/io5"; // or use your preferred icon
import { cn } from "@/lib/utils";

interface TopPlaneProgressProps {
  percentage: string | number;
  className?: string;
}

const TopPlaneProgress = ({ percentage, className = "" }: TopPlaneProgressProps) => {
  

  return (
    <div className={cn("relative h-2 rounded-full bg-surface-0 w-full", className)}>
      {/* Filled portion */}
      <div
        className="absolute left-0 top-0 h-full bg-surface-brand-primary-accent-3 rounded-full transition-all duration-300"
        style={{ width: percentage }}
      ></div>

      {/* Plane icon */}
      <div
        className="absolute -top-[60%] -translate-x-[50%] bg-surface-brand-primary-main text-white h-[20px] w-[20px] rounded-full flex items-center justify-center text-xs"
        style={{ left: percentage }}
      >
        <IoAirplaneOutline className="h-3 w-3" />
      </div>
    </div>
  );
};

export default TopPlaneProgress;
