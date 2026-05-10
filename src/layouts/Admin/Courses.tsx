import { useState } from "react";
import { Table } from "../Admin/AdminTable";
import type { Column } from "../Admin/AdminTable";
import {
  useGetAllCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useToggleActivateCourseMutation,
} from "../../app/api/student/course";
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "../../app/api/student/course";
import {
  Plus,
  X,
  ToggleLeft,
  ToggleRight,
  Trash2,
  ImagePlus,
} from "lucide-react";

// ── Shared styles ──────────────────────────────────────────────────────────

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

// ── Badge ──────────────────────────────────────────────────────────────────

function Badge({ active }: { active: boolean }) {
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

// ── Form State ─────────────────────────────────────────────────────────────

interface CourseFormState {
  title: string;
  teacher: string;
  isActive: boolean;
  imageFile?: File | null;
  imageUrl: string;
}

// ── Modal ──────────────────────────────────────────────────────────────────

function CourseModal({
  mode,
  onClose,
  onCreate,
  onUpdate,
  isLoading,
  initial,
}: {
  mode: "add" | "edit";
  onClose: () => void;
  onCreate: (data: CreateCourseRequest) => Promise<void>;
  onUpdate: (data: UpdateCourseRequest) => Promise<void>;
  isLoading: boolean;
  initial?: Course;
}) {
  const [form, setForm] = useState<CourseFormState>({
    title: initial?.title ?? "",
    teacher: initial?.teacher ?? "",
    isActive: initial?.isActive ?? true,
    imageFile: null,
    imageUrl: initial?.image ?? "",
  });

  const [preview, setPreview] = useState<string>(initial?.image ?? "");
  const [imageInputType, setImageInputType] = useState<"url" | "file">("url");
  const isEditMode = mode === "edit";

  const set = <K extends keyof CourseFormState>(
    key: K,
    value: CourseFormState[K],
  ) => setForm((p) => ({ ...p, [key]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set("imageFile", file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageUrlChange = (val: string) => {
    set("imageUrl", val);
    set("imageFile", null);
    setPreview(val);
  };

  const clearImage = () => {
    set("imageUrl", "");
    set("imageFile", null);
    setPreview("");
  };

  const validate = () => {
    if (!form.title.trim()) {
      alert("Title is required.");
      return false;
    }
    if (!form.teacher.trim()) {
      alert("Teacher is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (mode === "add") {
      await onCreate({
        title: form.title,
        teacher: form.teacher,
        isActive: form.isActive,
        image: form.imageUrl || undefined,
        imageFile: form.imageFile,
      });
    } else {
      await onUpdate({
        id: initial!.id,
        title: form.title,
        teacher: form.teacher,
        isActive: form.isActive,
        image: form.imageUrl || initial?.image,
        imageFile: form.imageFile,
      });
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
          <span style={{ fontWeight: 700, fontSize: "15px", color: "#fff" }}>
            {isEditMode ? "✏️ Edit Course" : "➕ New Course"}
          </span>
          <button
            onClick={onClose}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={14} color="#fff" />
          </button>
        </div>

        {/* Body */}
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
          {/* Basic Info */}
          <div style={sectionStyle}>
            <p style={sectionTitle}>Course Information</p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div style={fieldWrap}>
                <label style={labelStyle}>Title *</label>
                <input
                  style={inputStyle}
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Introduction to Programming"
                />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle}>Teacher *</label>
                <input
                  style={inputStyle}
                  value={form.teacher}
                  onChange={(e) => set("teacher", e.target.value)}
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>
          </div>

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
              <p style={{ ...sectionTitle, margin: 0 }}>Course Image</p>
              {!isEditMode && (
                <div style={{ display: "flex", gap: "6px" }}>
                  {(["url", "file"] as const).map((t) => (
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
                        background:
                          imageInputType === t ? "#1E3A8A" : "#EFF6FF",
                        color: imageInputType === t ? "#fff" : "#1E3A8A",
                      }}
                    >
                      {t === "url" ? "🔗 Paste URL" : "📁 Upload File"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* URL input */}
            {(isEditMode || imageInputType === "url") && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {isEditMode && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#9CA3AF",
                      margin: "0 0 4px",
                    }}
                  >
                    Paste a new URL to change the image. Leave blank to keep
                    current.
                  </p>
                )}
                <input
                  style={inputStyle}
                  value={form.imageUrl}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
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

            {/* File upload */}
            {!isEditMode && imageInputType === "file" && (
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
                        Click to upload image
                      </span>
                      <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
                        PNG, JPG, WEBP
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
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
                    <Trash2 size={12} /> Remove image
                  </button>
                )}
              </div>
            )}
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
                Publish immediately
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "#9CA3AF",
                  margin: "2px 0 0",
                }}
              >
                Course will be visible to users when active
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
          <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
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
              {isLoading
                ? "Saving..."
                : isEditMode
                  ? "Update Course"
                  : "Create Course"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function CourseAdmin() {
  const { data, isLoading, isError } = useGetAllCoursesQuery();
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();
  const [toggleActivate] = useToggleActivateCourseMutation();

  const [showModal, setShowModal] = useState(false);
  const [editRow, setEditRow] = useState<Course | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const items = data ?? [];
  const total = items.length;

  interface ApiError {
    status?: number;
    data?: { message?: string };
  }

  const handleCreate = async (data: CreateCourseRequest) => {
    try {
      await createCourse(data).unwrap();
      setShowModal(false);
    } catch (err: unknown) {
      const e = err as ApiError;
      alert(e?.data?.message ?? "Failed to create course.");
    }
  };

  const handleUpdate = async (data: UpdateCourseRequest) => {
    try {
      await updateCourse(data).unwrap();
      setEditRow(null);
    } catch (err: unknown) {
      const e = err as ApiError;
      alert(e?.data?.message ?? "Failed to update course.");
    }
  };

  const handleDelete = async (row: Course) => {
    setDeleteError(null);
    try {
      await deleteCourse(row.id).unwrap();
    } catch {
      setDeleteError("Failed to delete course. Please try again.");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleActivate(id).unwrap();
    } catch {
      alert("Failed to toggle status.");
    }
  };

  // ── Columns ───────────────────────────────────────────────────────────────

  const columns: Column<Course>[] = [
    {
      key: "image",
      label: "Image",
      render: (row) =>
        row.image ? (
          <img
            src={row.image}
            alt={row.title}
            style={{
              width: "56px",
              height: "42px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid #DBEAFE",
            }}
          />
        ) : (
          <div
            style={{
              width: "56px",
              height: "42px",
              borderRadius: "8px",
              background: "#EFF6FF",
              border: "1px solid #DBEAFE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              color: "#9CA3AF",
            }}
          >
            No img
          </div>
        ),
    },
    {
      key: "title",
      label: "Title",
      render: (row) => (
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#1E3A8A" }}>
          {row.title}
        </span>
      ),
    },
    {
      key: "teacher",
      label: "Teacher",
      render: (row) => (
        <span style={{ fontSize: "13px", color: "#374151" }}>
          {row.teacher}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Badge active={row.isActive} />
          <button
            onClick={() => handleToggle(row.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
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

  return (
    <div className="w-full min-w-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-family-playfair font-bold text-[#1E3A8A] text-[20px]">
            Courses
          </h1>
          <p className="font-family-playfair text-gray-500 text-[13px] mt-1">
            Total: <span className="font-bold text-[#1E3A8A]">{total}</span>{" "}
            courses
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
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
          <Plus size={15} /> Add Course
        </button>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-5">
          <p className="font-family-playfair text-red-600 text-[13px]">
            Failed to load courses. Please try again.
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
        itemsPerPage={13}
        isLoading={isLoading}
        onEdit={(row) => setEditRow(row)}
        onDelete={handleDelete}
      />

      {showModal && (
        <CourseModal
          mode="add"
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          isLoading={isCreating}
        />
      )}
      {editRow && (
        <CourseModal
          mode="edit"
          onClose={() => setEditRow(null)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          isLoading={isUpdating}
          initial={editRow}
        />
      )}
    </div>
  );
}
