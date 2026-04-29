import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import TitelMd from "@/components/molecules/TiteMd";
import EmptyState from "@/components/empty/EmptyState";
import { ReactNode } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type ReportBarChartProps = {
  data: any[];
  title: string;
  description?: string;
  icon?: ReactNode;
  color?: string;
  onExport?: () => void;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-100 text-sm">
        <p className="font-bold text-gray-900 mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full" style={{ backgroundColor: payload[0].fill }} />
          <p className="text-gray-600 font-medium">
            Entries: <span className="text-gray-900 font-bold">{payload[0].value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const ReportBarChart: React.FC<ReportBarChartProps> = ({ 
  data, 
  title, 
  description,
  icon,
  color = "#114655",
  onExport
}) => {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="bg-primary/5 size-12 flex items-center justify-center rounded-xl border border-primary/10">
              {icon}
            </div>
          )}
          <div>
            <TitelMd>{title}</TitelMd>
            {description && (
              <p className="text-sm text-gray-400 font-medium mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport} className="flex items-center gap-2">
            <Download className="size-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        )}
      </div>

      {!hasData ? (
        <div className="h-[280px] flex items-center justify-center">
          <EmptyState
            title="No data found"
            description="There are no entries recorded for this category."
          />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F1F5F9" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={120}
            />
            <Tooltip
              cursor={{ fill: "#F8FAFC", radius: 8 }}
              content={<CustomTooltip />}
            />
            <Bar
              dataKey="count"
              fill={color}
              radius={[0, 6, 6, 0]}
              barSize={24}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ReportBarChart;
