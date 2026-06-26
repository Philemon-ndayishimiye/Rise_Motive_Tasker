import { useState } from "react";
import { Pencil, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

export interface Column<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T extends { id: number | string }> {
  columns: Column<T>[];
  data: T[];
  itemsPerPage?: number;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  isLoading?: boolean;
}

// ── Confirm Modal ──────────────────────────────────────────────────────────

function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  type,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  type: "delete" | "edit";
}) {
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
          maxWidth: "360px",
          backgroundColor: "#fff",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid #DBEAFE",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: type === "delete" ? "#FEF2F2" : "#EFF6FF",
            borderBottom: `1px solid ${type === "delete" ? "#FECACA" : "#BFDBFE"}`,
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontFamily: "Playfair Display",
              fontSize: "15px",
              color: type === "delete" ? "#B91C1C" : "#1E3A8A",
            }}
          >
            {title}
          </span>
          <button
            onClick={onCancel}
            style={{
              width: "28px",
              height: "28px",
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
        <div style={{ padding: "20px" }}>
          <p
            style={{
              fontSize: "13px",
              color: "#4B5563",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {message}
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                background: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "Playfair Display",
                color: "#6B7280",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: type === "delete" ? "#EF4444" : "#1E3A8A",
                fontSize: "13px",
                fontWeight: 700,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {type === "delete" ? "Yes, Delete" : "Yes, Edit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Table ─────────────────────────────────────────────────────────────

export function Table<T extends { id: number | string }>({
  columns,
  data,
  itemsPerPage = 13,
  onEdit,
  onDelete,
  isLoading = false,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [gotoInput, setGotoInput] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    type: "edit" | "delete";
    row: T;
  } | null>(null);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = data.slice(startIdx, startIdx + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleConfirm = () => {
    if (!confirmModal) return;
    if (confirmModal.type === "edit") onEdit?.(confirmModal.row);
    if (confirmModal.type === "delete") onDelete?.(confirmModal.row);
    setConfirmModal(null);
  };

  const getValue = (row: T, key: string): string => {
    const val = (row as Record<string, unknown>)[key];
    if (val === null || val === undefined) return "—";
    return String(val);
  };

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    )
      pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const showActions = !!(onEdit || onDelete);

  return (
    <>
      {/* ── Outer card ── */}
      <div
       className="border border-blue-800"
        style={{
          width: "100%",
          minWidth: 0,
          
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        {/* ── Scrollable area — only this scrolls ── */}
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: "calc(100vh - 210px)",
          }}
        >
          <table
            style={{
              borderCollapse: "collapse",
              tableLayout: "auto",
              whiteSpace: "nowrap",
              width: "max-content",
              minWidth: "100%",
            }}
          >
            {/* ── Head sticky ── */}
            <thead>
              <tr
                className="bg-blue-800"
                style={{
                 // position: "sticky",
                  top: 0,
                  zIndex: 5,
                  
                  borderBottom: "1px solid #BFDBFE",
                }}
              >
                {columns.map((col) => (
                  <th
                    className="bg-blue-800"
                    key={String(col.key)}
                    style={{
                      padding: "7px 10px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#ffffff",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      
                      width: col.width ?? "auto",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
                {showActions && (
                  <th
                    className="bg-blue-800"
                    style={{
                      padding: "11px 16px",
                      textAlign: "right",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#ffffff",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      
                      whiteSpace: "nowrap",
                    }}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            {/* ── Body ── */}
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + (showActions ? 1 : 0)}
                    style={{
                      textAlign: "center",
                      padding: "56px 16px",
                      color: "#9CA3AF",
                      fontSize: "14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <svg
                        style={{
                          width: "16px",
                          height: "16px",
                          animation: "spin 1s linear infinite",
                        }}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#1E3A8A"
                          strokeWidth="3"
                          opacity=".2"
                        />
                        <path
                          fill="#1E3A8A"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          opacity=".75"
                        />
                      </svg>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (showActions ? 1 : 0)}
                    style={{
                      textAlign: "center",
                      padding: "56px 16px",
                      color: "#9CA3AF",
                      fontSize: "14px",
                    }}
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                paginated.map((row, idx) => (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#ffffff" : "#F8FAFF",
                      borderBottom: "1px solid #DBEAFE",
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      ((
                        e.currentTarget as HTMLTableRowElement
                      ).style.backgroundColor = "#EFF6FF")
                    }
                    onMouseLeave={(e) =>
                      ((
                        e.currentTarget as HTMLTableRowElement
                      ).style.backgroundColor =
                        idx % 2 === 0 ? "#ffffff" : "#F8FAFF")
                    }
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        style={{
                          padding: "11px 16px",
                          fontSize: "13px",
                          color: "#374151",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {col.render
                          ? col.render(row)
                          : getValue(row, String(col.key))}
                      </td>
                    ))}
                    {showActions && (
                      <td style={{ padding: "11px 16px", textAlign: "right" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: "6px",
                          }}
                        >
                          {onEdit && (
                            <button
                              onClick={() =>
                                setConfirmModal({ type: "edit", row })
                              }
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "7px",
                                border: "1px solid #BFDBFE",
                                background: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                              }}
                            >
                              <Pencil size={12} color="#1E3A8A" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() =>
                                setConfirmModal({ type: "delete", row })
                              }
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "7px",
                                border: "1px solid #FECACA",
                                background: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                              }}
                            >
                              <Trash2 size={12} color="#EF4444" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination — outside scroll, always visible ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            padding: "12px 16px",
            borderTop: "1px solid #DBEAFE",
            backgroundColor: "#fff",
          }}
        >
          {/* Info */}
          <span style={{ fontSize: "12px", color: "#6B7280" }}>
            {data.length === 0 ? (
              "No results"
            ) : (
              <>
                {startIdx + 1}–{Math.min(startIdx + itemsPerPage, data.length)}{" "}
                of <strong style={{ color: "#1E3A8A" }}>{data.length}</strong>
              </>
            )}
          </span>

          {/* Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flexWrap: "wrap",
            }}
          >
            {/* Prev */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "7px",
                border: "1px solid #BFDBFE",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.4 : 1,
              }}
            >
              <ChevronLeft size={13} color="#1E3A8A" />
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span
                  key={`d${idx}`}
                  style={{
                    fontSize: "13px",
                    color: "#9CA3AF",
                    padding: "0 4px",
                  }}
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page as number)}
                  style={{
                    minWidth: "30px",
                    height: "30px",
                    borderRadius: "7px",
                    border:
                      currentPage === page
                        ? "1px solid #1E3A8A"
                        : "1px solid #BFDBFE",
                    background: currentPage === page ? "#1E3A8A" : "#fff",
                    color: currentPage === page ? "#fff" : "#1E3A8A",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    padding: "0 6px",
                  }}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "7px",
                border: "1px solid #BFDBFE",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.4 : 1,
              }}
            >
              <ChevronRight size={13} color="#1E3A8A" />
            </button>

            {/* Go to page */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginLeft: "8px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#6B7280" }}>Go to</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={gotoInput}
                onChange={(e) => setGotoInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    goToPage(Number(gotoInput));
                    setGotoInput("");
                  }
                }}
                style={{
                  width: "44px",
                  height: "30px",
                  border: "1px solid #BFDBFE",
                  borderRadius: "7px",
                  textAlign: "center",
                  fontSize: "13px",
                  color: "#1E3A8A",
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirm Modal ── */}
      {confirmModal && (
        <ConfirmModal
          type={confirmModal.type}
          title={
            confirmModal.type === "delete" ? "Confirm delete" : "Confirm edit"
          }
          message={
            confirmModal.type === "delete"
              ? "Are you sure you want to delete this item? This action cannot be undone."
              : "Are you sure you want to edit this item?"
          }
          onConfirm={handleConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </>
  );
}
