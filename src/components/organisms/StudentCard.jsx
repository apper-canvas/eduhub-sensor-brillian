import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StudentCard = ({ student, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/students/${student.Id}`);
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "active";
      case "inactive":
        return "inactive";
      default:
        return "default";
    }
  };

  const getGradeLevel = (grade) => {
    if (!grade) return "N/A";
    return grade;
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
            {student.photo ? (
              <img
                src={student.photo}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <ApperIcon name="User" className="w-8 h-8 text-primary-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-sm text-gray-600 mb-1">Grade {getGradeLevel(student.grade)}</p>
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusVariant(student.status)}>
                {student.status || "Active"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Mail" className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{student.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Phone" className="w-4 h-4 mr-2 text-gray-400" />
            <span>{student.phone || "N/A"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2 text-gray-400" />
            <span>Enrolled {new Date(student.enrollmentDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="primary"
            onClick={handleViewProfile}
            className="flex-1"
          >
            <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(student)}
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(student.Id)}
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;