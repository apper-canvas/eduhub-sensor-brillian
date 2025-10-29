import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);
      setClasses(classesData);
      setStudents(studentsData);
    } catch (err) {
      setError(err.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStudentNames = (studentIds) => {
    if (!studentIds || studentIds.length === 0) return [];
    return studentIds.map(id => {
      const student = students.find(s => s.Id === parseInt(id));
      return student ? `${student.firstName} ${student.lastName}` : "Unknown";
    });
  };

  const getCapacityColor = (enrolled, max) => {
    const percentage = (enrolled / max) * 100;
    if (percentage >= 90) return "danger";
    if (percentage >= 75) return "warning";
    return "success";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Classes
          </h1>
          <p className="text-gray-600 mt-1">
            Manage class schedules and student enrollments
          </p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      {/* Classes Grid */}
      {classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => {
            const enrolledCount = classItem.students.length;
            const capacityPercentage = Math.round((enrolledCount / classItem.maxCapacity) * 100);

            return (
              <Card key={classItem.Id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {classItem.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{classItem.subject}</p>
                    </div>
                    <Badge variant={getCapacityColor(enrolledCount, classItem.maxCapacity)}>
                      {capacityPercentage}% Full
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <ApperIcon name="User" className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{classItem.teacher}</span>
                  </div>

                  <div className="flex items-center">
                    <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{classItem.room}</span>
                  </div>

                  <div className="flex items-start">
                    <ApperIcon name="Clock" className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-700">
                        {classItem.schedule.slice(0, 2).map((time, index) => (
                          <div key={index}>{time}</div>
                        ))}
                        {classItem.schedule.length > 2 && (
                          <div className="text-gray-500">
                            +{classItem.schedule.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Enrollment</span>
                      <span className="text-sm text-gray-600">
                        {enrolledCount} / {classItem.maxCapacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          capacityPercentage >= 90
                            ? "bg-red-500"
                            : capacityPercentage >= 75
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${capacityPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="primary" className="flex-1">
                      <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="secondary">
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="danger">
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Empty
          title="No classes yet"
          description="Start by creating your first class to organize students and schedules."
          actionLabel="Create First Class"
          icon="BookOpen"
        />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
            <p className="text-sm text-gray-600">Total Classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Users" className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {classes.reduce((sum, c) => sum + c.students.length, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Enrollments</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="User" className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(classes.map(c => c.teacher)).size}
            </p>
            <p className="text-sm text-gray-600">Teachers</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="MapPin" className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(classes.map(c => c.room)).size}
            </p>
            <p className="text-sm text-gray-600">Rooms</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Classes;