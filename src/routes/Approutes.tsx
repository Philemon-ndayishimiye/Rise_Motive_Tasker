import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import AdminLayout from "@/layouts/Admin/AdminLayout";
import Application from "@/layouts/Admin/Application";
import Dashboard from "@/layouts/Admin/Dashboard";
import Governemnt from "@/layouts/Admin/Governemnt";
import Web from "@/layouts/Admin/Web";
import CreativePage from "@/layouts/Admin/CreativePage";
import LegalandOfficialServices from "@/layouts/Admin/LegalandOfficialServices";
import StudentApplication from "@/layouts/Admin/StudentApplication";
import ViewStaff from "@/layouts/Admin/ViewStaff";
import OrderedProduct from "@/layouts/Admin/OrderedProduct";
import Notifications from "@/layouts/Admin/Notifications";
import Settings from "@/layouts/Admin/Settings";
import ProfilePage from "@/layouts/Admin/ProfilePage";
import ViewProduct from "@/layouts/Admin/ViewProduct";
//import Information from "@/layouts/Admin/Information";
import Login from "@/pages/Login";
import InfoPostAdmin from "@/layouts/Admin/Information";
import SpotService from "@/layouts/Admin/SpotService";
import Courses from "@/layouts/Admin/Courses";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* All routes inside RootLayout get Navbar + Footer */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Login />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="government" element={<Governemnt />} />
          <Route path="applications" element={<Application />} />
          <Route path="order" element={<OrderedProduct />} />
          <Route path="staff" element={<ViewStaff />} />
          <Route path="creative" element={<CreativePage />} />
          <Route path="web" element={<Web />} />
          <Route path="students" element={<StudentApplication />} />
          <Route path="legal" element={<LegalandOfficialServices />} />
          <Route path="notification" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="products" element={<ViewProduct />} />
          <Route path="info" element={<InfoPostAdmin />} />
          <Route path="spotservice" element={<SpotService />} />
          <Route path="course" element={<Courses />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
