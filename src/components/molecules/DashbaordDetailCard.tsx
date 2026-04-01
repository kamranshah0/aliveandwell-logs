import { clsx } from "clsx";
import React from "react";

interface DataItem {
  label: string;
  value: string | number;
}

interface MainHeaderProps {
  title?: string;
  icon?: React.ReactNode;
  iconClassName?: string;
  data?: DataItem[];
}

const MainHeader: React.FC<MainHeaderProps> = ({
  title,
  icon,
  iconClassName,
  data = [],
}) => {
  return (
    <div className="rounded-xl bg-surface-0 p-5  drop-shadow-md">
      <div className="flex items-center gap-2 justify-between">
        <h2 className="text-text-med-em text-base font-semibold">{title}</h2>
        <div
          className={clsx(
            "bg-surface-1 size-10 flex items-center justify-center rounded-lg",
            iconClassName
          )}
        >
          {icon}
        </div>
      </div>

      <div className="flex flex-col mt-4 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex gap-1 justify-between items-center">
            <p className="text-text-med-em text-sm">{item.label}</p>
            <p className="text-text-high-em font-semibold text-base">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainHeader;
