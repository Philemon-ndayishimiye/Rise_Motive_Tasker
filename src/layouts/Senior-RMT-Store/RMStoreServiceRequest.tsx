import { useState } from "react";
import { Table } from "../Admin/AdminTable";
import type { Column } from "../Admin/AdminTable";
import { useGetAllNewServiceRequestsQuery } from "../../app/api/Taskspot/newservice";
import type {
  NewServiceRequest,
  ServiceCategory,
} from "../../app/api/Taskspot/newservice";
import {
  Globe,
  FileText,
  Palette,
  Code,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  UserCheck,
  Filter,
  LayoutGrid,
  Building2,
  FileCheck,
  Landmark,
  ShieldCheck,
  PenLine,
  Printer,
  Truck,
  Gavel,
  Briefcase,
  HeartPulse,
  HelpCircle,
  Tv,
} from "lucide-react";

// ── Status config ────────────────────────────────────────────────────────────

type RequestStatus =
  | "PENDING"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; bg: string; color: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Pending",
    bg: "#FEF9C3",
    color: "#92400E",
    icon: <Clock size={10} />,
  },
  ASSIGNED: {
    label: "Assigned",
    bg: "#DBEAFE",
    color: "#1E3A8A",
    icon: <UserCheck size={10} />,
  },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "#FEF3C7",
    color: "#B45309",
    icon: <Loader2 size={10} />,
  },
  COMPLETED: {
    label: "Completed",
    bg: "#DCFCE7",
    color: "#14532D",
    icon: <CheckCircle2 size={10} />,
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "#FEE2E2",
    color: "#7F1D1D",
    icon: <XCircle size={10} />,
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as RequestStatus] ?? STATUS_CONFIG.PENDING;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        background: cfg.bg,
        color: cfg.color,
        padding: "3px 10px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ── Category tabs ────────────────────────────────────────────────────────────

type CategoryKey = "ALL" | ServiceCategory;
type StatusFilter = "ALL" | RequestStatus;

