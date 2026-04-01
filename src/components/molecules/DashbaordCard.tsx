import { clx } from "@/lib/clx";
import React from "react";

interface MainHeaderProps {
  title?: string;
  value?: string | number;
  icon?: React.ReactNode;
  iconClassName?: string;
  target?: number;
  currentValue?: number;
}

const MainHeader: React.FC<MainHeaderProps> = ({
  title,
  value,
  icon,
  iconClassName,
  target,
  currentValue = 0,
}) => {
  const showProgressBar =
    typeof target === "number" && typeof currentValue === "number";

  const progressPercent = showProgressBar
    ? Math.min((currentValue / target) * 100, 100)
    : 0;

  return (
    <div className="rounded-xl bg-surface-0 p-6 drop-shadow-md">
      <h2 className="text-text-low-em text-sm font-medium mb-1">
        {title}
      </h2>

      <div className="flex items-center gap-2 justify-between mb-1">
        <p className="text-text-high-em font-bold lg:text-3xl text-2xl">
          {value}
        </p>

        {icon && (
          <div
            className={clx(
              "bg-surface-1 size-12 flex items-center justify-center rounded-lg",
              iconClassName
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {showProgressBar && (
        <div className="space-y-2 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-low-em">
              {currentValue}
            </span>
            <span className="text-xs font-medium text-text-low-em">
              Goal: {target}
            </span>
          </div>

          <div className="relative w-full h-2 bg-gray-200/60 rounded-lg overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-end gap-1">
            <span className="text-[10px] text-text-low-em">
              {Math.round(progressPercent)}% complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainHeader;
