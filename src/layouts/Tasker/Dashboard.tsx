import { useGetMyServicesQuery } from "../../app/api/Auth/Tasker";
import {
 
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ── Stat Card ───────────────────────────────────────────────────────────────

// interface StatCardProps {
//   icon: React.ElementType;
//   number: number;
//   name: string;
//   backgroundColor: string;
//   iconColor: string;
//   isLoading?: boolean;
// }

// function StatCard({
//   icon: Icon,
//   number,
//   name,
//   backgroundColor,
//   iconColor,
//   isLoading,
// }: StatCardProps) {
//   return (
//     <div
//       style={{
//         background: "#fff",
//         border: "1px solid #DBEAFE",
//         borderRadius: "14px",
//         padding: "18px",
//         display: "flex",
//         alignItems: "flex-start",
//         gap: "14px",
//         transition: "box-shadow 0.2s",
//       }}
//       onMouseEnter={(e) =>
//         ((e.currentTarget as HTMLDivElement).style.boxShadow =
//           "0 4px 20px rgba(30,58,138,0.1)")
//       }
//       onMouseLeave={(e) =>
//         ((e.currentTarget as HTMLDivElement).style.boxShadow = "none")
//       }
//     >
//       <div
//         style={{
//           width: "44px",
//           height: "44px",
//           borderRadius: "12px",
//           background: backgroundColor,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flexShrink: 0,
//         }}
//       >
//         <Icon size={20} color={iconColor} />
//       </div>
//       <div style={{ minWidth: 0 }}>
//         {isLoading ? (
//           <div
//             style={{
//               height: "28px",
//               width: "40px",
//               background: "#E5E7EB",
//               borderRadius: "6px",
//               marginBottom: "6px",
//               animation: "pulse 1.5s ease-in-out infinite",
//             }}
//           />
//         ) : (
//           <p
//             style={{
//               fontSize: "26px",
//               fontWeight: 800,
//               color: "#1E3A8A",
//               margin: 0,
//               lineHeight: 1,
//               fontFamily: "Playfair Display, serif",
//             }}
//           >
//             {number}
//           </p>
//         )}
//         <p
//           style={{
//             fontSize: "11px",
//             color: "#6B7280",
//             margin: "5px 0 0",
//             fontWeight: 600,
//             lineHeight: 1.3,
//           }}
//         >
//           {name}
//         </p>
//       </div>
//     </div>
//   );
// }

// ── Status breakdown mini-card ───────────────────────────────────────────────

function StatusCard({
  icon: Icon,
  label,
  count,
  color,
  bg,
  isLoading,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
  color: string;
  bg: string;
  isLoading?: boolean;
}) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${color}30`,
        borderRadius: "12px",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <Icon size={16} color={color} />
      <div>
        {isLoading ? (
          <div
            style={{
              height: "18px",
              width: "24px",
              background: `${color}40`,
              borderRadius: "4px",
            }}
          />
        ) : (
          <p
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: color,
              margin: 0,
              fontFamily: "Playfair Display, serif",
            }}
          >
            {count}
          </p>
        )}
        <p
          style={{
            fontSize: "10px",
            color: color,
            margin: "2px 0 0",
            fontWeight: 600,
            opacity: 0.8,
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

// ── Custom Tooltip ───────────────────────────────────────────────────────────

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
    <div
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        padding: "12px 16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <p
        style={{
          fontWeight: 700,
          fontSize: "13px",
          color: "#111827",
          margin: "0 0 8px",
          fontFamily: "Playfair Display, serif",
        }}
      >
        {label}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: entry.color,
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: "12px", color: "#6B7280" }}>
            {entry.name}:
          </span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Pie custom label ─────────────────────────────────────────────────────────

const PIE_COLORS = ["#1E3A8A", "#F59E0B", "#EC4899", "#10B981", "#8B5CF6"];

// ── Main Dashboard ───────────────────────────────────────────────────────────

export default function TaskerDashboard() {
  const { data, isLoading, isError } = useGetMyServicesQuery();

  const summary = data?.summary;
  const services = data?.services;

  // Build pie chart data from summary
  const pieData = summary
    ? [
        { name: "e-Gov", value: summary.egov },
        { name: "App & Docs", value: summary.applicationDocs },
        { name: "Creative", value: summary.creativeMedia },
        { name: "Web & Digital", value: summary.webDigital },
        { name: "Legal", value: summary.legal },
      ].filter((d) => d.value > 0)
    : [];

  // Build bar/area data from all services — group by status
  const buildStatusChart = () => {
    if (!services) return [];
    const all = [
      ...services.egov,
      ...services.applicationDocs,
      ...services.creativeMedia,
      ...services.webDigital,
      ...services.legal,
    ];
    const statusCounts: Record<string, number> = {
      PENDING: 0,
      ASSIGNED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    all.forEach((s) => {
      if (s.status in statusCounts) statusCounts[s.status]++;
    });
    return [
      { status: "Pending", count: statusCounts.PENDING },
      { status: "Assigned", count: statusCounts.ASSIGNED },
      { status: "In Progress", count: statusCounts.IN_PROGRESS },
      { status: "Completed", count: statusCounts.COMPLETED },
      { status: "Cancelled", count: statusCounts.CANCELLED },
    ];
  };

  const statusChart = buildStatusChart();

  // Count statuses for status cards
  const countStatus = (status: string) => {
    if (!services) return 0;
    const all = [
      ...services.egov,
      ...services.applicationDocs,
      ...services.creativeMedia,
      ...services.webDigital,
      ...services.legal,
    ];
    return all.filter((s) => s.status === status).length;
  };

  return (
    <div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* ── Page title ── */}
      <h1
        style={{
          fontFamily: "Playfair Display, serif",
          color: "#1E3A8A",
          fontSize: "20px",
          fontWeight: 800,
          paddingTop: "20px",
          paddingBottom: "20px",
          margin: 0,
        }}
      >
        Dashboard Overview
      </h1>

      {/* ── Error banner ── */}
      {isError && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "12px",
            padding: "14px 18px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#B91C1C",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <AlertCircle size={16} />
          Failed to load dashboard data. Please refresh the page.
        </div>
      )}

      {/* ── Category stat cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        
        
      </div>

      {/* ── Status breakdown row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <StatusCard
          icon={Clock}
          label="Pending"
          count={countStatus("PENDING")}
          color="#92400E"
          bg="#FEF9C3"
          isLoading={isLoading}
        />
        <StatusCard
          icon={UserCheck}
          label="Assigned"
          count={countStatus("ASSIGNED")}
          color="#1E3A8A"
          bg="#DBEAFE"
          isLoading={isLoading}
        />
        <StatusCard
          icon={Loader2}
          label="In Progress"
          count={countStatus("IN_PROGRESS")}
          color="#B45309"
          bg="#FEF3C7"
          isLoading={isLoading}
        />
        <StatusCard
          icon={CheckCircle2}
          label="Completed"
          count={countStatus("COMPLETED")}
          color="#14532D"
          bg="#DCFCE7"
          isLoading={isLoading}
        />
        <StatusCard
          icon={AlertCircle}
          label="Cancelled"
          count={countStatus("CANCELLED")}
          color="#7F1D1D"
          bg="#FEE2E2"
          isLoading={isLoading}
        />
      </div>

      {/* ── Charts row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* Status area chart */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            padding: "24px",
            minWidth: 0,
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                color: "#1E3A8A",
                fontSize: "16px",
                fontWeight: 700,
                margin: 0,
              }}
            >
              Service Status Breakdown
            </h2>
            <p
              style={{ fontSize: "12px", color: "#9CA3AF", margin: "4px 0 0" }}
            >
              Distribution of your assigned services by current status
            </p>
          </div>

          {isLoading ? (
            <div
              style={{
                height: "240px",
                background: "#F9FAFB",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9CA3AF",
                fontSize: "13px",
              }}
            >
              Loading chart...
            </div>
          ) : statusChart.every((d) => d.count === 0) ? (
            <div
              style={{
                height: "240px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9CA3AF",
                fontSize: "13px",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <TrendingUp size={32} color="#D1D5DB" />
              No service data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={statusChart}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F3F4F6"
                  vertical={false}
                />
                <XAxis
                  dataKey="status"
                  tick={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: 11,
                    fill: "#9CA3AF",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: 11,
                    fill: "#9CA3AF",
                  }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Services"
                  stroke="#1E3A8A"
                  strokeWidth={2.5}
                  fill="url(#gradCount)"
                  dot={{ fill: "#1E3A8A", r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: "#1E3A8A", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart — category breakdown */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            padding: "24px",
            minWidth: "240px",
          }}
        >
          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              color: "#1E3A8A",
              fontSize: "15px",
              fontWeight: 700,
              margin: "0 0 4px",
            }}
          >
            By Category
          </h2>
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 16px" }}>
            Share of each service type
          </p>

          {isLoading ? (
            <div
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                background: "#F3F4F6",
                animation: "pulse 1.5s ease-in-out infinite",
                margin: "0 auto",
              }}
            />
          ) : pieData.length === 0 ? (
            <div
              style={{
                width: "160px",
                height: "160px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9CA3AF",
                fontSize: "12px",
                margin: "0 auto",
              }}
            >
              No data
            </div>
          ) : (
            <>
              <PieChart width={180} height={160}>
                <Pie
                  data={pieData}
                  cx={90}
                  cy={80}
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
                />
              </PieChart>

              {/* Legend */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginTop: "12px",
                }}
              >
                {pieData.map((entry, i) => (
                  <div
                    key={entry.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "3px",
                        background: PIE_COLORS[i % PIE_COLORS.length],
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{ fontSize: "11px", color: "#6B7280", flex: 1 }}
                    >
                      {entry.name}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
