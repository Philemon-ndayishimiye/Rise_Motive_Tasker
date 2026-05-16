import { useState } from "react";
import { Table } from "../Admin/AdminTable";
import type { Column } from "../Admin/AdminTable";
import { useGetMyServicesQuery } from "../../app/api/Auth/Tasker";
import type { ServiceRequest } from "../../app/api/Auth/Tasker";
import {
  Globe,
  FileText,
  Palette,
  Code,
  Scale,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  UserCheck,
  Filter,
  LayoutGrid,
} from "lucide-react";

// ── Status badge ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ServiceRequest["status"],
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

function StatusBadge({ status }: { status: ServiceRequest["status"] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
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
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ── Category tab config ─────────────────────────────────────────────────────

type CategoryKey =
  | "all"
  | "egov"
  | "applicationDocs"
  | "creativeMedia"
  | "webDigital"
  | "legal";

interface TabConfig {
  key: CategoryKey;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

const TABS: TabConfig[] = [
  {
    key: "all",
    label: "All Services",
    icon: <LayoutGrid size={13} />,
    color: "#1E3A8A",
    bg: "#EFF6FF",
  },
  {
    key: "egov",
    label: "e-Government",
    icon: <Globe size={13} />,
    color: "#92400E",
    bg: "#FEF9C3",
  },
  {
    key: "applicationDocs",
    label: "App & Docs",
    icon: <FileText size={13} />,
    color: "#0369A1",
    bg: "#E0F2FE",
  },
  {
    key: "creativeMedia",
    label: "Creative Media",
    icon: <Palette size={13} />,
    color: "#9D174D",
    bg: "#FCE7F3",
  },
  {
    key: "webDigital",
    label: "Web & Digital",
    icon: <Code size={13} />,
    color: "#854D0E",
    bg: "#FEF9C3",
  },
  {
    key: "legal",
    label: "Legal",
    icon: <Scale size={13} />,
    color: "#14532D",
    bg: "#DCFCE7",
  },
];

// ── Table columns ───────────────────────────────────────────────────────────

const columns: Column<ServiceRequest>[] = [
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
        {row.trackingCode}
      </span>
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
    render: (row) => <StatusBadge status={row.status} />,
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
        {new Date(row.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
  },
];

// ── Status filter bar ───────────────────────────────────────────────────────

type StatusFilter = "ALL" | ServiceRequest["status"];

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "ASSIGNED", label: "Assigned" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

// ── Main Component ──────────────────────────────────────────────────────────

export default function TaskerServiceRequests() {
  const { data, isLoading, isError, refetch, isFetching } =
    useGetMyServicesQuery();
  const [activeTab, setActiveTab] = useState<CategoryKey>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  // Merge all services into a flat array with category label
  const allServices: (ServiceRequest & { _category: string })[] = data
    ? [
        ...data.services.egov.map((s) => ({ ...s, _category: "e-Government" })),
        ...data.services.applicationDocs.map((s) => ({
          ...s,
          _category: "App & Docs",
        })),
        ...data.services.creativeMedia.map((s) => ({
          ...s,
          _category: "Creative Media",
        })),
        ...data.services.webDigital.map((s) => ({
          ...s,
          _category: "Web & Digital",
        })),
        ...data.services.legal.map((s) => ({ ...s, _category: "Legal" })),
      ]
    : [];

  const getCategoryData = (): ServiceRequest[] => {
    if (!data) return [];
    let base: ServiceRequest[];
    switch (activeTab) {
      case "egov":
        base = data.services.egov;
        break;
      case "applicationDocs":
        base = data.services.applicationDocs;
        break;
      case "creativeMedia":
        base = data.services.creativeMedia;
        break;
      case "webDigital":
        base = data.services.webDigital;
        break;
      case "legal":
        base = data.services.legal;
        break;
      default:
        base = allServices;
    }
    if (statusFilter === "ALL") return base;
    return base.filter((s) => s.status === statusFilter);
  };

  const tableData = getCategoryData();

  const getTabCount = (key: CategoryKey): number => {
    if (!data) return 0;
    switch (key) {
      case "egov":
        return data.summary.egov;
      case "applicationDocs":
        return data.summary.applicationDocs;
      case "creativeMedia":
        return data.summary.creativeMedia;
      case "webDigital":
        return data.summary.webDigital;
      case "legal":
        return data.summary.legal;
      default:
        return data.summary.totalAssigned;
    }
  };

  return (
    <div className="w-full min-w-0">
      {/* ── Header ── */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
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
              <strong style={{ color: "#1E3A8A" }}>
                {data.summary.totalAssigned}
              </strong>{" "}
              total assigned service
              {data.summary.totalAssigned !== 1 ? "s" : ""}
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

      {/* ── Error state ── */}
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
          marginBottom: "16px",
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
                gap: "6px",
                padding: "7px 14px",
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
                  padding: "1px 7px",
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

      {/* ── Status filter row ── */}
      <div
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
          }}
        >
          <Filter size={12} /> Filter:
        </span>
        {STATUS_FILTERS.map((sf) => {
          const isActive = statusFilter === sf.key;
          const cfg =
            sf.key !== "ALL"
              ? STATUS_CONFIG[sf.key as ServiceRequest["status"]]
              : null;
          return (
            <button
              key={sf.key}
              onClick={() => setStatusFilter(sf.key)}
              style={{
                padding: "4px 12px",
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

        {/* Result count */}
        {!isLoading && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: "12px",
              color: "#9CA3AF",
            }}
          >
            Showing{" "}
            <strong style={{ color: "#1E3A8A" }}>{tableData.length}</strong>{" "}
            request{tableData.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Table ── */}
      <Table
        columns={columns}
        data={tableData}
        itemsPerPage={12}
        isLoading={isLoading}
      />

      {/* Spin keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
