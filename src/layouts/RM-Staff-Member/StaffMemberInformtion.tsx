import { useState } from "react";
import { Table } from "../Admin/AdminTable";
import type { Column } from "../Admin/AdminTable";
import {
  useGetAllInfoPostsQuery,
  useCreateInfoPostMutation,
  useUpdateInfoPostMutation,
  useDeleteInfoPostMutation,
  useToggleActivateInfoPostMutation,
} from "../../app/api/Infospot/Infospot";
import type {
  InfoPost,
  CreateInfoPostRequest,
  UpdateInfoPostRequest,
} from "../../app/api/Infospot/Infospot";
import {
  Plus,
  X,
  ToggleLeft,
  ToggleRight,
  Trash2,
  ImagePlus,
  Link,
  ListChecks,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ── Badges ─────────────────────────────────────────────────────────────────

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

function CategoryBadge({ cat }: { cat: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    JOB: { bg: "#DBEAFE", color: "#1E3A8A" },
    SCHOLARSHIP: { bg: "#FEF9C3", color: "#92400E" },
    COMPETITION: { bg: "#FCE7F3", color: "#9D174D" },
    GRANTS_AND_FUNDING: { bg: "#DCFCE7", color: "#14532D" },
    RISE_MOTIVE: { bg: "#EDE9FE", color: "#4C1D95" },
    TENDERS: { bg: "#FFF7ED", color: "#92400E" },
    INTERNSHIPS: { bg: "#F0FDF4", color: "#166534" },
    TRAINING_AND_COURSES: { bg: "#EFF6FF", color: "#1E40AF" },
  };
  const s = map[cat] ?? { bg: "#F3F4F6", color: "#374151" };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "3px 10px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 700,
      }}
    >
      {cat}
    </span>
  );
}

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

// ── Form state ─────────────────────────────────────────────────────────────

interface InfoPostFormState extends CreateInfoPostRequest {
  imageFile?: File | null;
  imageUrl: string;
}

// ── Reusable list-editor ───────────────────────────────────────────────────

