import { cn } from "@/lib/utils";
import { CiPlane } from "react-icons/ci";

const MainPlaneProgressBar = ({progress,className}:{progress:any;className?:string}) => {
  return (
    <div className={cn("rounded-xl",className)}>
      <div className="relative w-full h-6 ">
        <div className="w-full h-2 bg-custom-bg-icon rounded-full absolute top-1.5"></div>
        <div
          className="absolute top-1.5 left-0 h-2 bg-surface-brand-primary-accent-3 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
        <div
          className="absolute  left-0"
          style={{ left: `${progress - 2}%` }}
        >
          <div className="bg-text-brand-primary-main size-5 rounded-full flex items-center justify-center">
            <CiPlane size={10} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPlaneProgressBar;
