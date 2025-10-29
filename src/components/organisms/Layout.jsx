import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard", current: location.pathname === "/" },
    { name: "Students", href: "/students", icon: "Users", current: location.pathname.startsWith("/students") },
    { name: "Classes", href: "/classes", icon: "BookOpen", current: location.pathname.startsWith("/classes") },
    { name: "Grades", href: "/grades", icon: "GraduationCap", current: location.pathname.startsWith("/grades") },
    { name: "Attendance", href: "/attendance", icon: "Calendar", current: location.pathname.startsWith("/attendance") },
    { name: "Reports", href: "/reports", icon: "BarChart3", current: location.pathname.startsWith("/reports") }
  ];

  const handleNavigation = (href) => {
    navigate(href);
    setSidebarOpen(false);
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              EduHub
            </h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  item.current
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-r-2 border-primary-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <ApperIcon
                  name={item.icon}
                  className={`mr-3 h-5 w-5 transition-colors ${
                    item.current ? "text-primary-600" : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex flex-col max-w-xs w-full bg-white shadow-xl transform transition-transform">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <ApperIcon name="X" className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4 mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-3">
                  <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  EduHub
                </h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-200 ${
                      item.current
                        ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <ApperIcon
                      name={item.icon}
                      className={`mr-4 h-6 w-6 transition-colors ${
                        item.current ? "text-primary-600" : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <DesktopSidebar />
      <MobileSidebar />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <ApperIcon name="Menu" className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-2">
                <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                EduHub
              </h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;