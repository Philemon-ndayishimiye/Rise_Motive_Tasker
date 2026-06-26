import {
  Scale,
  Package,
  Users,
  TrendingUp,
  ArrowRight,
  Eye,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ── Sample data ──
const dailyData = [
  { day: "Mon", Services: 12, Products: 8, Students: 5 },
  { day: "Tue", Services: 18, Products: 14, Students: 9 },
  { day: "Wed", Services: 15, Products: 10, Students: 12 },
  { day: "Thu", Services: 25, Products: 20, Students: 18 },
  { day: "Fri", Services: 30, Products: 28, Students: 22 },
  { day: "Sat", Services: 22, Products: 18, Students: 15 },
  { day: "Sun", Services: 35, Products: 32, Students: 28 },
];

const statusData = [
  { name: "Pending", value: 2, color: "#FDF5CA", dot: "#F59E0B" },
  { name: "Assigned", value: 0, color: "#E5EEFE", dot: "#3B82F6" },
  { name: "In Progress", value: 0, color: "#FEF3D3", dot: "#F97316" },
  { name: "Completed", value: 5, color: "#DFFCE0", dot: "#22C55E" },
  { name: "Cancelled", value: 2, color: "#FDE1E0", dot: "#EF4444" },
];

const categoryData = [
  { name: "Requested Service", value: 3, color: "#3B82F6" },
  { name: "Ordered Product", value: 5, color: "#F59E0B" },
  { name: "Information", value: 1, color: "#EC4899" },
  { name: "Immigrtation", value: 0, color: "#8B5CF6" },
  { name: "Civil services", value: 0, color: "#10B981" },
];

const recentTransactions = [
  {
    label: "Requested Service",
    date: "May 29, 2024",
    amount: "+RWF 50,000",
    status: "Completed",
  },
  {
    label: "Information",
    date: "May 26, 2024",
    amount: "+RWF 40,000",
    status: "Completed",
  },
];

const recentServices = [
  {
    label: "Application Assistance ID Application",
    category: "Application & Documentation",
    date: "May 29, 2024",
    status: "Pending",
  },
  {
    label: "Business Registration Support",
    category: "e-Government & Online Services",
    date: "May 27, 2024",
    status: "Completed",
  },
];

const topStatCards = [
  {
    icon: TrendingUp,
    number: 9,
    label: "Informatin",
    bg: "#FEF3C7",
    color: "#1E3A8A",
  },
  {
    icon: Scale,
    number: 12,
    label: "Products",
    bg: "#F0FDF4",
    color: "#065F46",
  },
  {
    icon: Package,
    number: 5,
    label: "Requested Service",
    bg: "#FFF7ED",
    color: "#92400E",
  },
  {
    icon: Users,
    number: 1,
    label: "Ordered Product",
    bg: "#FDF4FF",
    color: "#7E22CE",
  },
];

const STATUS_BADGE: Record<string, { bg: string; color: string }> = {
  Pending: { bg: "#FEF9C3", color: "#92400E" },
  Completed: { bg: "#D1FAE5", color: "#065F46" },
  "In Progress": { bg: "#FEF3C7", color: "#B45309" },
  Cancelled: { bg: "#FEE2E2", color: "#7F1D1D" },
};

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
        borderRadius: 12,
        padding: "10px 14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <p
        style={{
          fontWeight: 700,
          fontSize: 12,
          color: "#111827",
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      {payload.map((e) => (
        <div
          key={e.name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 3,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: e.color,
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: 11, color: "#6B7280" }}>{e.name}:</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>
            {e.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function StaffMemberDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Page Title ── */}
      <h1
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "#1E3A8A",
          margin: 0,
          fontFamily: "Playfair Display, serif",
        }}
      >
        Dashboard Control Panel
      </h1>

      {/* ── Top Stat Cards ── */}
      <div className="bg-blue-50 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 py-4 px-4 font-family-playfair text-sm">
        {topStatCards.map((card) => (
          <div
            className="flex flex-row gap-3"
            key={card.label}
            style={{
              background: "#ffffff",
              border: "1px solid #F3F4F6",
              borderRadius: 14,
              padding: "14px 16px",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: card.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <card.icon size={18} color={card.color} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {card.number}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "#6B7280",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {card.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Status Pills ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {statusData.map((s) => (
          <div
            key={s.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: s.color,
              border: `1px solid ${s.color}`,
              borderRadius: 12,
              padding: "10px 16px",
              minWidth: 100,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: s.dot,
                flexShrink: 0,
              }}
            />
            <div>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {s.value}
              </p>
              <p style={{ fontSize: 10, color: "#6B7280", margin: 0 }}>
                {s.name}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Bar chart — Service Status Breakdown */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #F3F4F6",
            borderRadius: 16,
            padding: "18px 16px",
            gridColumn: "span 1",
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 2px",
            }}
          >
            Service Status Breakdown
          </p>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 14px" }}>
            Distribution of your assigned services by current status
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={statusData}
              margin={{ top: 0, right: 0, left: -30, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F3F4F6"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <button
            style={{
              marginTop: 12,
              fontSize: 11,
              fontWeight: 700,
              color: "#1E3A8A",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            View All Assigned Services <ArrowRight size={12} />
          </button>
        </div>

        {/* Pie chart — By Category */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #F3F4F6",
            borderRadius: 16,
            padding: "18px 16px",
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 2px",
            }}
          >
            By Category
          </p>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 10px" }}>
            Share of each service type
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              marginTop: 8,
            }}
          >
            {categoryData.map((c) => (
              <div
                key={c.name}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: c.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 10, color: "#6B7280" }}>
                  {c.name} ({c.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings Card */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #F3F4F6",
            borderRadius: 16,
            padding: "18px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              My Earnings
            </p>
            <button
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#1E3A8A",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              View All <ArrowRight size={11} />
            </button>
          </div>

          {/* Total earnings banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
              borderRadius: 14,
              padding: "16px",
              color: "#fff",
            }}
          >
            <p style={{ fontSize: 11, margin: "0 0 4px", opacity: 0.8 }}>
              Total Earnings (RWF)
            </p>
            <p style={{ fontSize: 26, fontWeight: 800, margin: "0 0 6px" }}>
              250,000
            </p>
            <p style={{ fontSize: 11, margin: 0, opacity: 0.8 }}>
              This Month &nbsp;
              <span style={{ color: "#86EFAC" }}>↑ 12% vs last month</span>
            </p>
          </div>

          {/* Pending / Withdrawn / Available */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
            }}
          >
            {[
              {
                label: "Pending",
                value: "RWF 50,000",
                bg: "#FEF9C3",
                color: "#92400E",
              },
              {
                label: "Withdrawn",
                value: "RWF 200,000",
                bg: "#DBEAFE",
                color: "#1E3A8A",
              },
              {
                label: "Available",
                value: "RWF 50,000",
                bg: "#D1FAE5",
                color: "#065F46",
              },
            ].map((e) => (
              <div
                key={e.label}
                style={{
                  background: e.bg,
                  borderRadius: 10,
                  padding: "8px 10px",
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: e.color,
                    margin: "0 0 3px",
                    textTransform: "uppercase",
                  }}
                >
                  {e.label}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: e.color,
                    margin: 0,
                  }}
                >
                  {e.value}
                </p>
              </div>
            ))}
          </div>

          {/* Recent Transactions */}
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 8px",
              }}
            >
              Recent Transactions
            </p>
            {recentTransactions.map((t) => (
              <div
                key={t.label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {t.label}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: "#9CA3AF",
                      margin: "1px 0 0",
                    }}
                  >
                    {t.date}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#10B981",
                      margin: 0,
                    }}
                  >
                    {t.amount}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: "#10B981",
                      margin: "1px 0 0",
                    }}
                  >
                    {t.status}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#1E3A8A",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: 0,
            }}
          >
            Go to My Earnings <ArrowRight size={11} />
          </button>
        </div>
      </div>

      {/* ── Area Chart ── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #F3F4F6",
          borderRadius: 16,
          padding: "18px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              Weekly Activity Overview
            </p>
            <p style={{ fontSize: 11, color: "#9CA3AF", margin: "3px 0 0" }}>
              Daily increase across services, products & students — this week
            </p>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[
              { label: "Services", color: "#1E3A8A" },
              { label: "Products", color: "#F59E0B" },
              { label: "Students", color: "#10B981" },
            ].map((item) => (
              <div
                key={item.label}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: item.color,
                  }}
                />
                <span style={{ fontSize: 11, color: "#6B7280" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={dailyData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {[
                { id: "gradServices", color: "#1E3A8A" },
                { id: "gradProducts", color: "#F59E0B" },
                { id: "gradStudents", color: "#10B981" },
              ].map((g) => (
                <linearGradient
                  key={g.id}
                  id={g.id}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={g.color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F3F4F6"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="Services"
              stroke="#1E3A8A"
              strokeWidth={2}
              fill="url(#gradServices)"
              dot={{ fill: "#1E3A8A", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="Products"
              stroke="#F59E0B"
              strokeWidth={2}
              fill="url(#gradProducts)"
              dot={{ fill: "#F59E0B", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="Students"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#gradStudents)"
              dot={{ fill: "#10B981", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Bottom Row: Recent Services + Quick Actions ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Recent Assigned Services */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #F3F4F6",
            borderRadius: 16,
            padding: "18px 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Recent Assigned Services
              </p>
              <p style={{ fontSize: 11, color: "#9CA3AF", margin: "2px 0 0" }}>
                See your latest tasks and their status
              </p>
            </div>
            <button
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#1E3A8A",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              View All <ArrowRight size={11} />
            </button>
          </div>
          {recentServices.map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #F9FAFB",
                gap: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Scale size={14} color="#1E3A8A" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#111827",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.label}
                  </p>
                  <span
                    style={{
                      fontSize: 10,
                      background: "#EFF6FF",
                      color: "#1E3A8A",
                      padding: "1px 7px",
                      borderRadius: 6,
                      fontWeight: 600,
                      display: "inline-block",
                      marginTop: 3,
                    }}
                  >
                    {s.category}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 4,
                  flexShrink: 0,
                }}
              >
                <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>
                  {s.date}
                </p>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: STATUS_BADGE[s.status]?.bg ?? "#F3F4F6",
                    color: STATUS_BADGE[s.status]?.color ?? "#6B7280",
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #F3F4F6",
            borderRadius: 16,
            padding: "18px 20px",
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 4px",
            }}
          >
            Quick Actions
          </p>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 16px" }}>
            Shortcuts to common actions
          </p>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {[
              {
                icon: Scale,
                label: "Service Requests",
                bg: "#EFF6FF",
                color: "#1E3A8A",
              },
              {
                icon: Package,
                label: "View Products",
                bg: "#F0FDF4",
                color: "#065F46",
              },
              {
                icon: Eye,
                label: "View Orders",
                bg: "#FFF7ED",
                color: "#92400E",
              },
              {
                icon: Users,
                label: "Information",
                bg: "#FDF4FF",
                color: "#7E22CE",
              },
            ].map((action) => (
              <button
                key={action.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "18px 12px",
                  borderRadius: 14,
                  background: action.bg,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <action.icon size={18} color={action.color} />
                </div>
                <span
                  style={{ fontSize: 11, fontWeight: 700, color: action.color }}
                >
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
