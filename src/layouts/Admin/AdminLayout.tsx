import { Outlet, NavLink } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import {
  Globe,
  FileText,
  Palette,
  Code,
  Scale,
  CircleAlert,
  Package,
  Box,
  GraduationCap,
  UserPlus,
} from "lucide-react";
import AdminHeader from "./AdminHeader";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
    isActive ? "bg-blue-600 text-blue-100" : "hover:bg-blue-700/40 text-white"
  }`;

export default function AdminLayout() {
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
            <NavLink to="/admin/dashboard" className="leading-tight">
              <h2 className="font-extrabold text-[17px] tracking-wide text-[#1E3A8A] group-hover:text-blue-500 transition-colors duration-200 pb-2 font-family-playfair">
                RISEMOTIVE
              </h2>
              <p className="text-[11px] font-medium text-blue-400 tracking-wide font-family-playfair">
                Building Skills. Delivering Solutions
              </p>
            </NavLink>
          </div>
        </div>

        <h1 className="text-[20px] font-bold mb-3 pt-5 text-center">
          Admin Panel
        </h1>

        <ul className="space-y-1 font-family-playfair text-[16px]">
          <li>
            <NavLink to="/admin/government" className={navLinkClass}>
              <Globe size={15} />
              <h1 className="text-[14.5px]">
                e-Government and Online Services
              </h1>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/applications" className={navLinkClass}>
              <FileText size={15} />
              <h1 className="text-[14.5px]">Applications and Documentation</h1>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/creative" className={navLinkClass}>
              <Palette size={15} />
              <h1 className="text-[14.5px]">Creative and Media Services</h1>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/web" className={navLinkClass}>
              <Code size={15} />
              <h1 className="text-[14.5px]">Web and Digital Solution</h1>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/course" className={navLinkClass}>
              <Scale size={15} />
              <h1 className="text-[14.5px]">Courses</h1>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/students" className={navLinkClass}>
              <GraduationCap size={15} />
              <h1 className="text-[14.5px]">Student Applications</h1>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/order" className={navLinkClass}>
              <Package size={15} />
              <h1 className="text-[14.5px]">View Ordered Product</h1>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" className={navLinkClass}>
              <Box size={15} />
              <h1 className="text-[14.5px]">View Product</h1>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/info" className={navLinkClass}>
              <CircleAlert size={15} />
              <h1 className="text-[14.5px]">View Information</h1>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/staff" className={navLinkClass}>
              <UserPlus size={15} />
              <h1 className="text-[14.5px]">View Staff</h1>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/spotservice" className={navLinkClass}>
              <UserPlus size={15} />
              <h1 className="text-[14.5px]">Spot Service</h1>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex justify-end px-6">
          <AdminHeader />
        </div>

        {/* Page content — only this scrolls */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
