import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { attendanceService } from "@/services/api/attendanceService";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { toast } from "react-toastify";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [attendanceData, studentsData, classesData] = await Promise.all([
        attendanceService.getAll(),
        studentService.getAll(),
        classService.getAll()
      ]);
      setAttendance(attendanceData);
      setStudents(studentsData);
      setClasses(classesData);
    } catch (err) {
      setError(err.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateAttendance = async (attendanceId, attendanceData) => {
    try {
      if (attendanceId) {
        const updatedRecord = await attendanceService.update(attendanceId, attendanceData);
        setAttendance(prev => prev.map(a => a.Id === attendanceId ? updatedRecord : a));
      } else {
        const newRecord = await attendanceService.create(attendanceData);
        setAttendance(prev => [...prev, newRecord]);
      }
    } catch (error) {
      throw error;
    }
  };

  const calculateAttendanceStats = () => {
    if (attendance.length === 0) return { presentRate: 0, absentRate: 0, lateRate: 0 };

    const present = attendance.filter(a => a.status === "present").length;
    const absent = attendance.filter(a => a.status === "absent").length;
    const late = attendance.filter(a => a.status === "late").length;
    const total = attendance.length;

    return {
      presentRate: Math.round((present / total) * 100),
      absentRate: Math.round((absent / total) * 100),
      lateRate: Math.round((late / total) * 100)
    };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const stats = calculateAttendanceStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Attendance
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage student attendance records
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
            Quick Mark
          </Button>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">{stats.presentRate}%</p>
                <p className="text-green-700">Present Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <ApperIcon name="XCircle" className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-900">{stats.absentRate}%</p>
                <p className="text-red-700">Absent Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <ApperIcon name="Clock" className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-900">{stats.lateRate}%</p>
                <p className="text-yellow-700">Late Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Grid */}
      <AttendanceGrid
        attendance={attendance}
        students={students}
        classes={classes}
        onUpdateAttendance={handleUpdateAttendance}
      />

      {/* Recent Absences */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="AlertTriangle" className="w-5 h-5 mr-2" />
            Recent Absences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendance
              .filter(a => a.status === "absent")
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
              .map((record) => {
                const student = students.find(s => s.Id === parseInt(record.studentId));
                return (
                  <div key={record.Id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <ApperIcon name="User" className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {student ? `${student.firstName} ${student.lastName}` : "Unknown Student"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Absent
                      </span>
                      {record.notes && (
                        <p className="text-xs text-gray-500 mt-1">{record.notes}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            {attendance.filter(a => a.status === "absent").length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="CheckCircle" className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No recent absences - great attendance!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;