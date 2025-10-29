import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { format, addDays, startOfWeek } from "date-fns";

const AttendanceGrid = ({ attendance, students, classes, onUpdateAttendance }) => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === parseInt(studentId));
    return student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
  };

  const getAttendanceForDate = (studentId, date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return attendance.find(a => 
      parseInt(a.studentId) === parseInt(studentId) && 
      a.date.startsWith(dateStr)
    );
  };

  const handleAttendanceChange = async (studentId, date, status) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = getAttendanceForDate(studentId, date);

    try {
      if (existing) {
        await onUpdateAttendance(existing.Id, { ...existing, status });
      } else {
        const newAttendance = {
          studentId: studentId.toString(),
          classId: "1", // Default class
          date: dateStr,
          status,
          notes: ""
        };
        await onUpdateAttendance(null, newAttendance);
      }
      toast.success("Attendance updated successfully");
    } catch (error) {
      toast.error("Failed to update attendance");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return "present";
      case "absent":
        return "absent";
      case "late":
        return "late";
      default:
        return "default";
    }
  };

  const navigateWeek = (direction) => {
    const days = direction === "prev" ? -7 : 7;
    setSelectedWeek(prev => addDays(prev, days));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <ApperIcon name="Calendar" className="w-5 h-5 mr-2" />
            Weekly Attendance
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigateWeek("prev")}
            >
              <ApperIcon name="ChevronLeft" className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-gray-700">
              {format(weekStart, "MMM d")} - {format(addDays(weekStart, 4), "MMM d, yyyy")}
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigateWeek("next")}
            >
              <ApperIcon name="ChevronRight" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Student</th>
                {weekDays.map((day) => (
                  <th key={day.toISOString()} className="text-center py-3 px-4 font-semibold text-gray-900 min-w-24">
                    <div>
                      <div className="text-xs text-gray-500 uppercase">
                        {format(day, "EEE")}
                      </div>
                      <div className="text-sm">
                        {format(day, "MMM d")}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.Id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <ApperIcon name="User" className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </span>
                    </div>
                  </td>
                  {weekDays.map((day) => {
                    const attendanceRecord = getAttendanceForDate(student.Id, day);
                    const status = attendanceRecord?.status || "present";

                    return (
                      <td key={day.toISOString()} className="py-4 px-4 text-center">
                        <div className="flex justify-center space-x-1">
                          {["present", "absent", "late"].map((statusOption) => (
                            <button
                              key={statusOption}
                              onClick={() => handleAttendanceChange(student.Id, day, statusOption)}
                              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                                status === statusOption
                                  ? statusOption === "present"
                                    ? "bg-green-500 border-green-600 text-white"
                                    : statusOption === "absent"
                                    ? "bg-red-500 border-red-600 text-white"
                                    : "bg-yellow-500 border-yellow-600 text-white"
                                  : statusOption === "present"
                                    ? "border-green-300 hover:bg-green-100"
                                    : statusOption === "absent"
                                    ? "border-red-300 hover:bg-red-100"
                                    : "border-yellow-300 hover:bg-yellow-100"
                              }`}
                              title={statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                            >
                              <ApperIcon
                                name={
                                  statusOption === "present"
                                    ? "Check"
                                    : statusOption === "absent"
                                    ? "X"
                                    : "Clock"
                                }
                                className="w-4 h-4 mx-auto"
                              />
                            </button>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="text-center py-8">
              <ApperIcon name="Users" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No students found</p>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Legend</h4>
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Absent</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Late</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceGrid;