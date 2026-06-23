import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useLogoutMutation,
  useUpdateProfilePictureMutation,
} from "../../app/api/Auth/auth";
import { User, Lock, LogOut, Save, Shield, CheckCircle, X } from "lucide-react";

// interface ApiError {
//   status: number;
//   data: { message?: string };
// }

// ── Section Card ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #DBEAFE",
        borderRadius: "14px",
        overflow: "hidden",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          background: "#EFF6FF",
          borderBottom: "1px solid #DBEAFE",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {icon}
        <span
          style={{
            fontWeight: 700,
            fontSize: "15px",
            color: "#1E3A8A",
            fontFamily: "inherit",
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}

// ── Input Field ────────────────────────────────────────────────────────────

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "#374151",
          display: "block",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: "10px",
          border: "1px solid #BFDBFE",
          fontSize: "14px",
          color: disabled ? "#9CA3AF" : "#1E3A8A",
          background: disabled ? "#F9FAFB" : "#fff",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        background: type === "success" ? "#DCFCE7" : "#FEE2E2",
        border: `1px solid ${type === "success" ? "#86EFAC" : "#FECACA"}`,
        borderRadius: "12px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        minWidth: "280px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      {type === "success" ? (
        <CheckCircle size={16} color="#16A34A" />
      ) : (
        <X size={16} color="#DC2626" />
      )}
      <span
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: type === "success" ? "#14532D" : "#7F1D1D",
          flex: 1,
        }}
      >
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <X size={14} color="#6B7280" />
      </button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function RMStoreCyberSettings() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [logoutMutation] = useLogoutMutation();
  const [changePassword] = useChangePasswordMutation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updateProfilePicture] = useUpdateProfilePictureMutation();

  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setEmail(profile.email);
    }
  }, [profile]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  type ApiError = {
    status?: number;
    data?: {
      message?: string;
    };
  };

  const handleProfilePicture = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log(" File input triggered");

    const file = e.target.files?.[0];

    if (!file) {
      console.warn(" No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);

    // Debug FormData (important!)
    for (const [key, value] of formData.entries()) {
      console.log(` FormData -> ${key}:`, value);
    }

    try {
      console.log(" Sending request...");

      const response = await updateProfilePicture(formData).unwrap();
      const profile = response.profilePicture;
      console.log(profile);

      showToast("Profile picture updated!", "success");
    } catch (error) {
      const err = error as ApiError;

      showToast(err.data?.message || "Failed to update picture.", "error");
    }
  };

  const handleUpdateProfile = async () => {
    if (!fullName.trim() || !email.trim()) {
      showToast("Full name and email are required.", "error");
      return;
    }
    try {
      await updateProfile({ fullName, email }).unwrap();
      showToast("Profile updated successfully!", "success");
    } catch (err: unknown) {
      const error = err as ApiError;
      showToast(error?.data?.message ?? "Failed to update profile.", "error");
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("All password fields are required.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showToast("Password updated successfully!", "success");
    } catch (err: unknown) {
      const error = err as ApiError;
      showToast(error?.data?.message ?? "Failed to update password.", "error");
    }
  };
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutMutation().unwrap();
    } catch {
      // ignore logout errors
    } finally {
      localStorage.removeItem("token");
      navigate("/");
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          color: "#9CA3AF",
          fontSize: "14px",
        }}
      >
        Loading settings...
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 p-6 max-w-2xl">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="mb-8 mt-3">
        <h1 className="font-family-playfair font-bold text-[#1E3A8A] text-[22px]">
          Settings
        </h1>
        <p className="font-family-playfair text-gray-500 text-[13px] mt-1">
          Manage your account and preferences
        </p>
        <div className="flex items-center mt-2 ml-[30%]">
          <div
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "#1E3A8A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {profile?.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  style={{ fontSize: "24px", fontWeight: 700, color: "#fff" }}
                >
                  {profile?.fullName?.charAt(0).toUpperCase() ?? "A"}
                </span>
              )}
            </div>
            <label
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "#fff",
                border: "1px solid #BFDBFE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Camera size={12} color="#1E3A8A" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicture}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Account Info */}
      {/* Profile Picture */}

      <SectionCard
        title="Account Information"
        icon={<User size={16} color="#1E3A8A" />}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "20px",
            padding: "14px",
            background: "#F8FAFF",
            borderRadius: "10px",
            border: "1px solid #DBEAFE",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#1E3A8A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {profile?.fullName?.charAt(0).toUpperCase() ?? "A"}
          </div>
          <div>
            <p
              style={{
                fontWeight: 700,
                fontSize: "15px",
                color: "#1E3A8A",
                margin: 0,
              }}
            >
              {profile?.fullName}
            </p>
            <p
              style={{ fontSize: "12px", color: "#6B7280", margin: "2px 0 0" }}
            >
              {profile?.email}
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "4px",
                background: "#DBEAFE",
                color: "#1E3A8A",
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "999px",
              }}
            >
              {profile?.role}
            </span>
          </div>
        </div>

        <Field
          label="Full Name"
          value={fullName}
          onChange={setFullName}
          placeholder="Your full name"
        />
        <Field
          label="Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="your@email.com"
        />

        <button
          onClick={handleUpdateProfile}
          disabled={isUpdating}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: "#1E3A8A",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            opacity: isUpdating ? 0.6 : 1,
          }}
        >
          <Save size={14} />
          {isUpdating ? "Saving..." : "Save Changes"}
        </button>
      </SectionCard>

      {/* Change Password */}
      <SectionCard
        title="Change Password"
        icon={<Lock size={16} color="#1E3A8A" />}
      >
        <Field
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder="Enter current password"
        />
        <Field
          label="New Password"
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="Enter new password"
        />
        <Field
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm new password"
        />
        <button
          onClick={handleUpdatePassword}
          disabled={isUpdating}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: "#1E3A8A",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            opacity: isUpdating ? 0.6 : 1,
          }}
        >
          <Lock size={14} />
          {isUpdating ? "Updating..." : "Update Password"}
        </button>
      </SectionCard>

      {/* Account Details */}
      <SectionCard
        title="Account Details"
        icon={<Shield size={16} color="#1E3A8A" />}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {[
            { label: "Role", value: profile?.role ?? "—" },
            {
              label: "Status",
              value: profile?.isActive ? "Active" : "Inactive",
            },
            {
              label: "Member Since",
              value: profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—",
            },
            {
              label: "Last Updated",
              value: profile?.updatedAt
                ? new Date(profile.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—",
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                background: "#F8FAFF",
                borderRadius: "10px",
                padding: "12px 14px",
                border: "1px solid #DBEAFE",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: "#6B7280",
                  margin: "0 0 4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#1E3A8A",
                  margin: 0,
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Logout */}
      <SectionCard title="Session" icon={<LogOut size={16} color="#DC2626" />}>
        <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "16px" }}>
          You are currently logged in as{" "}
          <strong style={{ color: "#1E3A8A" }}>{profile?.email}</strong>. Click
          below to securely log out.
        </p>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: "#FEE2E2",
            color: "#B91C1C",
            border: "1px solid #FECACA",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {isLoggingOut ? (
            <>
              <span
                style={{
                  width: "14px",
                  height: "14px",
                  border: "2px solid #B91C1C",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              Logging out...
            </>
          ) : (
            <>
              <LogOut size={14} />
              Log Out
            </>
          )}
        </button>
      </SectionCard>
    </div>
  );
}
