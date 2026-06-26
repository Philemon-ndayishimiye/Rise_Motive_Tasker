import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import logo from "../../assets/white-logo.jpeg";
import {
  CircleAlert,
  Box,
  Briefcase,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import MediaHeader from "./StaffMemberHeader";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
    isActive ? "bg-blue-600 text-blue-100" : "hover:bg-blue-700/40 text-white"
  }`;

export default function StaffMemberLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 shrink-0 bg-blue-800 font-family-playfair text-white
          overflow-y-auto overflow-x-hidden
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Close button — mobile only */}
        <button
          className="absolute top-3 right-3 lg:hidden text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>

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
              to="/staff/dashboard"
              className="leading-tight"
              onClick={() => setSidebarOpen(false)}
            >
              <h2 className="font-extrabold text-[18px] tracking-wide transition-colors duration-200 pb-2 font-family-playfair text-white">
                RISEMOTIVE
              </h2>
              <p className="text-[11px] font-bold text-white tracking-wide font-family-playfair">
                Building Skills. Delivering Solutions
              </p>
            </NavLink>
          </div>
        </div>

        <h1 className="text-[20px] font-bold mb-3 pt-6 pl-2">Media Panel</h1>

        <ul className="space-y-1 font-family-playfair text-[16px]">
          <li>
            <NavLink
              to="/staff/products"
              className={navLinkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <Box size={15} />
              <h1 className="text-[14.5px]">View Product</h1>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/staff/servicerequest"
              className={navLinkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <Briefcase size={15} />
              <h1 className="text-[14.5px]">servicerequest</h1>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/staff/info"
              className={navLinkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <CircleAlert size={15} />
              <h1 className="text-[14.5px]">View Information</h1>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/staff/order"
              className={navLinkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <ShoppingBag size={15} />
              <h1 className="text-[14.5px]">Ordered Product</h1>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-4 lg:justify-end lg:px-6">
          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden text-blue-800 p-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <MediaHeader />
        </div>

        {/* Page content */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 lg:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
