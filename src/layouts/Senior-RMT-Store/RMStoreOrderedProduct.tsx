import { useState } from "react";
import { Table } from "../Admin/AdminTable";
import type { Column } from "../Admin/AdminTable";
import {
  useGetMyPaperieOrdersQuery,
  useUpdateOrderMutation,
} from "../../app/api/ProductSpot/Order";
import type { Order } from "../../app/api/ProductSpot/Order";
import {
  X,
  MapPin,
  Phone,
  Mail,
  Package,
  CreditCard,
  FileText,
} from "lucide-react";

// ── Status Badge ───────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: "#FEF9C3", color: "#92400E" },
  CONFIRMED: { bg: "#DBEAFE", color: "#1E3A8A" },
  OUT_FOR_DELIVERY: { bg: "#FEF3C7", color: "#B45309" },
  DELIVERED: { bg: "#D1FAE5", color: "#065F46" },
  CANCELLED: { bg: "#FEE2E2", color: "#7F1D1D" },
};

const StatusBadge = ({ status }: { status?: string }) => {
  const s = status ?? "PENDING";
  const style = STATUS_STYLES[s] ?? STATUS_STYLES["PENDING"];
  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        padding: "3px 10px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {s.replace("_", " ")}
    </span>
  );
};

// ── Product Cell ───────────────────────────────────────────────────────────

const ProductCell = ({ order }: { order: Order }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    {order.product?.imageUrl ? (
      <img
        src={order.product.imageUrl}
        alt={order.product.name}
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          objectFit: "cover",
          border: "1px solid #DBEAFE",
        }}
      />
    ) : (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: "#EFF6FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Package size={14} color="#93C5FD" />
      </div>
    )}
    <div>
      <p style={{ fontSize: 12, fontWeight: 700, color: "#1E3A8A", margin: 0 }}>
        {order.product?.name ?? "—"}
      </p>
      <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
        x{order.quantity}
      </p>
    </div>
  </div>
);

// ── Location Cell ──────────────────────────────────────────────────────────

// const LocationCell = ({ order }: { order: Order }) => {
//   const parts = [
//     order.province,
//     order.district,
//     order.sector,
//     order.cell,
//   ].filter(Boolean);
//   if (!parts.length)
//     return <span style={{ fontSize: 12, color: "#9CA3AF" }}>—</span>;
//   return (
//     <div style={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
//       <MapPin
//         size={12}
//         color="#93C5FD"
//         style={{ marginTop: 2, flexShrink: 0 }}
//       />
//       <span style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.5 }}>
//         {parts.join(", ")}
//       </span>
//     </div>
//   );
// };

// ── Order Detail Modal ─────────────────────────────────────────────────────

