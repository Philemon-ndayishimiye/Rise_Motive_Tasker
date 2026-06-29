import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import logo from "../../assets/white-logo.jpeg";
import {
  Briefcase,
  Headset,
  LifeBuoy,
  Wallet,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";
import MediaHeader from "./RMJuniorHeader";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
    isActive ? "bg-blue-600 text-blue-100" : "hover:bg-blue-700/40 text-white"
  }`;

export default function RMJuniorLayout() {
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
              to="/rmjunior/dashboard"
              className="leading-tight"
              onClick={() => setSidebarOpen(false)}
            >
              <h2 className="font-extrabold text-[17px] tracking-wide text-white transition-colors duration-200 pb-2 font-family-playfair">
                RISE MOTIVE
              </h2>
              <p className="text-[11px] font-medium text-white tracking-wide font-family-playfair">
                Building Skills. Delivering Solutions
              </p>
            </NavLink>
          </div>
        </div>

        <h1 className="text-[18px] font-bold mb-3 pt-5 text-center px-2">
          RM Junior Panel
        </h1>

        <ul className="space-y-1 font-family-playfair text-[16px]">
          <li>
            <NavLink
              to="/rmjunior/servicerequest"
              className={navLinkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <Briefcase size={15} />
              <h1 className="text-[14.5px]">Service Request</h1>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/rmjunior/delegatedtask"
              className={navLinkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <ClipboardList size={15} />
              <h1 className="text-[14.5px]">Delegated Tasks</h1>
            </NavLink>
          </li>

          <li>
            <button className="flex cursor-pointer items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-700/40 text-white w-full text-left">
              <Wallet size={15} />
              <h1 className="text-[14.5px]">My Earnings</h1>
            </button>
          </li>

          <li className="px-3 pt-4 pb-1">
            <p className="text-blue-300 text-[11px] font-bold uppercase tracking-widest">
              Support
            </p>
          </li>

          <li>
            <a
              href="https://chat.whatsapp.com/HegyRaWwEUIDJ2UvXAYxEQ?s=cl&p=a&mlu=1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-700/40 text-white w-full text-left"
            >
              <Headset size={15} />
              <h1 className="text-[14.5px]">Messages</h1>
            </a>
          </li>

          <li>
            <a
              href="https://wa.me/250795344768"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-700/40 text-white w-full text-left"
            >
              <LifeBuoy size={15} />
              <h1 className="text-[14.5px]">Contact Support</h1>
            </a>
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
