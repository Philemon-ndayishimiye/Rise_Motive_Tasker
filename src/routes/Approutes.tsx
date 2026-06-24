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
//import ViewProduct from "@/layouts/Admin/ViewProduct";
//import Information from "@/layouts/Admin/Information";
import Login from "@/pages/Login";
import InfoPostAdmin from "@/layouts/Admin/Information";
import SpotService from "@/layouts/Admin/SpotService";
import Courses from "@/layouts/Admin/Courses";
import TaskerLayout from "@/layouts/Tasker/TaskerLayout";
import TaskerDashboard from "@/layouts/Tasker/Dashboard";
import MediaLayout from "@/layouts/Media/MediaLayout";
import MediaDashboard from "@/layouts/Media/MediaDashboard";
import ServiceRequest from "@/layouts/Tasker/ServiceRequest";
import TaskerSettings from "@/layouts/Tasker/settings";
import TaskerProfile from "@/layouts/Tasker/TaskerProfile";
import MediaInformation from "@/layouts/Media/MediaInformtion";
import MediaProduct from "@/layouts/Media/MediaProduct";
import MediaSettings from "@/layouts/Media/MediaSettings";
import MediaProfile from "@/layouts/Media/MediaProfile";
import StaffMemberDashboard from "@/layouts/RM-Staff-Member/StaffMemberDashboard";
import StaffMemberInformation from "@/layouts/RM-Staff-Member/StaffMemberInformtion";
import StaffMemberLayout from "@/layouts/RM-Staff-Member/StaffMemberLayout";
import StaffMemberProduct from "@/layouts/RM-Staff-Member/StaffMemberProduct";
import StaffMemberProfile from "@/layouts/RM-Staff-Member/StaffMemberProfile";
import StaffMemberSettings from "@/layouts/RM-Staff-Member/StaffMemberSettings";
import StaffServiceRequests from "@/layouts/RM-Staff-Member/StaffMemberServiceRequest";
import RMStoreDashboard from "@/layouts/Senior-RMT-Store/RMStoreDashboard";
import RMStoreProduct from "@/layouts/Senior-RMT-Store/RMStoreProduct";
import RMStoreSettings from "@/layouts/Senior-RMT-Store/RMStoreSettings";
//import RMStoreServiceRequests from "@/layouts/Senior-RMT-Store/RMStoreServiceRequest";
import RMStoreLayout from "@/layouts/Senior-RMT-Store/RMStoreLayout";
import RMStoreProfile from "@/layouts/Senior-RMT-Store/RMStoreProfile";
import RMStoreCyberDashboard from "@/layouts/Senior-RMT-Store-andCyber/RMStoreCyberDashboard";
import RMStoreCyberLayout from "@/layouts/Senior-RMT-Store-andCyber/RMStoreCyberLayout";
import RMStoreCyberProduct from "@/layouts/Senior-RMT-Store-andCyber/RMStoreCyberProduct";
import RMStoreCyberProfile from "@/layouts/Senior-RMT-Store-andCyber/RMStoreCyberProfile";
import RMStoreCyberServiceRequests from "@/layouts/Senior-RMT-Store-andCyber/RMStoreCyberServiceRequest";
import RMStoreCyberSettings from "@/layouts/Senior-RMT-Store-andCyber/RMStoreCyberSettings";
import RMCyberDashboard from "@/layouts/Senior-RMT-Cyber/RMCyberDashboard";
import RMCyberLayout from "@/layouts/Senior-RMT-Cyber/RMCyberLayout";
import RMCyberProfile from "@/layouts/Senior-RMT-Cyber/RMCyberProfile";
import RMCyberServiceRequests from "@/layouts/Senior-RMT-Cyber/RMCyberServiceRequest";
import RMCyberSettings from "@/layouts/Senior-RMT-Cyber/RMCyberSettings";
import RMJuniorDashboard from "@/layouts/RM-Junior/RMJuniorDashboard";
import RMJuniorLayout from "@/layouts/RM-Junior/RMJuniorLayout";
import RMJuniorProfile from "@/layouts/RM-Junior/RMJuniorProfile";
import RMJuniorServiceRequests from "@/layouts/RM-Junior/RMJuniorServiceRequest";
import RMJuniorSettings from "@/layouts/RM-Junior/RMJuniorSettings";
import RMStoreCyberOrderedProduct from "@/layouts/Senior-RMT-Store-andCyber/RMStoreCyberOrderedProduct";
import RMStoreOrderedProduct from "@/layouts/Senior-RMT-Store/RMStoreOrderedProduct";
import StaffMemberOrderedProduct from "@/layouts/RM-Staff-Member/StaffMemberOrderedProduct";

