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
import { ClipboardList } from "lucide-react";

type DailyTrend = {
  date: string;
  displayDate: string;
  count: number;
};

type DailyActivityChartProps = {
  data: DailyTrend[];
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-100 text-sm">
        <p className="font-bold text-gray-900 mb-1">{label}</p>
        <div className="flex items-center gap-2">
           <div className="size-2 rounded-full bg-primary" />
           <p className="text-gray-600 font-medium">
             Entries: <span className="text-gray-900 font-bold">{payload[0].value}</span>
           </p>
        </div>
      </div>
    );
  }
  return null;
};

const DailyActivityChart: React.FC<DailyActivityChartProps> = ({ data }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-primary/5 size-12 flex items-center justify-center rounded-xl border border-primary/10">
            <ClipboardList className="size-6 text-primary" />
          </div>
          <div>
            <TitelMd>Daily Log Activity</TitelMd>
            <p className="text-sm text-gray-400 font-medium mt-0.5">
              Entry trends for the last 7 days
            </p>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="h-[280px] flex items-center justify-center">
          <EmptyState
            title="No activity found"
            description="There are no entries recorded in the last 7 days."
          />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barGap={0} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="displayDate"
              tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={15}
            />
            <YAxis
              tick={{ fill: "#94A3B8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              dx={-10}
            />
            <Tooltip
              cursor={{ fill: "#F8FAFC", radius: 8 }}
              content={<CustomTooltip />}
            />
            <Bar
              dataKey="count"
              name="Entries"
              fill="#114655" // Primary base
              radius={[6, 6, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default DailyActivityChart;