function OrderDetailModal({
  row,
  onClose,
  onStatusSave,
  isLoading,
}: {
  row: Order;
  onClose: () => void;
  onStatusSave: (id: number, status: string) => Promise<void>;
  isLoading: boolean;
}) {
  const [status, setStatus] = useState(row.status ?? "PENDING");

  //   const Section = ({
  //     title,
  //     children,
  //   }: {
  //     title: string;
  //     children: React.ReactNode;
  //   }) => (
  //     <div style={{ marginBottom: 16 }}>
  //       <p
  //         style={{
  //           fontSize: 10,
  //           fontWeight: 700,
  //           color: "#1E3A8A",
  //           textTransform: "uppercase",
  //           letterSpacing: "0.07em",
  //           margin: "0 0 8px",
  //         }}
  //       >
  //         {title}
  //       </p>
  //       {children}
  //     </div>
  //   );

  //   const InfoRow = ({
  //     icon,
  //     label,
  //     value,
  //   }: {
  //     icon: React.ReactNode;
  //     label: string;
  //     value?: string | null;
  //   }) => (
  //     <div
  //       style={{
  //         display: "flex",
  //         alignItems: "flex-start",
  //         gap: 8,
  //         marginBottom: 6,
  //       }}
  //     >
  //       <span style={{ color: "#93C5FD", marginTop: 1, flexShrink: 0 }}>
  //         {icon}
  //       </span>
  //       <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
  //         <span style={{ fontSize: 12, color: "#6B7280", minWidth: 90 }}>
  //           {label}
  //         </span>
  //         <span style={{ fontSize: 12, fontWeight: 600, color: "#1E3A8A" }}>
  //           {value || "—"}
  //         </span>
  //       </div>
  //     </div>
  //   );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.35)",
        padding: "0 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          backgroundColor: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #DBEAFE",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#EFF6FF",
            borderBottom: "1px solid #BFDBFE",
            flexShrink: 0,
          }}
        >
          <div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#1E3A8A" }}>
              Order Details
            </span>
            <p style={{ fontSize: 11, color: "#6B7280", margin: "2px 0 0" }}>
              {row.trackingCode}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid #DBEAFE",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={13} color="#6B7280" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, overflowY: "auto" }}>
          {/* Product */}
          <div style={{ marginBottom: 16 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#1E3A8A",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                margin: "0 0 8px",
              }}
            >
              Product
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "#F8FAFF",
                borderRadius: 10,
                padding: 12,
                border: "1px solid #DBEAFE",
              }}
            >
              {row.product?.imageUrl ? (
                <img
                  src={row.product.imageUrl}
                  alt={row.product.name}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    background: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Package size={20} color="#93C5FD" />
                </div>
              )}
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1E3A8A",
                    margin: 0,
                  }}
                >
                  {row.product?.name ?? "—"}
                </p>
                <p
                  style={{ fontSize: 12, color: "#6B7280", margin: "2px 0 0" }}
                >
                  Qty: <b>{row.quantity}</b> &nbsp;·&nbsp; Total:{" "}
                  <b style={{ color: "#1E3A8A" }}>
                    {row.totalPrice.toLocaleString()} RWF
                  </b>
                </p>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div style={{ marginBottom: 16 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#1E3A8A",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                margin: "0 0 8px",
              }}
            >
              Customer
            </p>
            {[
              {
                icon: <Phone size={13} />,
                label: "Name",
                value: row.customerName,
              },
              {
                icon: <Phone size={13} />,
                label: "Phone",
                value: row.customerPhone,
              },
              {
                icon: <Mail size={13} />,
                label: "Email",
                value: row.customerEmail,
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "#93C5FD", marginTop: 1, flexShrink: 0 }}>
                  {icon}
                </span>
                <span style={{ fontSize: 12, color: "#6B7280", minWidth: 90 }}>
                  {label}
                </span>
                <span
                  style={{ fontSize: 12, fontWeight: 600, color: "#1E3A8A" }}
                >
                  {value || "—"}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery */}
          <div style={{ marginBottom: 16 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#1E3A8A",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                margin: "0 0 8px",
              }}
            >
              Delivery Address
            </p>
            {[
              {
                icon: <MapPin size={13} />,
                label: "Province",
                value: row.province,
              },
              {
                icon: <MapPin size={13} />,
                label: "District",
                value: row.district,
              },
              {
                icon: <MapPin size={13} />,
                label: "Sector",
                value: row.sector,
              },
              { icon: <MapPin size={13} />, label: "Cell", value: row.cell },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "#93C5FD", marginTop: 1, flexShrink: 0 }}>
                  {icon}
                </span>
                <span style={{ fontSize: 12, color: "#6B7280", minWidth: 90 }}>
                  {label}
                </span>
                <span
                  style={{ fontSize: 12, fontWeight: 600, color: "#1E3A8A" }}
                >
                  {value || "—"}
                </span>
              </div>
            ))}
          </div>

          {/* Payment & Note */}
          <div style={{ marginBottom: 16 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#1E3A8A",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                margin: "0 0 8px",
              }}
            >
              Payment & Note
            </p>
            {[
              {
                icon: <CreditCard size={13} />,
                label: "Payment",
                value: row.paymentMethod,
              },
              { icon: <FileText size={13} />, label: "Note", value: row.note },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "#93C5FD", marginTop: 1, flexShrink: 0 }}>
                  {icon}
                </span>
                <span style={{ fontSize: 12, color: "#6B7280", minWidth: 90 }}>
                  {label}
                </span>
                <span
                  style={{ fontSize: 12, fontWeight: 600, color: "#1E3A8A" }}
                >
                  {value || "—"}
                </span>
              </div>
            ))}
          </div>
          {/* Status update */}
          <div
            style={{
              background: "#F8FAFF",
              borderRadius: 12,
              padding: 14,
              border: "1px solid #DBEAFE",
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#1E3A8A",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                margin: "0 0 10px",
              }}
            >
              Update Status
            </p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: 10,
                border: "1px solid #BFDBFE",
                fontSize: 13,
                color: "#1E3A8A",
                outline: "none",
                marginBottom: 12,
              }}
            >
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  border: "1px solid #E5E7EB",
                  background: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#6B7280",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => onStatusSave(row.id, status)}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  border: "none",
                  background: "#1E3A8A",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                {isLoading ? "Saving..." : "Save Status"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function RMStoreOrderedProduct() {
  const { data, isLoading, isError } = useGetMyPaperieOrdersQuery();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const [editRow, setEditRow] = useState<Order | null>(null);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  // ── Summary counts ─────────────────────────────────────────────────────
  const counts = {
    PENDING: items.filter((o) => o.status === "PENDING").length,
    CONFIRMED: items.filter((o) => o.status === "CONFIRMED").length,
    DELIVERED: items.filter((o) => o.status === "DELIVERED").length,
    CANCELLED: items.filter((o) => o.status === "CANCELLED").length,
  };

  const grandTotal = items.reduce((sum, o) => sum + (o.totalPrice ?? 0), 0);

  const handleStatusSave = async (id: number, status: string) => {
    try {
      await updateOrder({ id, status }).unwrap();
      setEditRow(null);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // ── Columns ────────────────────────────────────────────────────────────

  const columns: Column<Order>[] = [
    {
      key: "trackingCode",
      label: "Tracking",
      render: (row) => (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#1E3A8A",
            background: "#EFF6FF",
            padding: "3px 8px",
            borderRadius: 6,
          }}
        >
          {row.trackingCode}
        </span>
      ),
    },
    {
      key: "product",
      label: "Product",
      render: (row) => <ProductCell order={row} />,
    },
    {
      key: "customerName",
      label: "Customer",
      render: (row) => (
        <div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#1E3A8A",
              margin: 0,
            }}
          >
            {row.customerName}
          </p>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
            {row.customerPhone}
          </p>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
            {row.customerEmail || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "province",
      label: "Location",
      render: (row) => (
        <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.6 }}>
          <div>{row.province || "—"}</div>
          <div>{row.district || "—"}</div>
          <div>{row.sector || "—"}</div>
          <div>{row.cell || "—"}</div>
        </div>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment",
      render: (row) => (
        <span
          style={{
            fontSize: 11,
            background: "#F3F4F6",
            color: "#374151",
            padding: "3px 8px",
            borderRadius: 6,
            fontWeight: 600,
          }}
        >
          {row.paymentMethod || "—"}
        </span>
      ),
    },
    {
      key: "note",
      label: "Note",
      render: (row) => (
        <span
          style={{
            fontSize: 11,
            color: "#6B7280",
            maxWidth: 120,
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {row.note || "—"}
        </span>
      ),
    },
    {
      key: "totalPrice",
      label: "Total",
      render: (row) => (
        <span style={{ fontSize: 12, fontWeight: 700, color: "#1E3A8A" }}>
          {row.totalPrice?.toLocaleString()} RWF
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "createdAt",
      label: "Created",
      render: (row) => (
        <span style={{ fontSize: 11, color: "#6B7280" }}>
          {new Date(row.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Updated",
      render: (row) => (
        <span style={{ fontSize: 11, color: "#6B7280" }}>
          {new Date(row.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="w-full min-w-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-bold text-blue-800 font-family-playfair text-[20px]">
          My Papeterie Orders
        </h1>
        <p className="text-gray-500 text-[13px] mt-1">
          Total: <span className="font-bold text-[#1E3A8A]">{total}</span>{" "}
          orders
        </p>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: "Pending",
            value: counts.PENDING,
            bg: "#FEF9C3",
            color: "#92400E",
          },
          {
            label: "Confirmed",
            value: counts.CONFIRMED,
            bg: "#DBEAFE",
            color: "#1E3A8A",
          },
          {
            label: "Delivered",
            value: counts.DELIVERED,
            bg: "#D1FAE5",
            color: "#065F46",
          },
          {
            label: "Cancelled",
            value: counts.CANCELLED,
            bg: "#FEE2E2",
            color: "#7F1D1D",
          },
          {
            label: "Revenue",
            value: `${grandTotal.toLocaleString()} RWF`,
            bg: "#EFF6FF",
            color: "#1E3A8A",
          },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: card.bg,
              borderRadius: 12,
              padding: "12px 16px",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: card.color,
                margin: "0 0 4px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {card.label}
            </p>
            <p
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: card.color,
                margin: 0,
              }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Error */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-5">
          <p className="text-red-600 text-[13px]">
            Failed to load orders. Please try again.
          </p>
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        data={items}
        itemsPerPage={10}
        isLoading={isLoading}
        onEdit={(row) => setEditRow(row)}
        onDelete={undefined}
      />

      {/* Detail Modal */}
      {editRow && (
        <OrderDetailModal
          row={editRow}
          onClose={() => setEditRow(null)}
          onStatusSave={handleStatusSave}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}
