//import philemon from "../../assets/komvuga ndayishimiye philemon.jpg";
import { Settings, LogOut, User, Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation, useGetProfileQuery } from "../../app/api/Auth/auth";

export default function RMStoreHeader() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [logoutMutation] = useLogoutMutation();
  const navigate = useNavigate();
  const { data: profile } = useGetProfileQuery();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout logic
  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.log(error);
    }
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="pt-3 flex items-center gap-2 pr-2">
      {/* Welcome */}
      <h2 className="font-semibold font-family-playfair text-gray-700 text-[16px]">
        Welcome, {profile?.fullName || "Admin"}
      </h2>

      {/* Right Side */}
      <div className="flex items-center gap-4 pr-1">
        {/* 🔔 Notification */}
        <div className="relative">
          <Bell size={16} className="cursor-pointer text-gray-500" />
          <span className="absolute font-family-playfair -top-1 -right-2 bg-red-400 text-white text-xs w-3 h-3 flex items-center justify-center rounded-full">
            3
          </span>
        </div>

        {/* 👤 Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {/* Avatar */}
          {/* Avatar */}
          <div
            onClick={() => setOpen(!open)}
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

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-sm z-50 p-2 space-y-1">
              <div
                onClick={() => navigate("/rmstore/profile")}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <User size={15} />
                <span className="font-family-playfair">Profile</span>
              </div>

              <div
                onClick={() => navigate("/rmstore/settings")}
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
    </div>
  );
}
