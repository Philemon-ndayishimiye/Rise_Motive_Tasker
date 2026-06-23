import { useState } from "react";
import { Table } from "../Admin/AdminTable";
import type { Column } from "../Admin/AdminTable";
//import type{ProductRequest , UpdateProductRequest} from "../../types/DataTypes";
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

// ── Shared Input ───────────────────────────────────────────────────────────
// Uses your existing app's input style pattern

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

// ── Add / Edit Modal ───────────────────────────────────────────────────────

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  pricePerUnit: string;
  priceWholesale: string;
  deliveryRetail: string;
  deliveryWholesale: string;
  category: string;
  inStock: boolean;
  imageFile?: File | null;
}

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
    price: initial?.price ?? "",
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
      const error = err as ApiError;
      setError(error?.data?.message ?? "Something went wrong.");
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
          maxWidth: 460,
          backgroundColor: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #DBEAFE",
          maxHeight: "90vh",
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
                    fontSize: 24,
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

          <Field label="Product Name *">
            <input
              style={inputStyle}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. A4 Paper Ream"
            />
          </Field>

          <Field label="Description">
            <textarea
              style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Short description..."
            />
          </Field>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Field label="Price (RWF)">
              <input
                style={inputStyle}
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="e.g. 5000"
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
              Pricing
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <Field label="Unit Price (RWF)">
                <input
                  style={inputStyle}
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="e.g. 500"
                />
              </Field>
              <Field label="Price Per Unit (RWF)">
                <input
                  style={inputStyle}
                  value={form.pricePerUnit}
                  onChange={(e) => set("pricePerUnit", e.target.value)}
                  placeholder="e.g. 450"
                />
              </Field>
              <Field label="Wholesale Price(RWF)">
                <input
                  style={inputStyle}
                  value={form.priceWholesale}
                  onChange={(e) => set("priceWholesale", e.target.value)}
                  placeholder="e.g. 40000"
                />
              </Field>
              <Field label="Retail Delivery (type)">
                <input
                  style={inputStyle}
                  value={form.deliveryRetail}
                  onChange={(e) => set("deliveryRetail", e.target.value)}
                  placeholder="e.g. from 3 boxes"
                />
              </Field>
              <Field label="Wholesale Delivery ">
                <input
                  style={{ ...inputStyle, gridColumn: "1 / -1" }}
                  value={form.deliveryWholesale}
                  onChange={(e) => set("deliveryWholesale", e.target.value)}
                  placeholder="e.g. available"
                />
              </Field>
            </div>
          </div>
          {/* 
          <Field label="Stock Status">
            <select
              style={inputStyle}
              value={form.inStock ? "true" : "false"}
              onChange={(e) => set("inStock", e.target.value === "true")}
            >
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>
          </Field> */}

          {error && (
            <p style={{ fontSize: 12, color: "#DC2626", marginBottom: 12 }}>
              {error}
            </p>
          )}

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

export default function StaffMemberProduct() {
  const { data, isLoading, isError } = useGetAllProductsQuery();
  // for debugging purposes

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

  // Add — sends FormData so image uploads to Cloudinary via server.ts route
  const handleAdd = async (form: ProductFormData) => {
    // Get the logged-in tasker's id from localStorage
    const user = JSON.parse(localStorage.getItem("user") ?? "{}");
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description ?? "");
    fd.append("price", form.price);
    fd.append("category", form.category);
    fd.append("inStock", String(form.inStock));
    if (form.pricePerUnit) fd.append("pricePerUnit", form.pricePerUnit);
    if (form.priceWholesale) fd.append("priceWholesale", form.priceWholesale);
    if (form.deliveryRetail) fd.append("deliveryRetail", form.deliveryRetail);
    if (form.deliveryWholesale)
      fd.append("deliveryWholesale", form.deliveryWholesale);
    if (user?.id) fd.append("taskerId", String(user.id));
    if (form.imageFile) fd.append("imageUrl", form.imageFile);
    await createProduct(fd).unwrap();
  };

  // Edit — sends JSON (no new file upload in edit for simplicity)
  const handleEdit = async (form: ProductFormData) => {
    if (!editRow) return;
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description ?? "");
    fd.append("price", form.price);
    fd.append("category", form.category);
    fd.append("inStock", String(form.inStock));
    if (form.pricePerUnit) fd.append("pricePerUnit", form.pricePerUnit);
    if (form.priceWholesale) fd.append("priceWholesale", form.priceWholesale);
    if (form.deliveryRetail) fd.append("deliveryRetail", form.deliveryRetail);
    if (form.deliveryWholesale)
      fd.append("deliveryWholesale", form.deliveryWholesale);
    if (form.imageFile) fd.append("imageUrl", form.imageFile);
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
      key: "price",
      label: "Price",
      render: (row) => (
        <span style={{ fontWeight: 700, fontSize: 13, color: "#1E3A8A" }}>
          {row.price ? `${Number(row.price).toLocaleString()} RWF` : "—"}
        </span>
      ),
    },
    {
      key: "pricePerUnit" as keyof Product,
      label: "Per Unit",
      render: (row) => (
        <span style={{ fontSize: 12, color: "#6B7280" }}>
          {row.pricePerUnit
            ? `${Number(row.pricePerUnit).toLocaleString()} RWF`
            : "—"}
        </span>
      ),
    },
    {
      key: "priceWholesale" as keyof Product,
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
      key: "tasker" as keyof Product,
      label: "Papeterie / Owner",
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
      {/* Header */}
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

        {/*  Add button */}
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

      {/* Errors */}
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

      {/* Table */}
      <Table
        columns={columns}
        data={items}
        itemsPerPage={12}
        isLoading={isLoading}
        onEdit={(row) => setEditRow(row)}
        onDelete={handleDelete}
      />

      {/* Add Modal */}
      {showAdd && (
        <ProductModal
          mode="add"
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
          isLoading={isCreating}
        />
      )}

      {/* Edit Modal */}
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
