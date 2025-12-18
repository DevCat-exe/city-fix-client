import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";

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
