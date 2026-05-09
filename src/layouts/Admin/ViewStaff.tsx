import { useState } from "react";
import { Component, type ReactNode } from "react";
import { Table } from "../Admin/AdminTable";
import type { Column } from "../Admin/AdminTable";
import {
  useGetAllAdminsQuery,
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useActivateAdminMutation,
  useDeactivateAdminMutation,
} from "../../app/api/Auth/Admin";
import {
  useGetAllTaskersQuery,
  useCreateTaskerMutation,
  useDeleteTaskerMutation,
  useToggleActivateTaskerMutation,
} from "../../app/api/Auth/Tasker";
import type { Admin, CreateAdminRequest } from "../../app/api/Auth/Admin";
import type { Tasker, CreateTaskerRequest } from "../../app/api/Auth/Tasker";
import {
  Plus,
  X,
  ToggleLeft,
  ToggleRight,
  Users,
  Shield,
  ImagePlus,
  Trash2,
  Link,
} from "lucide-react";

interface ApiError {
  status: number;
  data: { message?: string };
}

// ── Error Boundary ─────────────────────────────────────────────────────────

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, background: "#FEE2E2", borderRadius: 12 }}>
          <p style={{ color: "#7F1D1D", fontWeight: 700 }}>💥 Crash:</p>
          <pre
            style={{ fontSize: 12, color: "#991B1B", whiteSpace: "pre-wrap" }}
          >
            {(this.state.error as Error).message}
            {"\n"}
            {(this.state.error as Error).stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Shared Styles ──────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "9px",
  border: "1px solid #BFDBFE",
  fontSize: "13px",
  color: "#1E3A8A",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  color: "#374151",
  display: "block",
  marginBottom: "5px",
};

const fieldWrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const sectionStyle: React.CSSProperties = {
  background: "#F8FAFF",
  borderRadius: "12px",
  padding: "16px",
  border: "1px solid #DBEAFE",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: "#1E3A8A",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  margin: "0 0 12px",
};

// ── Badges ─────────────────────────────────────────────────────────────────

function ActiveBadge({ active }: { active?: boolean }) {
  return (
    <span
      style={{
        background: active ? "#DCFCE7" : "#FEE2E2",
        color: active ? "#14532D" : "#7F1D1D",
        padding: "3px 10px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 700,
      }}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      style={{
        background: role === "SUPER_ADMIN" ? "#EDE9FE" : "#DBEAFE",
        color: role === "SUPER_ADMIN" ? "#4C1D95" : "#1E3A8A",
        padding: "3px 10px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 700,
      }}
    >
      {role}
    </span>
  );
}

// ── Tasker Avatar Cell ─────────────────────────────────────────────────────

function TaskerAvatar({ name, image }: { name: string; image?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          overflow: "hidden",
          background: "#DBEAFE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          border: "2px solid #BFDBFE",
        }}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#1E3A8A" }}>
            {initials}
          </span>
        )}
      </div>
      <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>
        {name}
      </span>
    </div>
  );
}

// ── Add Admin Modal ────────────────────────────────────────────────────────

function AddAdminModal({
  onClose,
  onSave,
  isLoading,
}: {
  onClose: () => void;
  onSave: (d: CreateAdminRequest) => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState<CreateAdminRequest>({
    fullName: "",
    email: "",
    password: "",
    role: "ADMIN",
  });

  const set = (k: keyof CreateAdminRequest, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: "0 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#fff",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #DBEAFE",
          boxShadow: "0 20px 60px rgba(30,58,138,0.2)",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#1E3A8A",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Shield size={15} color="#fff" />
            <span style={{ fontWeight: 700, fontSize: "15px", color: "#fff" }}>
              Add Admin
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={13} color="#fff" />
          </button>
        </div>

        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={fieldWrap}>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text"
              style={inputStyle}
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              style={inputStyle}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Password *</label>
            <input
              type="password"
              style={inputStyle}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Role</label>
            <select
              style={inputStyle}
              value={form.role}
              onChange={(e) =>
                set("role", e.target.value as "ADMIN" | "SUPER_ADMIN")
              }
            >
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                background: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                color: "#6B7280",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!form.fullName.trim()) {
                  alert("Full name is required.");
                  return;
                }
                if (!form.email.trim()) {
                  alert("Email is required.");
                  return;
                }
                if (!form.password.trim()) {
                  alert("Password is required.");
                  return;
                }
                onSave(form);
              }}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: "#1E3A8A",
                fontSize: "13px",
                fontWeight: 700,
                color: "#fff",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tasker Form State ──────────────────────────────────────────────────────
