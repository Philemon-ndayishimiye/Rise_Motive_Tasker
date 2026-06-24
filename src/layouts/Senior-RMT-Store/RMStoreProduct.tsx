//RMStoreProduct

import { useState } from "react";
import { Table } from "../Admin/AdminTable";
import type { Column } from "../Admin/AdminTable";
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../app/api/ProductSpot/Product";
import type { Product } from "../../app/api/ProductSpot/Product";
import { Plus, X, PackageOpen } from "lucide-react";

interface ApiError {
  status: number;
  data: { message?: string; errors?: unknown };
}

// ── Unit Types (from Prisma enum) ──────────────────────────────────────────

const UNIT_TYPES = [
  "PIECE",
  "PACK",
  "PACKET",
  "BOX",
  "CARTON",
  "REAM",
  "SHEET",
  "DOZEN",
  "BUNDLE",
  "ROLL",
] as const;

type UnitType = (typeof UNIT_TYPES)[number];

// ── Helpers ────────────────────────────────────────────────────────────────

const EMOJI_MAP: Record<string, string> = {
  "Office Supplies": "📎",
  "Student Materials": "📚",
  "Paper Products": "🗒️",
  "Printing Services": "🪪",
  default: "📦",
};

const getEmoji = (category: string) =>
  EMOJI_MAP[category] ?? EMOJI_MAP["default"];

// ── Parse delivery field (e.g. "from 2 PIECE" → { text: "from 2", unit: "PIECE" })
function parseDelivery(value?: string): { text: string; unit: UnitType } {
  if (!value) return { text: "", unit: "PIECE" };
  const parts = value.trim().split(" ");
  const lastPart = parts[parts.length - 1].toUpperCase();
  if (UNIT_TYPES.includes(lastPart as UnitType)) {
    return {
      text: parts.slice(0, -1).join(" "),
      unit: lastPart as UnitType,
    };
  }
  return { text: value, unit: "PIECE" };
}

function buildDelivery(text: string, unit: UnitType): string {
  if (!text.trim()) return "";
  return `${text.trim()} ${unit}`;
}

// ── Stock Badge ────────────────────────────────────────────────────────────

const StockBadge = ({ inStock }: { inStock?: boolean }) => (
  <span
    style={{
      background: inStock ? "#DCFCE7" : "#FEE2E2",
      color: inStock ? "#14532D" : "#7F1D1D",
      padding: "3px 10px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: 700,
    }}
  >
    {inStock ? "In Stock" : "Out of Stock"}
  </span>
);

// ── Product Image ──────────────────────────────────────────────────────────

const ProductImage = ({ url, name }: { url?: string; name: string }) => {
  if (!url)
    return (
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: "#EFF6FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
        {getEmoji("")}
      </div>
    );
  return (
    <img
      src={url}
      alt={name}
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        objectFit: "cover",
        border: "1px solid #DBEAFE",
      }}
    />
  );
};

// ── Shared Styles ──────────────────────────────────────────────────────────

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div style={{ marginBottom: 14 }}>
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 700,
        color: "#374151",
        marginBottom: 5,
      }}
    >
      {label}
    </label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid #BFDBFE",
  fontSize: 13,
  color: "#1E3A8A",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};

// ── Delivery Field Component ───────────────────────────────────────────────
// Combined text input + unit type selector in one row

