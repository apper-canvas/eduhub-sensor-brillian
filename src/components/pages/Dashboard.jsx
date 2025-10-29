import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setError("");
      setLoading(true);

      const [studentsData, classesData, gradesData, attendanceData] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);

      setStudents(studentsData);
      setClasses(classesData);
      setGrades(gradesData);
      setAttendance(attendanceData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const calculateStats = () => {
    const activeStudents = students.filter(s => s.status === "Active").length;
    const totalClasses = classes.length;
    
    const recentAttendance = attendance.filter(a => {
      const recordDate = new Date(a.date);
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      return recordDate >= lastWeek;
    });
    
    const presentCount = recentAttendance.filter(a => a.status === "present").length;
    const attendanceRate = recentAttendance.length > 0 ? 
      Math.round((presentCount / recentAttendance.length) * 100) : 0;

    const recentGrades = grades.filter(g => {
      const gradeDate = new Date(g.date);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return gradeDate >= lastMonth;
    });

    const avgGrade = recentGrades.length > 0 ?
      Math.round(recentGrades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / recentGrades.length) : 0;

    return {
      activeStudents,
      totalClasses,
      attendanceRate,
      avgGrade
    };
  };

  const getRecentActivities = () => {
    const activities = [];

    // Recent grades
    const sortedGrades = [...grades]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);

    sortedGrades.forEach(grade => {
      const student = students.find(s => s.Id === parseInt(grade.studentId));
      if (student) {
        activities.push({
          type: "grade",
          description: `${student.firstName} ${student.lastName} received ${grade.score}/${grade.maxScore} on ${grade.assignmentName}`,
          time: grade.date,
          icon: "BookOpen",
          color: "blue"
        });
      }
    });

    // Recent attendance
    const recentAbsences = attendance
      .filter(a => a.status === "absent")
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 2);

    recentAbsences.forEach(record => {
      const student = students.find(s => s.Id === parseInt(record.studentId));
      if (student) {
        activities.push({
          type: "attendance",
          description: `${student.firstName} ${student.lastName} was absent`,
          time: record.date,
          icon: "Calendar",
          color: "red"
        });
      }
    });

    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const stats = calculateStats();
  const recentActivities = getRecentActivities();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          School Dashboard
        </h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at your school today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon="Users"
          color="blue"
          change={"+5.2%"}
          changeType="positive"
        />
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          icon="BookOpen"
          color="green"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon="Calendar"
          color="yellow"
          change={"+2.1%"}
          changeType="positive"
        />
        <StatCard
          title="Average Grade"
          value={`${stats.avgGrade}%`}
          icon="GraduationCap"
          color="purple"
          change="+3.4%"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="Activity" className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.color === "blue" ? "bg-blue-100 text-blue-600" :
                    activity.color === "red" ? "bg-red-100 text-red-600" :
                    activity.color === "green" ? "bg-green-100 text-green-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    <ApperIcon name={activity.icon} className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.time).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Clock" className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Class Overview */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="School" className="w-5 h-5 mr-2" />
              Class Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.slice(0, 5).map((classItem) => (
                <div key={classItem.Id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="font-medium text-gray-900">{classItem.name}</h4>
                    <p className="text-sm text-gray-600">{classItem.teacher}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">
                      {classItem.students.length}/{classItem.maxCapacity}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{classItem.room}</p>
                  </div>
                </div>
              ))}
              {classes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="BookOpen" className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No classes configured</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="Zap" className="w-5 h-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group">
              <ApperIcon name="UserPlus" className="w-8 h-8 text-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-primary-700">Add Student</p>
            </button>
            <button className="p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group">
              <ApperIcon name="Plus" className="w-8 h-8 text-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-primary-700">Create Class</p>
            </button>
            <button className="p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group">
              <ApperIcon name="FileText" className="w-8 h-8 text-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-primary-700">Add Grade</p>
            </button>
            <button className="p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group">
              <ApperIcon name="Calendar" className="w-8 h-8 text-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-primary-700">Take Attendance</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;