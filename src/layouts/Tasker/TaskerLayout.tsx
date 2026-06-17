import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import logo from "../../assets/NEW LOGO RISE MOTIVE.jpeg";
import { UserPlus, Menu, X } from "lucide-react";
import TaskerHeader from "./TaskerHeader";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
    isActive ? "bg-blue-600 text-blue-100" : "hover:bg-blue-700/40 text-white"
  }`;

// ── Moved OUTSIDE TaskerLayout ──
function SidebarContent({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="pt-2 pl-2">
        <div className="flex items-center gap-3 shrink-0 group">
          <div className="relative">
            <img
              src={logo}
              alt="Risemotive Logo"
              className="h-10 w-10 object-contain group-hover:ring-blue-300 transition-all duration-300"
            />
          </div>
          <NavLink
            to="/tasker/dashboard"
            className="leading-tight"
            onClick={onClose}
          >
            <h2 className="font-extrabold text-[17px] tracking-wide text-[#1E3A8A] group-hover:text-blue-500 transition-colors duration-200 pb-2 font-family-playfair">
              RISEMOTIVE
            </h2>
            <p className="text-[11px] font-medium text-white tracking-wide font-family-playfair">
              Building Skills. Delivering Solutions
            </p>
          </NavLink>
        </div>
      </div>

      <h1 className="text-[20px] font-bold mb-3 pt-5 text-center">
        Tasker Panel
      </h1>

      <ul className="space-y-1 font-family-playfair text-[16px]">
        <li>
          <NavLink
            to="/tasker/service"
            className={navLinkClass}
            onClick={onClose}
          >
            <UserPlus size={15} />
            <span className="text-[14.5px]">View Requested Service</span>
          </NavLink>
        </li>
      </ul>
    </>
  );
}

export default function TaskerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const close = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <div className="hidden md:flex md:w-64 md:shrink-0 bg-linear-to-b from-blue-300 to-blue-900 font-family-playfair text-white overflow-y-auto overflow-x-hidden flex-col">
        <SidebarContent onClose={close} />
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={close}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute top-0 left-0 h-full w-64 bg-linear-to-b from-blue-300 to-blue-900 text-white overflow-y-auto flex flex-col z-50 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-2">
              <button
                onClick={close}
                className="text-white hover:text-blue-200 transition-colors p-1"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <SidebarContent onClose={close} />
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="shrink-0 flex items-center justify-between px-4 md:px-6">
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="hidden md:block" />
          <TaskerHeader />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
