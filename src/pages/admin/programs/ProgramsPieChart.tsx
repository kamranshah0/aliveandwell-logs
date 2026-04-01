import { HandHeart, UsersRound } from "lucide-react";
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from "recharts";
 
import type { ProgramApiItem } from "./ProgramDashboard";

/* ---------------- Types ---------------- */
interface ProgramData {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipPayload {
  payload: ProgramData;
  value: number;
}

interface ProgramsPieChartProps {
  data: ProgramApiItem[];
  isLoading: boolean;
}
/* ---------------- Component ---------------- */
const ProgramsPieChart: React.FC<ProgramsPieChartProps> = ({ data, isLoading }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  console.log("ProgramsPieChart data:", data);

  

  // const programsData: ProgramData[] = [
  //   { name: "Diabetic", value: 200, color: "#3b82f6" },
  //   { name: "HIV(+)", value: 80, color: "#8b5cf6" },
  //   { name: "IV Infusion", value: 30, color: "#ec4899" },
  //   { name: "Hep C", value: 160, color: "#10b981" },
  //   { name: "Prevention", value: 90, color: "#f59e0b" },
  //   { name: "Primary Care", value: 120, color: "#06b6d4" },
  //   { name: "Weight Loss", value: 190, color: "#ef4444" },
  // ];

  const programsData: ProgramData[] =  data?.map((program: any, index: number) => {
    const colors = [
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
      "#10b981",
      "#f59e0b",
      "#06b6d4",
      "#ef4444",
      "#a78bfa",
      "#f97316",
      "#14b8a6",
    ];
    return {
      name: program.name,
      value: program.currentEnrolled,
      color: colors[index % colors.length],
    };
  });

  const totalPatients = programsData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  /* ---------------- Tooltip ---------------- */
  const CustomTooltip = ({
    active,
    payload,
  }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0] as CustomTooltipPayload;
      const percentage = (
        (data.value / totalPatients) *
        100
      ).toFixed(1);

      return (
        <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl">
          <p className="font-semibold text-sm mb-1">
            {data.payload.name}
          </p>
          <p className="text-lg font-bold">{data.value}</p>
          <p className="text-xs text-gray-400">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  /* ---------------- Active (3D) Slice ---------------- */
  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
    } = props;

    return (
      <g>
        {/* shadow slice (fake depth) */}
        <Sector
          cx={cx}
          cy={cy + 4}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill="rgba(0,0,0,0.15)"
        />

        {/* main slice */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="rounded-xl bg-white p-6 drop-shadow-md border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-text-low-em uppercase tracking-wide mb-2">
            Program Distribution
          </h2>
          <div className="flex items-center gap-2">
            <div className="bg-surface-1 size-12 flex items-center justify-center rounded-lg">
              <UsersRound className="size-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-text-high-em">
              {totalPatients.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <h2 className="text-sm font-semibold text-text-low-em uppercase tracking-wide mb-2">
            Active Programs
          </h2>
          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-text-high-em">
              {programsData.length}
            </p>
            <div className="bg-surface-1 size-12 flex items-center justify-center rounded-lg">
              <HandHeart className="size-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart + Legend */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={programsData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={3}
                activeShape={renderActiveShape}
                animationDuration={900}
                animationEasing="ease-out"
                onMouseEnter={(_, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {programsData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    stroke="white"
                    strokeWidth={3}
                    opacity={
                      hoveredIndex === null || hoveredIndex === index
                        ? 1
                        : 0.35
                    }
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend (same as yours, untouched) */}
        <div className="flex flex-col justify-center space-y-2.5">
          {programsData.map((item, index) => {
            const percentage = (
              (item.value / totalPatients) *
              100
            ).toFixed(1);
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.name}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                  isHovered
                    ? "bg-gray-50 shadow-sm scale-[1.02]"
                    : "hover:bg-gray-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-md"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">{item.value}</span>
                  <span className="text-xs text-text-low-em">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
          {/* Bottom Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-text-low-em mb-1">Highest</p>
          <p className="text-lg font-bold text-text-high-em">
            {Math.max(...programsData.map((d) => d.value))}
          </p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-xs text-text-low-em mb-1">Average</p>
          <p className="text-lg font-bold text-text-high-em">
            {Math.round(totalPatients / programsData.length)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-low-em mb-1">Lowest</p>
          <p className="text-lg font-bold text-text-high-em">
            {Math.min(...programsData.map((d) => d.value))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgramsPieChart;
