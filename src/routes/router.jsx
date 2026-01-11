import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import Home from "../pages/Home";
import AllIssues from "../pages/AllIssues";
import IssueDetails from "../pages/IssueDetails";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import AboutUs from "../pages/AboutUs";
import ContactUs from "../pages/ContactUs";
import Blog from "../pages/Blog";
import BlogDetail from "../pages/BlogDetail";
import FAQ from "../pages/FAQ";
import Guides from "../pages/Guides";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
// Dashboard Components
import CitizenDashboard from "../pages/dashboard/Citizen/CitizenDashboard";
import CitizenOverview from "../pages/dashboard/Citizen/CitizenOverview";
import MyIssues from "../pages/dashboard/Citizen/MyIssues";
import ReportIssue from "../pages/dashboard/Citizen/ReportIssue";
import CitizenProfile from "../pages/dashboard/Citizen/CitizenProfile";
import StaffDashboard from "../pages/dashboard/Staff/StaffDashboard";
import StaffOverview from "../pages/dashboard/Staff/StaffOverview";
import AssignedIssues from "../pages/dashboard/Staff/AssignedIssues";
import StaffProfile from "../pages/dashboard/Staff/StaffProfile";
import AdminDashboard from "../pages/dashboard/Admin/AdminDashboard";
import AdminOverview from "../pages/dashboard/Admin/AdminOverview";
import ManageAllIssues from "../pages/dashboard/Admin/ManageAllIssues";
import ManageUsers from "../pages/dashboard/Admin/ManageUsers";
import ManageStaff from "../pages/dashboard/Admin/ManageStaff";
import PaymentsPage from "../pages/dashboard/Admin/PaymentsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "all-issues",
        Component: AllIssues,
      },
      {
        path: "issues/:id",
        element: (
          <ProtectedRoute>
            <IssueDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "about",
        Component: AboutUs,
      },
      {
        path: "contact",
        Component: ContactUs,
      },
      {
        path: "blog",
        Component: Blog,
      },
      {
        path: "blog/:id",
        Component: BlogDetail,
      },
      {
        path: "faq",
        Component: FAQ,
      },
      {
        path: "guides",
        Component: Guides,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "signup",
        Component: Signup,
      },
      {
        path: "forgot-password",
        Component: ForgotPassword,
      },
    ],
  },
  {
    path: "dashboard/citizen",
    element: (
      <ProtectedRoute allowedRoles={["citizen"]}>
        <CitizenDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        Component: CitizenOverview,
      },
      {
        path: "my-issues",
        Component: MyIssues,
      },
      {
        path: "report",
        Component: ReportIssue,
      },
      {
        path: "profile",
        Component: CitizenProfile,
      },
    ],
  },
  {
    path: "dashboard/staff",
    element: (
      <ProtectedRoute allowedRoles={["staff"]}>
        <StaffDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        Component: StaffOverview,
      },
      {
        path: "assigned",
        Component: AssignedIssues,
      },
      {
        path: "profile",
        Component: StaffProfile,
      },
    ],
  },
  {
    path: "dashboard/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        Component: AdminOverview,
      },
      {
        path: "all-issues",
        Component: ManageAllIssues,
      },
      {
        path: "users",
        Component: ManageUsers,
      },
      {
        path: "staff",
        Component: ManageStaff,
      },
      {
        path: "payments",
        Component: PaymentsPage,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
