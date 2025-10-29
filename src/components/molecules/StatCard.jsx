import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, change, changeType, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    green: "text-green-600 bg-green-50 border-green-200",
    yellow: "text-yellow-600 bg-yellow-50 border-yellow-200",
    red: "text-red-600 bg-red-50 border-red-200",
    purple: "text-purple-600 bg-purple-50 border-purple-200"
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {value}
            </p>
            {change !== undefined && (
              <div className="flex items-center mt-2">
                <ApperIcon 
                  name={changeType === "positive" ? "TrendingUp" : "TrendingDown"}
                  className={`w-4 h-4 mr-1 ${
                    changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
                />
                <span className={`text-sm font-medium ${
                  changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${colorClasses[color]}`}>
              <ApperIcon name={icon} className="w-6 h-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;