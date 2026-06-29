import { Settings, LogOut, User, Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation, useGetProfileQuery } from "../../app/api/Auth/auth";
import {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "../../app/api/Taskspot/deligated";

function timeAgo(dateStr?: string) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function RMJuniorHeader() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Correctly named refs
  const bellRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data, refetch } = useGetMyNotificationsQuery();
  const [markOne] = useMarkNotificationReadMutation();
  const [markAll] = useMarkAllNotificationsReadMutation();
  const [logoutMutation] = useLogoutMutation();
  const navigate = useNavigate();
  const { data: profile } = useGetProfileQuery();

  // ✅ Bell outside click — uses bellRef
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Profile outside click — uses profileRef
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Logout with loading state
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.log(error);
    }
    localStorage.removeItem("token");
    navigate("/");
  };

  const notifications = data?.items ?? [];
  const unread = data?.unreadCount ?? 0;

  const handleMarkAll = async () => {
    const taskerId = notifications[0]?.taskerId;
    if (!taskerId) return;
    await markAll(taskerId).unwrap();
    refetch();
  };

  const handleMarkOne = async (
    id: number | string,
    taskerId: number | string,
  ) => {
    await markOne({ notificationId: id, taskerId }).unwrap();
    refetch();
  };

  return (
    <>
      {/* ✅ Full-screen logout overlay */}
      {loggingOut && (
        <div className="fixed inset-0 z-9999 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-900 font-semibold font-family-playfair text-sm">
            Logging out...
          </p>
        </div>
      )}

      <div className="pt-3 flex items-center gap-2 pr-2">
        {/* Welcome */}
        <h2 className="font-semibold font-family-playfair text-gray-700 text-[16px]">
          Welcome, {profile?.fullName || "Admin"}
        </h2>

        {/* Bell — now uses bellRef */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className="relative p-1"
          >
            <Bell size={18} className="text-gray-500 cursor-pointer" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-blue-50">
                <span className="text-sm font-bold text-blue-900 font-family-playfair">
                  Notifications
                </span>
                {unread > 0 && (
                  <button
                    onClick={handleMarkAll}
                    className="text-xs text-blue-600 hover:underline font-family-playfair"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 && (
                  <div className="py-8 text-center text-gray-400 text-sm font-family-playfair">
                    No notifications yet
                  </div>
                )}
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && handleMarkOne(n.id, n.taskerId)}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !n.isRead ? "bg-blue-50/60" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-700 text-xs font-bold">
                      {n.isRead ? "✓" : "!"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 font-family-playfair leading-snug">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-gray-500 font-family-playfair leading-snug mt-0.5">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 👤 Profile — now uses profileRef */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-8 h-8 rounded-full cursor-pointer overflow-hidden"
            style={{
              background: "#1E3A8A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {profile?.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <span
                style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}
              >
                {profile?.fullName?.charAt(0).toUpperCase() ?? "A"}
              </span>
            )}
          </div>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-sm z-50 p-2 space-y-1">
              <div
                onClick={() => navigate("/RMStoreCyber/profile")}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <User size={15} />
                <span className="font-family-playfair">Profile</span>
              </div>

              <div
                onClick={() => navigate("/RMStoreCyber/settings")}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <Settings size={15} />
                <span className="font-family-playfair">Settings</span>
              </div>

              <div
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-red-100 text-red-500 cursor-pointer"
              >
                <LogOut size={15} />
                <span className="font-family-playfair">Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