// imageFile → real File for multipart (create, file-upload mode)
// imageUrl  → string URL (paste URL mode)

interface TaskerFormState {
  name: string;
  title: string;
  phone: string;
  email: string;
  specialties: string;
  isActive: boolean;
  imageFile: File | null;
  imageUrl: string;
}

// ── Add Tasker Modal ───────────────────────────────────────────────────────

function AddTaskerModal({
  onClose,
  onSave,
  isLoading,
}: {
  onClose: () => void;
  onSave: (d: CreateTaskerRequest) => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState<TaskerFormState>({
    name: "",
    title: "",
    phone: "",
    email: "",
    specialties: "",
    isActive: true,
    imageFile: null,
    imageUrl: "",
  });

  // "file" = upload mode, "url" = paste URL mode
  const [imageInputType, setImageInputType] = useState<"file" | "url">("file");
  // preview: object URL (file mode) or the pasted URL string
  const [preview, setPreview] = useState<string>("");

  const set = <K extends keyof TaskerFormState>(k: K, v: TaskerFormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  // Pick a real File → create object URL for preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set("imageFile", file);
    set("imageUrl", "");
    setPreview(URL.createObjectURL(file));
  };

  // Paste a URL → store as imageUrl, show as preview
  const handleUrlChange = (val: string) => {
    set("imageUrl", val);
    set("imageFile", null);
    setPreview(val);
  };

  const clearImage = () => {
    set("imageFile", null);
    set("imageUrl", "");
    setPreview("");
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert("Full name is required.");
      return;
    }
    if (!form.title.trim()) {
      alert("Title is required.");
      return;
    }
    if (!form.phone.trim()) {
      alert("Phone is required.");
      return;
    }
    if (!form.specialties.trim()) {
      alert("Specialties are required.");
      return;
    }

    const payload: CreateTaskerRequest = {
      name: form.name.trim(),
      title: form.title.trim(),
      phone: form.phone.trim(),
      specialties: form.specialties.trim(),
      isActive: form.isActive,
      ...(form.email.trim() ? { email: form.email.trim() } : {}),
      // Pass the File or URL — RTK mutation will build FormData
      ...(form.imageFile ? { imageFile: form.imageFile } : {}),
      ...(form.imageUrl && !form.imageFile ? { image: form.imageUrl } : {}),
    };

    console.log("📦 Tasker payload keys:", Object.keys(payload));
    onSave(payload);
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
        backgroundColor: "rgba(0,0,0,0.45)",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#fff",
          borderRadius: "18px",
          overflow: "hidden",
          border: "1px solid #DBEAFE",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(30,58,138,0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#1E3A8A",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Users size={15} color="#fff" />
            <span style={{ fontWeight: 700, fontSize: "15px", color: "#fff" }}>
              Add Tasker
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={13} color="#fff" />
          </button>
        </div>

        {/* Scrollable body */}
        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Cover Image */}
          <div style={sectionStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <p style={{ ...sectionTitle, margin: 0 }}>Profile Photo</p>
              <div style={{ display: "flex", gap: "6px" }}>
                {(["file", "url"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setImageInputType(t);
                      clearImage();
                    }}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "6px",
                      border: "1px solid #BFDBFE",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                      background: imageInputType === t ? "#1E3A8A" : "#EFF6FF",
                      color: imageInputType === t ? "#fff" : "#1E3A8A",
                    }}
                  >
                    {t === "file" ? "📁 Upload File" : "🔗 Paste URL"}
                  </button>
                ))}
              </div>
            </div>

            {/* FILE UPLOAD MODE */}
            {imageInputType === "file" && (
              <div>
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "24px",
                    border: "2px dashed #BFDBFE",
                    borderRadius: "12px",
                    cursor: "pointer",
                    background: "#EFF6FF",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="preview"
                        style={{
                          width: "100%",
                          maxHeight: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <span style={{ fontSize: "11px", color: "#6B7280" }}>
                        Click to replace
                      </span>
                    </>
                  ) : (
                    <>
                      <ImagePlus size={30} color="#93C5FD" />
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#6B7280",
                          fontWeight: 600,
                        }}
                      >
                        Click to upload photo
                      </span>
                      <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
                        PNG, JPG, WEBP
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0,
                      cursor: "pointer",
                    }}
                  />
                </label>
                {preview && (
                  <button
                    onClick={clearImage}
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      background: "none",
                      border: "none",
                      color: "#EF4444",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={12} /> Remove photo
                  </button>
                )}
              </div>
            )}

            {/* URL PASTE MODE */}
            {imageInputType === "url" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ position: "relative" }}>
                  <Link
                    size={13}
                    color="#9CA3AF"
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <input
                    style={{ ...inputStyle, paddingLeft: "30px" }}
                    value={form.imageUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                {preview && (
                  <div style={{ position: "relative" }}>
                    <img
                      src={preview}
                      alt="preview"
                      onError={() => setPreview("")}
                      style={{
                        width: "100%",
                        maxHeight: "160px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        border: "1px solid #DBEAFE",
                      }}
                    />
                    <button
                      onClick={clearImage}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid #FEE2E2",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "#EF4444",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      <Trash2 size={11} /> Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div style={sectionStyle}>
            <p style={sectionTitle}>Basic Information</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div style={fieldWrap}>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle}>Title *</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Senior Developer"
                />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle}>Phone *</label>
                <input
                  type="tel"
                  style={inputStyle}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+250 7xx xxx xxx"
                />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle}>
                  Email{" "}
                  <span style={{ fontWeight: 400, color: "#9CA3AF" }}>
                    (optional)
                  </span>
                </label>
                <input
                  type="email"
                  style={inputStyle}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="tasker@example.com"
                />
              </div>
              <div style={{ ...fieldWrap, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Specialties *</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={form.specialties}
                  onChange={(e) => set("specialties", e.target.value)}
                  placeholder="e.g. Web, Design, Legal"
                />
                <p
                  style={{
                    fontSize: "11px",
                    color: "#9CA3AF",
                    margin: "4px 0 0",
                  }}
                >
                  Separate multiple specialties with commas.
                </p>
              </div>
            </div>
          </div>

          {/* Status toggle */}
          <div
            style={{
              ...sectionStyle,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#374151",
                  margin: 0,
                }}
              >
                Active immediately
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "#9CA3AF",
                  margin: "2px 0 0",
                }}
              >
                Tasker will be visible to users when active
              </p>
            </div>
            <div
              onClick={() => set("isActive", !form.isActive)}
              style={{
                width: "44px",
                height: "24px",
                borderRadius: "999px",
                cursor: "pointer",
                background: form.isActive ? "#1E3A8A" : "#D1D5DB",
                position: "relative",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "3px",
                  left: form.isActive ? "23px" : "3px",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                background: "#fff",
                fontSize: "13px",
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
                flex: 2,
                padding: "11px",
                borderRadius: "10px",
                border: "none",
                background: isLoading ? "#93C5FD" : "#1E3A8A",
                fontSize: "13px",
                fontWeight: 700,
                color: "#fff",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Creating..." : "Create Tasker"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab ────────────────────────────────────────────────────────────────────

function Tab({
  label,
  icon,
  active,
  count,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        background: active ? "#1E3A8A" : "#EFF6FF",
        color: active ? "#fff" : "#1E3A8A",
        fontSize: "13px",
        fontWeight: 700,
        transition: "all 0.15s",
      }}
    >
      {icon}
      {label}
      <span
        style={{
          background: active ? "rgba(255,255,255,0.25)" : "#BFDBFE",
          color: active ? "#fff" : "#1E3A8A",
          borderRadius: "999px",
          padding: "1px 8px",
          fontSize: "11px",
          fontWeight: 700,
        }}
      >
        {count}
      </span>
    </button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function Staff() {
  const [activeTab, setActiveTab] = useState<"admins" | "taskers">("admins");
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showAddTasker, setShowAddTasker] = useState(false);

  const {
    data: adminsData,
    isLoading: adminsLoading,
    isError: adminsError,
  } = useGetAllAdminsQuery();
  const {
    data: taskersData,
    isLoading: taskersLoading,
    isError: taskersError,
  } = useGetAllTaskersQuery();

  const [createAdmin, { isLoading: isCreatingAdmin }] =
    useCreateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();
  const [activateAdmin] = useActivateAdminMutation();
  const [deactivateAdmin] = useDeactivateAdminMutation();

  const [createTasker, { isLoading: isCreatingTasker }] =
    useCreateTaskerMutation();
  const [deleteTasker] = useDeleteTaskerMutation();
  const [toggleTasker] = useToggleActivateTaskerMutation();

  const admins = adminsData ?? [];
  const taskers = taskersData ?? [];

  const handleCreateAdmin = async (data: CreateAdminRequest) => {
    try {
      await createAdmin(data).unwrap();
      setShowAddAdmin(false);
    } catch (err: unknown) {
      const e = err as ApiError;
      alert(e?.data?.message ?? "Failed to create admin.");
    }
  };

  const handleCreateTasker = async (data: CreateTaskerRequest) => {
    try {
      await createTasker(data).unwrap();
      console.log("✅ Tasker created successfully");
      setShowAddTasker(false);
    } catch (err: unknown) {
      const e = err as ApiError;
      alert(e?.data?.message ?? "Failed to create tasker.");
    }
  };

  const handleToggleAdmin = async (row: Admin) => {
    try {
      if (row.isActive) await deactivateAdmin(row.id).unwrap();
      else await activateAdmin(row.id).unwrap();
    } catch {
      alert("Failed to toggle admin status.");
    }
  };

  const handleToggleTasker = async (id: number) => {
    try {
      await toggleTasker(id).unwrap();
    } catch {
      alert("Failed to toggle tasker status.");
    }
  };

  // ── Column Definitions ───────────────────────────────────────────────────

  const adminColumns: Column<Admin>[] = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (row) => <RoleBadge role={row.role} />,
    },
    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ActiveBadge active={row.isActive} />
          <button
            onClick={() => handleToggleAdmin(row)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
            }}
          >
            {row.isActive ? (
              <ToggleRight size={20} color="#1E3A8A" />
            ) : (
              <ToggleLeft size={20} color="#9CA3AF" />
            )}
          </button>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (row) => (
        <span style={{ fontSize: "13px", color: "#6B7280" }}>
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

  const taskerColumns: Column<Tasker>[] = [
    {
      key: "name",
      label: "Tasker",
      render: (row) => <TaskerAvatar name={row.name} image={row.image} />,
    },
    {
      key: "title",
      label: "Title",
      render: (row) => (
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#1E40AF",
            background: "#EFF6FF",
            padding: "3px 10px",
            borderRadius: "6px",
            whiteSpace: "nowrap",
          }}
        >
          {row.title}
        </span>
      ),
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "specialties", label: "Specialties" },
    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ActiveBadge active={row.isActive} />
          <button
            onClick={() => handleToggleTasker(row.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
            }}
          >
            {row.isActive ? (
              <ToggleRight size={20} color="#1E3A8A" />
            ) : (
              <ToggleLeft size={20} color="#9CA3AF" />
            )}
          </button>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (row) => (
        <span style={{ fontSize: "13px", color: "#6B7280" }}>
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

  return (
    <div className="w-full min-w-0">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-family-playfair font-bold text-[#1E3A8A] text-[20px]">
            Staff Management
          </h1>
          <p className="font-family-playfair text-gray-500 text-[13px] mt-1">
            Manage admins and taskers
          </p>
        </div>
        <button
          onClick={() =>
            activeTab === "admins"
              ? setShowAddAdmin(true)
              : setShowAddTasker(true)
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "10px 18px",
            background: "#1E3A8A",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Plus size={15} />
          {activeTab === "admins" ? "Add Admin" : "Add Tasker"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Tab
          label="Admins"
          icon={<Shield size={14} />}
          active={activeTab === "admins"}
          count={admins.length}
          onClick={() => setActiveTab("admins")}
        />
        <Tab
          label="Taskers"
          icon={<Users size={14} />}
          active={activeTab === "taskers"}
          count={taskers.length}
          onClick={() => setActiveTab("taskers")}
        />
      </div>

      {/* Error */}
      {(adminsError || taskersError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-5">
          <p className="font-family-playfair text-red-600 text-[13px]">
            Failed to load staff. Please try again.
          </p>
        </div>
      )}

      {/* Table */}
      <ErrorBoundary>
        {activeTab === "admins" ? (
          <Table
            columns={adminColumns}
            data={admins}
            itemsPerPage={13}
            isLoading={adminsLoading}
            onDelete={(row) => deleteAdmin(row.id)}
          />
        ) : (
          <Table
            columns={taskerColumns}
            data={taskers}
            itemsPerPage={13}
            isLoading={taskersLoading}
            onDelete={(row) => deleteTasker(row.id)}
          />
        )}
      </ErrorBoundary>

      {showAddAdmin && (
        <AddAdminModal
          onClose={() => setShowAddAdmin(false)}
          onSave={handleCreateAdmin}
          isLoading={isCreatingAdmin}
        />
      )}
      {showAddTasker && (
        <AddTaskerModal
          onClose={() => setShowAddTasker(false)}
          onSave={handleCreateTasker}
          isLoading={isCreatingTasker}
        />
      )}
    </div>
  );
}
