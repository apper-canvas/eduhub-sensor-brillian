import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        {/* 404 Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <ApperIcon
              name="AlertTriangle"
              size={120}
              className="text-blue-600 opacity-20"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                404
              </span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Page Not Found
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            onClick={() => navigate("/")}
            className="min-w-[160px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <ApperIcon name="Home" size={20} />
            Go to Home
          </Button>
          <Button
            onClick={() => navigate(-1)}
            className="min-w-[160px] bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <ApperIcon name="ArrowLeft" size={20} />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Quick Links</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate("/students")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
            >
              Students
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => navigate("/classes")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
            >
              Classes
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => navigate("/attendance")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
            >
              Attendance
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => navigate("/grades")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
            >
              Grades
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}