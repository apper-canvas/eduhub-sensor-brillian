import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

// Lazy load all page components
const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Students = lazy(() => import("@/components/pages/Students"));
const StudentProfile = lazy(() => import("@/components/pages/StudentProfile"));
const Classes = lazy(() => import("@/components/pages/Classes"));
const Grades = lazy(() => import("@/components/pages/Grades"));
const Attendance = lazy(() => import("@/components/pages/Attendance"));
const Reports = lazy(() => import("@/components/pages/Reports"));
const Staff = lazy(() => import("@/components/pages/Staff"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg
        className="animate-spin h-12 w-12 text-blue-600 mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

// Wrap components with Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

// Define main routes
const mainRoutes = [
  {
    path: "",
    index: true,
    element: withSuspense(Dashboard),
  },
  {
    path: "students",
    element: withSuspense(Students),
  },
  {
    path: "students/:id",
    element: withSuspense(StudentProfile),
  },
  {
    path: "classes",
    element: withSuspense(Classes),
  },
  {
    path: "grades",
    element: withSuspense(Grades),
  },
  {
    path: "attendance",
    element: withSuspense(Attendance),
},
  {
    path: "reports",
    element: withSuspense(Reports),
  },
  {
    path: "staff",
    element: withSuspense(Staff),
  },
  {
    path: "*",
    element: withSuspense(NotFound),
  },
];

// Create router configuration
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes,
  },
];

export const router = createBrowserRouter(routes);