// staff members
// RM store
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
          {/* <Route path="products" element={<ViewProduct />} /> */}
          <Route path="info" element={<InfoPostAdmin />} />
          <Route path="spotservice" element={<SpotService />} />
          <Route path="course" element={<Courses />} />
        </Route>

        {/* Tasker */}

        <Route path="/tasker" element={<TaskerLayout />}>
          <Route path="dashboard" element={<TaskerDashboard />} />
          <Route path="service" element={<ServiceRequest />} />
          <Route path="settings" element={<TaskerSettings />} />
          <Route path="profile" element={<TaskerProfile />} />
        </Route>

        {/* Media */}

        <Route path="/media" element={<MediaLayout />}>
          <Route path="dashboard" element={<MediaDashboard />} />
          <Route path="info" element={<MediaInformation />} />
          <Route path="products" element={<MediaProduct />} />
          <Route path="settings" element={<MediaSettings />} />
          <Route path="profile" element={<MediaProfile />} />
        </Route>

        {/* staff members */}

        <Route path="/staff" element={<StaffMemberLayout />}>
          <Route path="dashboard" element={<StaffMemberDashboard />} />
          <Route path="info" element={<StaffMemberInformation />} />
          <Route path="products" element={<StaffMemberProduct />} />
          <Route path="settings" element={<StaffMemberSettings />} />
          <Route path="profile" element={<StaffMemberProfile />} />
          <Route path="servicerequest" element={<StaffServiceRequests />} />
          <Route path="order" element={<StaffMemberOrderedProduct />} />
        </Route>

        {/** rmstore */}

        <Route path="/rmstore" element={<RMStoreLayout />}>
          <Route path="dashboard" element={<RMStoreDashboard />} />
          <Route path="products" element={<RMStoreProduct />} />
          <Route path="settings" element={<RMStoreSettings />} />
          <Route path="profile" element={<RMStoreProfile />} />
          <Route path="order" element={<RMStoreOrderedProduct />} />
        </Route>

        {/** RMStoreCyber */}

        <Route path="/rmstoreCyber" element={<RMStoreCyberLayout />}>
          <Route path="dashboard" element={<RMStoreCyberDashboard />} />
          <Route path="products" element={<RMStoreCyberProduct />} />
          <Route path="settings" element={<RMStoreCyberSettings />} />
          <Route path="profile" element={<RMStoreCyberProfile />} />
          <Route path="order" element={<RMStoreCyberOrderedProduct />} />
          <Route
            path="servicerequest"
            element={<RMStoreCyberServiceRequests />}
          />
        </Route>

        {/** rmcyber */}

        <Route path="/rmcyber" element={<RMCyberLayout />}>
          <Route path="dashboard" element={<RMCyberDashboard />} />
          <Route path="settings" element={<RMCyberSettings />} />
          <Route path="profile" element={<RMCyberProfile />} />
          <Route path="servicerequest" element={<RMJuniorServiceRequests />} />
        </Route>

        {/** rmjunior */}

        <Route path="/rmjunior" element={<RMJuniorLayout />}>
          <Route path="dashboard" element={<RMJuniorDashboard />} />
          <Route path="settings" element={<RMJuniorSettings />} />
          <Route path="profile" element={<RMJuniorProfile />} />
          <Route path="servicerequest" element={<RMCyberServiceRequests />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
