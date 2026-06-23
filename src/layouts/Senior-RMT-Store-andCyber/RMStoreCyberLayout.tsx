import { Outlet, NavLink } from "react-router-dom";
import logo from "../../assets/NEW LOGO RISE MOTIVE.jpeg";
import { Box, Briefcase } from "lucide-react";
import MediaHeader from "./RMStoreCyberHeader";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
    isActive ? "bg-blue-600 text-blue-100" : "hover:bg-blue-700/40 text-white"
  }`;

export default function RMStoreCyberLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar ── */}
      <div className="w-64 shrink-0 bg-linear-to-b from-blue-300 to-blue-900 font-family-playfair text-white overflow-y-auto overflow-x-hidden">
        <div className="pt-2 pl-2">
          <div className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <img
                src={logo}
                alt="Risemotive Logo"
                className="h-10 w-10 object-contain group-hover:ring-blue-300 transition-all duration-300"
              />
            </div>
            <NavLink to="/RMStoreCyber/dashboard" className="leading-tight">
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
          RM Store Cyber Panel
        </h1>

        <ul className="space-y-1 font-family-playfair text-[16px]">
          <li>
            <NavLink to="/RMStoreCyber/products" className={navLinkClass}>
              <Box size={15} />
              <h1 className="text-[14.5px]">View Product</h1>
            </NavLink>
          </li>

          {/** servicerequest */}
          <li>
            <NavLink to="/RMStoreCyber/servicerequest" className={navLinkClass}>
              <Briefcase size={15} />
              <h1 className="text-[14.5px]">servicerequest</h1>
            </NavLink>
          </li>

          {/* <li>
            <NavLink to="/staff/info" className={navLinkClass}>
              <CircleAlert size={15} />
              <h1 className="text-[14.5px]">View Information</h1>
            </NavLink>
          </li> */}
        </ul>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex justify-end px-6">
          <MediaHeader />
        </div>

        {/* Page content — only this scrolls */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
