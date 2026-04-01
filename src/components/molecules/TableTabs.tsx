type Tab = {
  label: string;
  value: string;
  count?: number; // optional
};

interface TableTabsProps {
  TableTabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function TableTabs({ TableTabs, activeTab, onChange, className = "" }: TableTabsProps) {
  return (
    <div className={`flex bg-light-grey-0 border-b-2 border-outline-med-em gap-5 ${className}`}>
      {TableTabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`pb-3.5 text-sm font-medium -mb-[1px] border-b-2 cursor-pointer ${
            activeTab === tab.value
              ? " border-outline-brand-primary-high-em text-text-brand-primary-main"
              : "border-transparent text-text-low-em"
          }`}
        >
          {tab.label}
          {tab.count !== undefined && ` (${tab.count})`}
        </button>
      ))}
    </div>
  );
}
