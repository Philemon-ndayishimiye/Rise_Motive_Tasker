import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import logo from "../../assets/white-logo.jpeg";
import {
  Box,
  Headset,
  LifeBuoy,
  Wallet,
  ClipboardList,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import MediaHeader from "./RMStoreHeader";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
    isActive ? "bg-blue-600 text-blue-100" : "hover:bg-blue-700/40 text-white"
  }`;

export default function RMStoreLayout() {
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
            <img
              src={logo}
              alt="Risemotive Logo"
              className="h-10 w-10 object-contain group-hover:ring-blue-300 transition-all duration-300"
            />
            <NavLink
              to="/rmstore/dashboard"
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
          RM Store Panel
        </h1>

        <ul className="space-y-1 font-family-playfair text-[16px]">
          <li>
            <NavLink
              to="/rmstore/products"
              className={navLinkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <Box size={15} />
              <h1 className="text-[14.5px]">View Product</h1>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/rmstore/order"
              className={navLinkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <ShoppingBag size={15} />
              <h1 className="text-[14.5px]">Ordered Product</h1>
            </NavLink>
          </li>

          <li>
            <button className="flex cursor-pointer items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-700/40 text-white w-full text-left">
              <Wallet size={15} />
              <h1 className="text-[14.5px]">My Earnings</h1>
            </button>
          </li>

          <li>
            <button className="flex items-center cursor-pointer gap-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-700/40 text-white w-full text-left">
              <ClipboardList size={15} />
              <h1 className="text-[14.5px]">Delegated Tasks</h1>
            </button>
          </li>

          <li className="px-3 pt-4 pb-1">
            <p className="text-blue-300 text-[11px] font-bold uppercase tracking-widest">
              Support
            </p>
          </li>

          <li>
            <button className="flex cursor-pointer items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-700/40 text-white w-full text-left">
              <Headset size={15} />
              <h1 className="text-[14.5px]">Messages</h1>
            </button>
          </li>

          <li>
            <button className="flex items-center cursor-pointer gap-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-700/40 text-white w-full text-left">
              <LifeBuoy size={15} />
              <h1 className="text-[14.5px]">Contact Support</h1>
            </button>
          </li>
        </ul>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="shrink-0 flex items-center justify-between px-4 lg:justify-end lg:px-6">
          <button
            className="lg:hidden text-blue-800 p-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <MediaHeader />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 lg:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}