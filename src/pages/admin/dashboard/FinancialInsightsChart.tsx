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
import { UsersRound } from "lucide-react";

// --------------------
// Types
// --------------------
type ChartItem = {
  name: string;       // Week range (Dec 4 - Dec 10)
  actual: number;     // totalRequests
  expected: number;   // approvedThisWeek
};

type FinancialInsightsChartProps = {
  showTooltip?: boolean;
  data: ChartItem[];
};

// --------------------
// Custom Tooltip
// --------------------
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
      <div className="bg-side-panel p-2 rounded-lg shadow border text-sm">
        <p className="font-semibold text-text-high-em">{label}</p>

        {payload.map((entry, index) => (
          <p key={index} className="text-text-med-em">
            <span className="font-medium" style={{ color: entry.color }}>
              {entry.name}:
            </span>{" "}
            {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --------------------
// Component
// --------------------
const FinancialInsightsChart: React.FC<FinancialInsightsChartProps> = ({
  showTooltip = true,
  data,
}) => {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-side-panel p-6 rounded-2xl drop-shadow-md">
      {/* Header */}
      <div className="flex items-center mb-6 gap-3">
        <div className="bg-primary/10 size-12 flex items-center justify-center rounded-lg">
          <UsersRound className="size-4 text-primary" />
        </div>

        <div>
          <TitelMd>Refill Activity</TitelMd>
          <p className="text-sm text-text-low-em">
            Weekly refill requests vs approvals
          </p>
        </div>
      </div>

      {/* Content */}
      {!hasData ? (
        <div className="h-[262px] flex items-center justify-center">
          <EmptyState
            title="No activity found"
            description="There is no refill activity for this period"
          />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={262}>
          <BarChart
            data={data}
            barGap={6}
            barSize={60}
            className="financial-insights-chart-bar"
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tick={{
                className:
                  "fill-[var(--text-low-em)] text-xs font-medium",
                dy: 10,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tickLine={false}
              tick={{ className: "fill-[var(--text-med-em)] text-xs" }}
              allowDecimals={false}
            />

            {showTooltip && (
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={<CustomTooltip />}
              />
            )}
            {/* Total Requests (Actual) */}
            <Bar
              dataKey="actual"
              name="Total Requests"
              fill="var(--bg-primary)"
              radius={[8, 8, 0, 0]}
            />

            {/* Approved (Expected) */}
            <Bar
              dataKey="expected"
              name="Approved"
              fill="var(--bg-secondary)"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default FinancialInsightsChart;