interface TabConfig {
  key: CategoryKey;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

const TABS: TabConfig[] = [
  {
    key: "ALL",
    label: "All",
    icon: <LayoutGrid size={13} />,
    color: "#1E3A8A",
    bg: "#EFF6FF",
  },
  {
    key: "IREMBO_CIVIL_STATUS",
    label: "Civil Status",
    icon: <FileCheck size={13} />,
    color: "#92400E",
    bg: "#FEF9C3",
  },
  {
    key: "RDB_BUSINESS_REGISTRATION",
    label: "Business Reg.",
    icon: <Building2 size={13} />,
    color: "#0369A1",
    bg: "#E0F2FE",
  },
  {
    key: "WEB_DEVELOPMENT_HOSTING",
    label: "Web Dev",
    icon: <Code size={13} />,
    color: "#854D0E",
    bg: "#FEF9C3",
  },
  {
    key: "GRAPHIC_DESIGN_BRANDING",
    label: "Design",
    icon: <Palette size={13} />,
    color: "#9D174D",
    bg: "#FCE7F3",
  },
  {
    key: "SOFTWARE_DIGITAL_SOLUTIONS",
    label: "Software",
    icon: <Globe size={13} />,
    color: "#065F46",
    bg: "#ECFDF5",
  },
  {
    key: "MEDIA_PRODUCTION_MARKETING",
    label: "Media",
    icon: <Tv size={13} />,
    color: "#7C3AED",
    bg: "#EDE9FE",
  },
  {
    key: "RDB_LICENSING_INVESTMENT",
    label: "Licensing",
    icon: <Briefcase size={13} />,
    color: "#1E3A8A",
    bg: "#EFF6FF",
  },
  {
    key: "RRA_TAX_REGISTRATION_DEREGISTRATION",
    label: "Tax Reg.",
    icon: <FileText size={13} />,
    color: "#92400E",
    bg: "#FEF9C3",
  },
  {
    key: "RRA_TAX_DECLARATION",
    label: "Tax Decl.",
    icon: <FileCheck size={13} />,
    color: "#0369A1",
    bg: "#E0F2FE",
  },
  {
    key: "RRA_CERTIFICATES_COMPLIANCE",
    label: "RRA Cert.",
    icon: <ShieldCheck size={13} />,
    color: "#14532D",
    bg: "#DCFCE7",
  },
  {
    key: "IREMBO_NIDA_IMMIGRATION",
    label: "NIDA/Immigration",
    icon: <Landmark size={13} />,
    color: "#6D28D9",
    bg: "#EDE9FE",
  },
  {
    key: "WRITING_DOCUMENTATION",
    label: "Writing",
    icon: <PenLine size={13} />,
    color: "#854D0E",
    bg: "#FEF9C3",
  },
  {
    key: "PRINTING_PUBLISHING",
    label: "Printing",
    icon: <Printer size={13} />,
    color: "#9D174D",
    bg: "#FCE7F3",
  },
  {
    key: "GOVERNMENT_CERTIFICATES_PERMITS",
    label: "Gov. Permits",
    icon: <FileCheck size={13} />,
    color: "#065F46",
    bg: "#ECFDF5",
  },
  {
    key: "NLA_LAND_PROPERTY",
    label: "Land/Property",
    icon: <Landmark size={13} />,
    color: "#92400E",
    bg: "#FEF9C3",
  },
  {
    key: "RURA_TRANSPORT_LICENSING",
    label: "Transport",
    icon: <Truck size={13} />,
    color: "#0369A1",
    bg: "#E0F2FE",
  },
  {
    key: "IECMS_LEGAL_COURT",
    label: "Legal/Court",
    icon: <Gavel size={13} />,
    color: "#14532D",
    bg: "#DCFCE7",
  },
  {
    key: "OPPORTUNITIES_APPLICATION_SUPPORT",
    label: "Opportunities",
    icon: <Briefcase size={13} />,
    color: "#6D28D9",
    bg: "#EDE9FE",
  },
  {
    key: "INSURANCE_SUPPORT",
    label: "Insurance",
    icon: <HeartPulse size={13} />,
    color: "#1E3A8A",
    bg: "#EFF6FF",
  },
  {
    key: "OTHER_SERVICES",
    label: "Other",
    icon: <HelpCircle size={13} />,
    color: "#6B7280",
    bg: "#F3F4F6",
  },
];

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "ASSIGNED", label: "Assigned" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

// ── Table columns (desktop) ──────────────────────────────────────────────────

const columns: Column<NewServiceRequest>[] = [
  {
    key: "trackingCode",
    label: "Tracking #",
    render: (row) => (
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "12px",
          fontWeight: 700,
          color: "#1E3A8A",
          background: "#EFF6FF",
          padding: "3px 8px",
          borderRadius: "6px",
          border: "1px solid #BFDBFE",
        }}
      >
        {row.trackingCode ?? "—"}
      </span>
    ),
  },
  {
    key: "category" as keyof NewServiceRequest,
    label: "Category",
    render: (row) =>
      row.category ? (
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#6D28D9",
            background: "#EDE9FE",
            padding: "3px 8px",
            borderRadius: "6px",
            whiteSpace: "nowrap",
          }}
        >
          {row.category.replace(/_/g, " ")}
        </span>
      ) : (
        <span style={{ fontSize: "12px", color: "#9CA3AF" }}>—</span>
      ),
  },
  {
    key: "customerName",
    label: "Customer",
    render: (row) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>
          {row.customerName}
        </span>
        <span style={{ fontSize: "11px", color: "#6B7280" }}>
          {row.customerPhone}
        </span>
        {row.customerEmail && (
          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
            {row.customerEmail}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "service",
    label: "Service",
    render: (row) => (
      <span
        style={{
          fontSize: "12px",
          color: "#374151",
          maxWidth: "160px",
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {row.service ?? "—"}
      </span>
    ),
  },
  {
    key: "description",
    label: "Description",
    render: (row) => (
      <span
        style={{
          fontSize: "12px",
          color: "#6B7280",
          maxWidth: "200px",
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={row.description}
      >
        {row.description}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge status={row.status ?? "pending"} />,
  },
  {
    key: "preferredDate",
    label: "Preferred Date",
    render: (row) => (
      <span style={{ fontSize: "12px", color: "#6B7280" }}>
        {row.preferredDate
          ? new Date(row.preferredDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "—"}
      </span>
    ),
  },
  {
    key: "documentUrl",
    label: "Document",
    render: (row) =>
      row.documentUrl ? (
        <a
          href={row.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#1E3A8A",
            background: "#EFF6FF",
            padding: "3px 10px",
            borderRadius: "6px",
            border: "1px solid #BFDBFE",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          View Doc
        </a>
      ) : (
        <span style={{ fontSize: "12px", color: "#9CA3AF" }}>—</span>
      ),
  },
  {
    key: "createdAt",
    label: "Submitted",
    render: (row) => (
      <span style={{ fontSize: "12px", color: "#6B7280" }}>
        {row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "—"}
      </span>
    ),
  },
];

// ── Mobile card for a single service request ─────────────────────────────────

function MobileServiceCard({ row }: { row: NewServiceRequest }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #DBEAFE",
        borderRadius: "14px",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* Top row: tracking + status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "6px",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            fontWeight: 700,
            color: "#1E3A8A",
            background: "#EFF6FF",
            padding: "3px 8px",
            borderRadius: "6px",
            border: "1px solid #BFDBFE",
          }}
        >
          {row.trackingCode}
        </span>
        <StatusBadge status={row.status ?? "PENDING"} />
      </div>

      {/* Customer */}
      <div>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#111827",
            margin: 0,
          }}
        >
          {row.customerName}
        </p>
        <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0" }}>
          {row.customerPhone}
        </p>
        {row.customerEmail && (
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "1px 0 0" }}>
            {row.customerEmail}
          </p>
        )}
      </div>

      {/* Service + description */}
      {row.service && (
        <p
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#374151",
            margin: 0,
          }}
        >
          {row.service}
        </p>
      )}
      {row.description && (
        <p
          style={{
            fontSize: "12px",
            color: "#6B7280",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {row.description}
        </p>
      )}

      {/* Dates + doc */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "6px",
          borderTop: "1px solid #F3F4F6",
          paddingTop: "10px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {row.preferredDate && (
            <span style={{ fontSize: "11px", color: "#6B7280" }}>
              📅{" "}
              {new Date(row.preferredDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
            Submitted:{" "}
            {row.createdAt
              ? new Date(row.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </span>
        </div>
        {row.documentUrl && (
          <a
            href={row.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#1E3A8A",
              background: "#EFF6FF",
              padding: "4px 12px",
              borderRadius: "6px",
              border: "1px solid #BFDBFE",
              textDecoration: "none",
            }}
          >
            View Doc
          </a>
        )}
      </div>
    </div>
  );
}

// ── Skeleton loader for mobile cards ─────────────────────────────────────────

function MobileCardSkeleton() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #DBEAFE",
        borderRadius: "14px",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {[100, 60, 80, 40].map((w, i) => (
        <div
          key={i}
          style={{
            height: "14px",
            width: `${w}%`,
            background: "#E5E7EB",
            borderRadius: "6px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      ))}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function RMStoreServiceRequests() {
  const { data, isLoading, isError, refetch, isFetching } =
    useGetAllNewServiceRequestsQuery();
  const [activeTab, setActiveTab] = useState<CategoryKey>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  // Get the logged-in tasker's name/id to filter only their requests
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const taskerName: string = user?.fullName ?? "";
  const taskerId: string = String(user?.id ?? "");

  // All items from NewServiceRequest, filtered to this tasker only
  const allItems: NewServiceRequest[] = (data?.items ?? []).filter(
    (s: NewServiceRequest) => s.tasker === taskerName || s.tasker === taskerId,
  );

  const getFilteredData = (): NewServiceRequest[] => {
    const base: NewServiceRequest[] =
      activeTab === "ALL"
        ? allItems
        : allItems.filter((s: NewServiceRequest) => s.category === activeTab);

    return statusFilter === "ALL"
      ? base
      : base.filter((s: NewServiceRequest) => s.status === statusFilter);
  };

  const getTabCount = (key: CategoryKey): number => {
    if (key === "ALL") return allItems.length;
    return allItems.filter((s) => s.category === key).length;
  };

  const tableData = getFilteredData();
  return (
    <div className="w-full min-w-0">
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }

        .mobile-cards { display: none; }
        .desktop-table { display: block; }

        @media (max-width: 768px) {
          .mobile-cards { display: flex; flex-direction: column; gap: 12px; }
          .desktop-table { display: none; }
          .page-header { flex-direction: column; align-items: flex-start !important; }
          .status-filter-row { gap: 6px !important; }
          .result-count { margin-left: 0 !important; width: 100%; }
        }
      `}</style>

      {/* ── Header ── */}
      <div className="page-header mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#1E3A8A",
              margin: 0,
              fontFamily: "Playfair Display, serif",
            }}
          >
            My Service Requests
          </h1>
          {data && (
            <p
              style={{ fontSize: "13px", color: "#6B7280", margin: "4px 0 0" }}
            >
              You have{" "}
              <strong style={{ color: "#1E3A8A" }}>{allItems.length}</strong>{" "}
              total assigned service
              {allItems.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "9px 16px",
            background: "#1E3A8A",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: isFetching ? "not-allowed" : "pointer",
            opacity: isFetching ? 0.7 : 1,
          }}
        >
          <RefreshCw
            size={14}
            style={{
              animation: isFetching ? "spin 1s linear infinite" : "none",
            }}
          />
          Refresh
        </button>
      </div>

      {/* ── Error ── */}
      {isError && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "20px",
            color: "#B91C1C",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          Failed to load your service requests. Please try again.
        </div>
      )}

      {/* ── Category tabs ── */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "14px",
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = getTabCount(tab.key);
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "10px",
                border: isActive
                  ? `1.5px solid ${tab.color}`
                  : "1px solid #DBEAFE",
                background: isActive ? tab.bg : "#fff",
                color: isActive ? tab.color : "#6B7280",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab.icon}
              {tab.label}
              <span
                style={{
                  background: isActive ? tab.color : "#E5E7EB",
                  color: isActive ? "#fff" : "#6B7280",
                  borderRadius: "999px",
                  padding: "1px 6px",
                  fontSize: "10px",
                  fontWeight: 800,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Status filter ── */}
      <div
        className="status-filter-row"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "12px",
            color: "#6B7280",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          <Filter size={12} /> Filter:
        </span>
        {STATUS_FILTERS.map((sf) => {
          const isActive = statusFilter === sf.key;
          const cfg =
            sf.key !== "ALL" ? STATUS_CONFIG[sf.key as RequestStatus] : null;
          return (
            <button
              key={sf.key}
              onClick={() => setStatusFilter(sf.key)}
              style={{
                padding: "4px 11px",
                borderRadius: "8px",
                border: isActive
                  ? `1.5px solid ${cfg?.color ?? "#1E3A8A"}`
                  : "1px solid #E5E7EB",
                background: isActive ? (cfg?.bg ?? "#EFF6FF") : "#fff",
                color: isActive ? (cfg?.color ?? "#1E3A8A") : "#6B7280",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {sf.label}
            </button>
          );
        })}

        {!isLoading && (
          <span
            className="result-count"
            style={{ marginLeft: "auto", fontSize: "12px", color: "#9CA3AF" }}
          >
            Showing{" "}
            <strong style={{ color: "#1E3A8A" }}>{tableData.length}</strong>{" "}
            request{tableData.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Desktop: Table ── */}
      <div className="desktop-table">
        <Table
          columns={columns}
          data={tableData}
          itemsPerPage={12}
          isLoading={isLoading}
        />
      </div>

      {/* ── Mobile: Cards ── */}
      <div className="mobile-cards">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <MobileCardSkeleton key={i} />
          ))
        ) : tableData.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#9CA3AF",
              fontSize: "13px",
            }}
          >
            No requests found.
          </div>
        ) : (
          tableData.map((row) => (
            <MobileServiceCard key={row.trackingCode ?? row.id} row={row} />
          ))
        )}
      </div>
    </div>
  );
}
