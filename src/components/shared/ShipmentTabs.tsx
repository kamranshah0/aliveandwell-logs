import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ShipmentTabsProps = {
  tabs: string[];
  defaultTab?: string;
  className?: string;
  gap?: number;
  onTabChange?: (tab: string) => void;
};

const ShipmentTabs: React.FC<ShipmentTabsProps> = ({
  tabs,
  defaultTab,
  onTabChange,
  className,
  gap,
}) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab || tabs[0]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    onTabChange?.(tab);
  };

  return (
    <Tabs
      value={selectedTab}
      onValueChange={handleTabChange} 
      className={cn(
        "w-full px-4 pt-6 shadow-none border-b-1  border-outline-med-em",
        className
      )}
    >
      <TabsList
        className="bg-transparent  shadow-none text-sm border-none p-0 flex"
        style={{ gap: gap ? gap : 12 }}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className={`dark:data-[state=active]:bg-transparent dark:data-[state=active]:dark:data-[state=active]:bg-transparent  flex -mb-[1px] gap-2 pb-3 font-medium  text-text-low-em border-b-2 border-transparent  px-0 shadow-none dark:data-[state=active]:text-text-brand-primary-em dark:data-[state=active]:border-outline-brand-primary-high-em :data-[state=active]
              ${
                selectedTab === tab
                  ? "text-text-brand-primary-em border-outline-brand-primary-high-em"
                  : ""
              }`}
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default ShipmentTabs;