function DeliveryField({
  label,
  value,
  onChange,
  placeholder,
  showUnit = true, // ← new prop, default true
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  showUnit?: boolean; // ← new prop
}) {
  const parsed = parseDelivery(value);
  const [text, setText] = useState(parsed.text);
  const [unit, setUnit] = useState<UnitType>(parsed.unit);

  const handleText = (val: string) => {
    setText(val);
    onChange(showUnit ? buildDelivery(val, unit) : val);
  };

  const handleUnit = (val: UnitType) => {
    setUnit(val);
    onChange(buildDelivery(text, val));
  };

  return (
    <Field label={label}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{ ...inputStyle, flex: 1 }}
          value={text}
          onChange={(e) => handleText(e.target.value)}
          placeholder={placeholder ?? "e.g. from 2"}
        />
        {showUnit && (
          <select
            style={{
              ...inputStyle,
              width: "auto",
              minWidth: 110,
              flex: "none",
              paddingRight: 8,
            }}
            value={unit}
            onChange={(e) => handleUnit(e.target.value as UnitType)}
          >
            {UNIT_TYPES.map((u) => (
              <option key={u} value={u}>
                {u.charAt(0) + u.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        )}
      </div>
      {text && (
        <p style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
          Preview:{" "}
          <strong style={{ color: "#1E3A8A" }}>
            {showUnit ? buildDelivery(text, unit) : text}
          </strong>
        </p>
      )}
    </Field>
  );
}

// ── Form Data ──────────────────────────────────────────────────────────────

interface ProductFormData {
  name: string;
  description: string;
  pricePerUnit: string;
  priceWholesale: string;
  deliveryRetail: string;
  deliveryWholesale: string;
  category: string;
  inStock: boolean;
  imageFile?: File | null;
}

// ── Add / Edit Modal ───────────────────────────────────────────────────────

function ProductModal({
  mode,
  initial,
  onClose,
  onSave,
  isLoading,
}: {
  mode: "add" | "edit";
  initial?: Product;
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void>;
  isLoading: boolean;
}) {
  const [form, setForm] = useState<ProductFormData>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    pricePerUnit: initial?.pricePerUnit ?? "",
    priceWholesale: initial?.priceWholesale ?? "",
    deliveryRetail: initial?.deliveryRetail ?? "",
    deliveryWholesale: initial?.deliveryWholesale ?? "",
    category: initial?.category ?? "",
    inStock: initial?.inStock ?? true,
    imageFile: null,
  });
  const [preview, setPreview] = useState<string | null>(
    initial?.imageUrl ?? null,
  );
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set("imageFile", file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category) {
      setError("Name and Category are required.");
      return;
    }
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err: unknown) {
      const e = err as ApiError;
      setError(e?.data?.message ?? "Something went wrong.");
    }
  };

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
          maxWidth: 480,
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
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1E3A8A" }}>
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </span>
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
          {/* Image upload */}
          <Field label="Product Image">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 10,
                    objectFit: "cover",
                    border: "1px solid #BFDBFE",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 10,
                    background: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px dashed #BFDBFE",
                  }}
                >
                  <PackageOpen size={22} color="#93C5FD" />
                </div>
              )}
              <label
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "1px solid #BFDBFE",
                  background: "#EFF6FF",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#1E3A8A",
                  cursor: "pointer",
                }}
              >
                {preview ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </Field>

          {/* Name + Category */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Field label="Product Name *">
              <input
                style={inputStyle}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. A4 Paper Ream"
              />
            </Field>
            <Field label="Category *">
              <select
                style={inputStyle}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                <option value="">Select...</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Student Materials">Student Materials</option>
                <option value="Paper Products">Paper Products</option>
                <option value="Printing Services">Printing Services</option>
              </select>
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            <textarea
              style={{ ...inputStyle, minHeight: 68, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Short description..."
            />
          </Field>

          {/* Pricing section */}
          <div
            style={{
              background: "#F8FAFF",
              borderRadius: 12,
              padding: 14,
              border: "1px solid #DBEAFE",
              marginBottom: 14,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#1E3A8A",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 12px",
              }}
            >
              Pricing (RWF)
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <Field label="Price Per Unit">
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  value={form.pricePerUnit}
                  onChange={(e) => set("pricePerUnit", e.target.value)}
                  placeholder="e.g. 500"
                />
              </Field>
              <Field label="Wholesale Price">
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  value={form.priceWholesale}
                  onChange={(e) => set("priceWholesale", e.target.value)}
                  placeholder="e.g. 40000"
                />
              </Field>
            </div>
          </div>

          {/* Delivery section */}
          <div
            style={{
              background: "#F8FAFF",
              borderRadius: 12,
              padding: 14,
              border: "1px solid #DBEAFE",
              marginBottom: 14,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#1E3A8A",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 12px",
              }}
            >
              Delivery Conditions
            </p>

            <DeliveryField
              label="Retail Delivery (starts from)"
              value={form.deliveryRetail}
              onChange={(val) => set("deliveryRetail", val)}
              placeholder="e.g. from 2"
            />

            <DeliveryField
              label="Wholesale Delivery (available)"
              value={form.deliveryWholesale}
              onChange={(val) => set("deliveryWholesale", val)}
              placeholder="Available"
              showUnit={false}
            />
          </div>

          {/* Stock toggle */}
          <Field label="Stock Status">
            <select
              style={inputStyle}
              value={form.inStock ? "true" : "false"}
              onChange={(e) => set("inStock", e.target.value === "true")}
            >
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>
          </Field>

          {error && (
            <p style={{ fontSize: 12, color: "#DC2626", marginBottom: 12 }}>
              {error}
            </p>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
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
              onClick={handleSubmit}
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
              {isLoading
                ? "Saving..."
                : mode === "add"
                  ? "Add Product"
                  : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function RMStoreProduct() {
  const { data, isLoading, isError } = useGetAllProductsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [showAdd, setShowAdd] = useState(false);
  const [editRow, setEditRow] = useState<Product | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  // ── Handlers ───────────────────────────────────────────────────────────

  const handleDelete = async (row: Product) => {
    setDeleteError(null);
    try {
      await deleteProduct(row.id).unwrap();
    } catch {
      setDeleteError("Failed to delete product. Please try again.");
    }
  };

  const buildFormData = (form: ProductFormData, userId?: number): FormData => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description ?? "");
    fd.append("category", form.category);
    fd.append("inStock", String(form.inStock));
    if (form.pricePerUnit) fd.append("pricePerUnit", form.pricePerUnit);
    if (form.priceWholesale) fd.append("priceWholesale", form.priceWholesale);
    if (form.deliveryRetail) fd.append("deliveryRetail", form.deliveryRetail);
    if (form.deliveryWholesale)
      fd.append("deliveryWholesale", form.deliveryWholesale);
    if (userId) fd.append("taskerId", String(userId));
    if (form.imageFile) fd.append("imageUrl", form.imageFile);
    return fd;
  };

  const handleAdd = async (form: ProductFormData) => {
    const user = JSON.parse(localStorage.getItem("user") ?? "{}");
    const fd = buildFormData(form, user?.id);
    await createProduct(fd).unwrap();
  };

  const handleEdit = async (form: ProductFormData) => {
    if (!editRow) return;
    const fd = buildFormData(form);
    await updateProduct({ id: editRow.id, formData: fd }).unwrap();
  };

  // ── Columns ────────────────────────────────────────────────────────────

  const columns: Column<Product>[] = [
    {
      key: "imageUrl",
      label: "Image",
      render: (row) => <ProductImage url={row.imageUrl} name={row.name} />,
    },
    {
      key: "name",
      label: "Product Name",
      render: (row) => (
        <div>
          <p
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: "#1E3A8A",
              margin: 0,
            }}
          >
            {row.name}
          </p>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
            {getEmoji(row.category)} {row.category}
          </p>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (row) => (
        <span
          style={{
            fontSize: 12,
            color: "#6B7280",
            maxWidth: 180,
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {row.description || "—"}
        </span>
      ),
    },
    {
      key: "pricePerUnit",
      label: "Per Unit",
      render: (row) => (
        <span style={{ fontWeight: 700, fontSize: 13, color: "#1E3A8A" }}>
          {row.pricePerUnit
            ? `${Number(row.pricePerUnit).toLocaleString()} RWF`
            : "—"}
        </span>
      ),
    },
    {
      key: "priceWholesale",
      label: "Wholesale",
      render: (row) => (
        <span style={{ fontSize: 12, color: "#6B7280" }}>
          {row.priceWholesale
            ? `${Number(row.priceWholesale).toLocaleString()} RWF`
            : "—"}
        </span>
      ),
    },
    {
      key: "deliveryRetail",
      label: "Retail Delivery",
      render: (row) => (
        <span
          style={{
            fontSize: 11,
            background: "#EFF6FF",
            color: "#1E3A8A",
            padding: "3px 8px",
            borderRadius: 6,
            fontWeight: 600,
          }}
        >
          {row.deliveryRetail || "—"}
        </span>
      ),
    },
    {
      key: "tasker" as keyof Product,
      label: "Papeterie",
      render: (row) =>
        row.tasker ? (
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#1E3A8A",
                margin: 0,
              }}
            >
              {row.tasker.name}
            </p>
            <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
              {row.tasker.papeterieName ?? "—"}
            </p>
          </div>
        ) : (
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>—</span>
        ),
    },
    {
      key: "inStock",
      label: "Stock",
      render: (row) => <StockBadge inStock={row.inStock} />,
    },
    {
      key: "createdAt",
      label: "Date Added",
      render: (row) => (
        <span style={{ fontSize: 12, color: "#6B7280" }}>
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

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="w-full min-w-0">
      <div
        className="mb-6"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 className="font-family-playfair font-bold text-[#1E3A8A] text-[20px]">
            Products
          </h1>
          <p className="font-family-playfair text-gray-500 text-[13px] mt-1">
            Total: <span className="font-bold text-[#1E3A8A]">{total}</span>{" "}
            products
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 18px",
            borderRadius: 10,
            border: "none",
            background: "#1E3A8A",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Plus size={15} />
          Add Product
        </button>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-5">
          <p className="text-red-600 text-[13px]">
            Failed to load products. Please try again.
          </p>
        </div>
      )}
      {deleteError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-5">
          <p className="text-red-600 text-[13px]">{deleteError}</p>
        </div>
      )}

      <Table
        columns={columns}
        data={items}
        itemsPerPage={12}
        isLoading={isLoading}
        onEdit={(row) => setEditRow(row)}
        onDelete={handleDelete}
      />

      {showAdd && (
        <ProductModal
          mode="add"
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
          isLoading={isCreating}
        />
      )}

      {editRow && (
        <ProductModal
          mode="edit"
          initial={editRow}
          onClose={() => setEditRow(null)}
          onSave={handleEdit}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}