function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
  addLabel,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  const addItem = () => onChange([...items, ""]);
  const updateItem = (i: number, val: string) => {
    const arr = [...items];
    arr[i] = val;
    onChange(arr);
  };
  const removeItem = (i: number) =>
    onChange(items.filter((_, idx) => idx !== i));

  return (
    <div style={sectionStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <p style={{ ...sectionTitle, margin: 0 }}>{label}</p>
        <button
          onClick={addItem}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid #BFDBFE",
            background: "#EFF6FF",
            color: "#1E3A8A",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Plus size={12} /> {addLabel ?? "Add Item"}
        </button>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            borderRadius: "10px",
            border: "1px dashed #BFDBFE",
            background: "#fff",
          }}
        >
          <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>
            No items yet — click <strong>"{addLabel ?? "Add Item"}"</strong> to
            add.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {items.map((c, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: "8px", alignItems: "center" }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#9CA3AF",
                  minWidth: "20px",
                  textAlign: "right",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}.
              </span>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={c}
                onChange={(e) => updateItem(i, e.target.value)}
                placeholder={placeholder ?? "Enter item…"}
              />
              <button
                onClick={() => removeItem(i)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  border: "1px solid #FEE2E2",
                  background: "#FFF5F5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Trash2 size={13} color="#EF4444" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Form Modal ─────────────────────────────────────────────────────────────

function InfoPostModal({
  mode,
  onClose,
  onCreate,
  onUpdate,
  isLoading,
  initial,
}: {
  mode: "add" | "edit";
  onClose: () => void;
  onCreate: (
    data: CreateInfoPostRequest & { imageFile?: File | null },
  ) => Promise<void>;
  onUpdate: (data: UpdateInfoPostRequest) => Promise<void>;
  isLoading: boolean;
  initial?: InfoPost;
}) {
  const [form, setForm] = useState<InfoPostFormState>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "JOB",
    deadline: initial?.deadline ?? "",
    location: initial?.location ?? "",
    applyLink: initial?.applyLink ?? "",
    contactInfo: initial?.contactInfo ?? "",
    qualificationCriteria: initial?.qualificationCriteria ?? [],
    stepsToApply: initial?.stepsToApply ?? [],
    isActive: initial?.isActive ?? true,
    imageFile: null,
    imageUrl: initial?.image ?? "",
  });

  const [slugManual, setSlugManual] = useState(Boolean(initial?.slug));
  const [preview, setPreview] = useState<string>(initial?.image ?? "");
  const [imageInputType, setImageInputType] = useState<"url" | "file">("url");

  const set = <K extends keyof InfoPostFormState>(
    key: K,
    value: InfoPostFormState[K],
  ) => setForm((p) => ({ ...p, [key]: value }));

  const handleTitleChange = (val: string) => {
    set("title", val);
    if (!slugManual) set("slug", generateSlug(val));
  };

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
    if (!form.description.trim()) {
      alert("Description is required.");
      return false;
    }
    if (!form.deadline?.trim()) {
      alert("Deadline is required.");
      return false;
    }
    if (!form.location?.trim()) {
      alert("Location is required.");
      return false;
    }
    if (!form.contactInfo?.trim()) {
      alert("Contact info is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (mode === "add") {
      await onCreate({
        title: form.title,
        slug: form.slug ?? generateSlug(form.title),
        description: form.description,
        category: form.category,
        deadline: form.deadline,
        location: form.location,
        applyLink: form.applyLink,
        contactInfo: form.contactInfo,
        image: form.imageUrl,
        imageFile: form.imageFile,
        qualificationCriteria: form.qualificationCriteria,
        stepsToApply: form.stepsToApply,
        isActive: form.isActive,
      });
    } else {
      await onUpdate({
        id: initial!.id,
        title: form.title,
        description: form.description,
        category: form.category,
        deadline: form.deadline,
        location: form.location,
        applyLink: form.applyLink,
        contactInfo: form.contactInfo,
        image: form.imageUrl || initial?.image,
        qualificationCriteria: form.qualificationCriteria,
        stepsToApply: form.stepsToApply,
        isActive: form.isActive,
      });
    }
  };

  const isEditMode = mode === "edit";

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
          maxWidth: "640px",
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
        {/* ── Header ── */}
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
            {isEditMode ? "✏️ Edit Info Post" : "➕ New Info Post"}
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

        {/* ── Scrollable body ── */}
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
            <p style={sectionTitle}>Basic Information</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div style={{ ...fieldWrap, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Title *</label>
                <input
                  style={inputStyle}
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Software Engineer at Kigali Tech"
                />
              </div>

              <div style={{ ...fieldWrap, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>
                  Slug
                  <span
                    style={{
                      fontWeight: 400,
                      color: "#9CA3AF",
                      marginLeft: "6px",
                    }}
                  >
                    (auto-generated from title)
                  </span>
                </label>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <div style={{ position: "relative", flex: 1 }}>
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
                      style={{
                        ...inputStyle,
                        paddingLeft: "30px",
                        background: slugManual ? "#fff" : "#F0F7FF",
                        color: slugManual ? "#1E3A8A" : "#6B7280",
                      }}
                      value={form.slug ?? ""}
                      onChange={(e) => {
                        setSlugManual(true);
                        set("slug", e.target.value);
                      }}
                      placeholder="auto-generated-slug"
                    />
                  </div>
                  {slugManual && (
                    <button
                      onClick={() => {
                        setSlugManual(false);
                        set("slug", generateSlug(form.title));
                      }}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #DBEAFE",
                        background: "#EFF6FF",
                        color: "#1E3A8A",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ↺ Auto
                    </button>
                  )}
                </div>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Category *</label>
                <select
                  style={inputStyle}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  <option value="JOB">JOB</option>
                  <option value="SCHOLARSHIP">SCHOLARSHIP</option>
                  <option value="COMPETITION">COMPETITION</option>
                  <option value="FUNDING">FUNDING</option>
                  <option value="RISE_MOTIVE">RISE MOTIVE</option>
                  <option value="TENDERS">TENDERS</option>
                  <option value="INTERNSHIPS">INTERNSHIPS</option>
                  <option value="TRAINING_AND_COURSES">
                    TRAINING & COURSES
                  </option>
                </select>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Deadline *</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={form.deadline ?? ""}
                  onChange={(e) => set("deadline", e.target.value)}
                />
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Location *</label>
                <input
                  style={inputStyle}
                  value={form.location ?? ""}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="e.g. Kigali, Rwanda"
                />
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Contact Info *</label>
                <input
                  style={inputStyle}
                  value={form.contactInfo ?? ""}
                  onChange={(e) => set("contactInfo", e.target.value)}
                  placeholder="Email or phone"
                />
              </div>

              <div style={{ ...fieldWrap, gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Apply Link</label>
                <input
                  style={inputStyle}
                  value={form.applyLink ?? ""}
                  onChange={(e) => set("applyLink", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={sectionStyle}>
            <p style={sectionTitle}>Description *</p>
            <textarea
              style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe this opportunity in detail..."
            />
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
              <p style={{ ...sectionTitle, margin: 0 }}>Cover Image</p>
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
                    To change the image, paste a new URL below. Leave blank to
                    keep the current image.
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

          {/* Qualification Criteria */}
          <StringListEditor
            label="Qualification Criteria"
            items={form.qualificationCriteria}
            onChange={(items) => set("qualificationCriteria", items)}
            placeholder="e.g. Bachelor's degree in Computer Science"
            addLabel="Add Criteria"
          />

          {/* ── Steps to Apply ── NEW ── */}
          <div
            style={{
              ...sectionStyle,
              borderColor: "#C7D2FE",
              background: "#F5F3FF",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "7px",
                    background: "#EDE9FE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ListChecks size={14} color="#4C1D95" />
                </div>
                <div>
                  <p style={{ ...sectionTitle, margin: 0, color: "#4C1D95" }}>
                    Steps to Apply
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#8B5CF6",
                      margin: 0,
                      marginTop: "1px",
                    }}
                  >
                    Shown to users as a popup guide
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  set("stepsToApply", [...(form.stepsToApply ?? []), ""])
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid #C4B5FD",
                  background: "#EDE9FE",
                  color: "#4C1D95",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Plus size={12} /> Add Step
              </button>
            </div>

            {!form.stepsToApply || form.stepsToApply.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  borderRadius: "10px",
                  border: "1px dashed #C4B5FD",
                  background: "#fff",
                }}
              >
                <ListChecks
                  size={24}
                  color="#C4B5FD"
                  style={{ marginBottom: "6px" }}
                />
                <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>
                  No steps yet — click <strong>"Add Step"</strong> to add
                  application steps for users.
                </p>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {(form.stepsToApply ?? []).map((step, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Step number circle */}
                    <div
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #4C1D95, #7C3AED)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: 800,
                        flexShrink: 0,
                        marginTop: "8px",
                        boxShadow: "0 2px 6px rgba(124,58,237,0.3)",
                      }}
                    >
                      {i + 1}
                    </div>
                    <textarea
                      style={{
                        ...inputStyle,
                        flex: 1,
                        minHeight: "60px",
                        resize: "vertical",
                        borderColor: "#C4B5FD",
                      }}
                      value={step}
                      onChange={(e) => {
                        const arr = [...(form.stepsToApply ?? [])];
                        arr[i] = e.target.value;
                        set("stepsToApply", arr);
                      }}
                      placeholder={`Step ${i + 1}: e.g. Visit the official website and download the application form`}
                    />
                    <button
                      onClick={() => {
                        set(
                          "stepsToApply",
                          (form.stepsToApply ?? []).filter(
                            (_, idx) => idx !== i,
                          ),
                        );
                      }}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        border: "1px solid #FEE2E2",
                        background: "#FFF5F5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                        marginTop: "6px",
                      }}
                    >
                      <Trash2 size={13} color="#EF4444" />
                    </button>
                  </div>
                ))}
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
                Post will be visible to users when active
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
                  ? "Update Post"
                  : "Create Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function StaffMemberInformation() {
  const { data, isLoading, isError } = useGetAllInfoPostsQuery();
  const [createPost, { isLoading: isCreating }] = useCreateInfoPostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdateInfoPostMutation();
  const [deletePost] = useDeleteInfoPostMutation();
  const [toggleActivate] = useToggleActivateInfoPostMutation();

  const [showModal, setShowModal] = useState(false);
  const [editRow, setEditRow] = useState<InfoPost | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  interface ApiError {
    status?: number;
    data?: { message?: string };
  }

  const handleCreate = async (
    data: CreateInfoPostRequest & { imageFile?: File | null },
  ) => {
    try {
      await createPost(data).unwrap();
      setShowModal(false);
    } catch (err: unknown) {
      const e = err as ApiError;
      alert(e?.data?.message ?? "Failed to create post.");
    }
  };

  const handleUpdate = async (data: UpdateInfoPostRequest) => {
    try {
      await updatePost(data).unwrap();
      setEditRow(null);
    } catch (err: unknown) {
      const e = err as ApiError;
      alert(e?.data?.message ?? "Failed to update post.");
    }
  };

  const handleDelete = async (row: InfoPost) => {
    setDeleteError(null);
    try {
      await deletePost(row.id).unwrap();
    } catch {
      setDeleteError("Failed to delete post. Please try again.");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleActivate(id).unwrap();
    } catch {
      alert("Failed to toggle status.");
    }
  };

  const columns: Column<InfoPost>[] = [
    {
      key: "title",
      label: "Title",
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1E3A8A" }}>
            {row.title}
          </span>
          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{row.slug}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (row) => <CategoryBadge cat={row.category} />,
    },
    { key: "location", label: "Location" },
    { key: "deadline", label: "Deadline" },
    { key: "contactInfo", label: "Contact" },
    {
      key: "qualificationCriteria",
      label: "Criteria",
      render: (row) => (
        <span style={{ fontSize: "12px", color: "#6B7280" }}>
          {row.qualificationCriteria?.length ?? 0} item
          {(row.qualificationCriteria?.length ?? 0) !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      key: "stepsToApply",
      label: "Steps",
      render: (row) => (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12px",
            color: row.stepsToApply?.length ? "#4C1D95" : "#9CA3AF",
            background: row.stepsToApply?.length ? "#EDE9FE" : "transparent",
            padding: row.stepsToApply?.length ? "2px 8px" : "0",
            borderRadius: "999px",
            fontWeight: row.stepsToApply?.length ? 700 : 400,
          }}
        >
          {row.stepsToApply?.length ? (
            <>
              <ListChecks size={11} />
              {row.stepsToApply.length} step
              {row.stepsToApply.length !== 1 ? "s" : ""}
            </>
          ) : (
            "—"
          )}
        </span>
      ),
    },
    {
      key: "image",
      label: "Image",
      render: (row) =>
        row.image ? (
          <img
            src={row.image}
            alt={row.title}
            style={{
              width: "48px",
              height: "36px",
              objectFit: "cover",
              borderRadius: "6px",
              border: "1px solid #DBEAFE",
            }}
          />
        ) : (
          <span style={{ color: "#9CA3AF", fontSize: "12px" }}>—</span>
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
            Info Posts
          </h1>
          <p className="font-family-playfair text-gray-500 text-[13px] mt-1">
            Total: <span className="font-bold text-[#1E3A8A]">{total}</span>{" "}
            posts
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
          <Plus size={15} /> Add Info Post
        </button>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-5">
          <p className="font-family-playfair text-red-600 text-[13px]">
            Failed to load posts. Please try again.
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
        <InfoPostModal
          mode="add"
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          isLoading={isCreating}
        />
      )}
      {editRow && (
        <InfoPostModal
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
