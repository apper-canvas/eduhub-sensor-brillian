import React from "react";

const Loading = ({ variant = "default" }) => {
  if (variant === "table") {
    return (
      <div className="animate-pulse">
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex space-x-4 p-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="rounded-full bg-gray-200 h-16 w-16"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-8 bg-gray-200 rounded w-24 mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-pulse text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto mb-4 animate-bounce"></div>
        <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
      </div>
    </div>
  );
};

export default Loading;