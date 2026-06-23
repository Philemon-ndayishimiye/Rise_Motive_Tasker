import { DashboardCard } from "../Admin/AdminCard";
import { Scale, Package } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Sample daily data — replace with real API data later ──
const dailyData = [
  { day: "Mon", Services: 12, Products: 8, Students: 5 },
  { day: "Tue", Services: 18, Products: 14, Students: 9 },
  { day: "Wed", Services: 15, Products: 10, Students: 12 },
  { day: "Thu", Services: 25, Products: 20, Students: 18 },
  { day: "Fri", Services: 30, Products: 28, Students: 22 },
  { day: "Sat", Services: 22, Products: 18, Students: 15 },
  { day: "Sun", Services: 35, Products: 32, Students: 28 },
];

// ── Custom tooltip ──
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg">
      <p className="font-family-playfair text-gray-950 font-bold text-[13px] mb-2">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: entry.color }}
          />
          <span className="font-family-playfair text-gray-600 text-[12px]">
            {entry.name}:
          </span>
          <span className="font-family-playfair font-bold text-gray-900 text-[12px]">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function RMStoreDashboard() {
  return (
    <div>
      {/* ── Page Title ── */}
      <h1 className="font-family-playfair text-[#1E3A8A] text-[17px] font-bold py-5">
        Dashboard Control Panel
      </h1>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <DashboardCard
          icon={Scale}
          number={10}
          backgroundColor="#FEE2E2"
          name="Service Requested"
        />

        <DashboardCard
          icon={Package}
          number={50}
          backgroundColor="#E0F2FE"
          name="In Stock Products"
        />
        {/* <DashboardCard
          icon={Users}
          number={30}
          backgroundColor="#FFE5B4"
          name="Staff Members"
        /> */}
      </div>

      {/* ── Graph Section ── */}
      <div className="mt-8 bg-white border border-gray-200 rounded-2xl px-6 py-6">
        {/* Graph header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="font-family-playfair text-[#1E3A8A] text-[16px] font-bold">
              Weekly Activity Overview
            </h2>
            <p className="font-family-playfair text-gray-500 text-[12px] mt-0.5">
              Daily increase across services, products & students — this week
            </p>
          </div>

          {/* Legend badges */}
          <div className="flex items-center gap-3 flex-wrap">
            {[
              { label: "Services", color: "#1E3A8A" },
              { label: "Products", color: "#F59E0B" },
              { label: "Students", color: "#10B981" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-family-playfair text-gray-600 text-[12px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={dailyData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Services gradient */}
              <linearGradient id="gradServices" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
              </linearGradient>
              {/* Products gradient */}
              <linearGradient id="gradProducts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
              {/* Students gradient */}
              <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F3F4F6"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tick={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 12,
                fill: "#9CA3AF",
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 12,
                fill: "#9CA3AF",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="Services"
              stroke="#1E3A8A"
              strokeWidth={2}
              fill="url(#gradServices)"
              dot={{ fill: "#1E3A8A", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#1E3A8A", strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="Products"
              stroke="#F59E0B"
              strokeWidth={2}
              fill="url(#gradProducts)"
              dot={{ fill: "#F59E0B", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#F59E0B", strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="Students"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#gradStudents)"
              dot={{ fill: "#10B981", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#10B981", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
