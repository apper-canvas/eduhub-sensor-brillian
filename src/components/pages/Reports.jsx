import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Chart from "react-apexcharts";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { classService } from "@/services/api/classService";

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState("overview");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [studentsData, gradesData, attendanceData, classesData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll(),
        classService.getAll()
      ]);
      setStudents(studentsData);
      setGrades(gradesData);
      setAttendance(attendanceData);
      setClasses(classesData);
    } catch (err) {
      setError(err.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const generateEnrollmentByGradeChart = () => {
    const gradeData = students.reduce((acc, student) => {
      const grade = student.grade || "Unknown";
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});

    return {
      options: {
        chart: {
          type: "donut",
          height: 350
        },
        labels: Object.keys(gradeData),
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
        legend: {
          position: "bottom"
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            }
          }
        }]
      },
      series: Object.values(gradeData)
    };
  };

  const generateAttendanceChart = () => {
    const attendanceData = attendance.reduce((acc, record) => {
      const status = record.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      options: {
        chart: {
          type: "bar",
          height: 350
        },
        xaxis: {
          categories: Object.keys(attendanceData)
        },
        colors: ["#10b981", "#ef4444", "#f59e0b"],
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
          }
        }
      },
      series: [{
        name: "Records",
        data: Object.values(attendanceData)
      }]
    };
  };

  const generateGradeDistributionChart = () => {
    const gradeRanges = {
      "A (90-100%)": 0,
      "B (80-89%)": 0,
      "C (70-79%)": 0,
      "D (60-69%)": 0,
      "F (0-59%)": 0
    };

    grades.forEach(grade => {
      const percentage = (grade.score / grade.maxScore) * 100;
      if (percentage >= 90) gradeRanges["A (90-100%)"]++;
      else if (percentage >= 80) gradeRanges["B (80-89%)"]++;
      else if (percentage >= 70) gradeRanges["C (70-79%)"]++;
      else if (percentage >= 60) gradeRanges["D (60-69%)"]++;
      else gradeRanges["F (0-59%)"]++;
    });

    return {
      options: {
        chart: {
          type: "bar",
          height: 350
        },
        xaxis: {
          categories: Object.keys(gradeRanges)
        },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#6b7280"],
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          }
        }
      },
      series: [{
        name: "Students",
        data: Object.values(gradeRanges)
      }]
    };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const enrollmentChart = generateEnrollmentByGradeChart();
  const attendanceChart = generateAttendanceChart();
  const gradeChart = generateGradeDistributionChart();

  const reportTypes = [
    { value: "overview", label: "Overview" },
    { value: "academic", label: "Academic Performance" },
    { value: "attendance", label: "Attendance Analysis" },
    { value: "enrollment", label: "Enrollment Statistics" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into school performance and trends
          </p>
        </div>
        <div className="flex space-x-3">
          <Select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="min-w-48"
          >
            {reportTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
          <Button variant="primary">
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Users" className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            <p className="text-sm text-gray-600">Total Students</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
            <p className="text-sm text-gray-600">Active Classes</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Calendar" className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round((attendance.filter(a => a.status === "present").length / attendance.length) * 100) || 0}%
            </p>
            <p className="text-sm text-gray-600">Attendance Rate</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(grades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / grades.length) || 0}%
            </p>
            <p className="text-sm text-gray-600">Average Grade</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment by Grade */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="PieChart" className="w-5 h-5 mr-2" />
              Student Enrollment by Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={enrollmentChart.options}
              series={enrollmentChart.series}
              type="donut"
              height={350}
            />
          </CardContent>
        </Card>

        {/* Attendance Overview */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="BarChart" className="w-5 h-5 mr-2" />
              Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={attendanceChart.options}
              series={attendanceChart.series}
              type="bar"
              height={350}
            />
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="BarChart3" className="w-5 h-5 mr-2" />
            Grade Distribution Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={gradeChart.options}
            series={gradeChart.series}
            type="bar"
            height={400}
          />
        </CardContent>
      </Card>

      {/* Detailed Reports Table */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="FileText" className="w-5 h-5 mr-2" />
            Class Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Class</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Teacher</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Students</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Avg Grade</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classItem) => {
                  const classGrades = grades.filter(g => parseInt(g.classId) === classItem.Id);
                  const avgGrade = classGrades.length > 0 
                    ? Math.round(classGrades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / classGrades.length)
                    : 0;
                  
                  const classAttendance = attendance.filter(a => parseInt(a.classId) === classItem.Id);
                  const attendanceRate = classAttendance.length > 0
                    ? Math.round((classAttendance.filter(a => a.status === "present").length / classAttendance.length) * 100)
                    : 0;

                  return (
                    <tr key={classItem.Id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{classItem.name}</p>
                          <p className="text-sm text-gray-600">{classItem.subject}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{classItem.teacher}</td>
                      <td className="py-4 px-4 text-center text-gray-900 font-medium">
                        {classItem.students.length}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-medium ${
                          avgGrade >= 90 ? "text-green-600" :
                          avgGrade >= 80 ? "text-blue-600" :
                          avgGrade >= 70 ? "text-yellow-600" :
                          "text-red-600"
                        }`}>
                          {avgGrade}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-medium ${
                          attendanceRate >= 90 ? "text-green-600" :
                          attendanceRate >= 80 ? "text-yellow-600" :
                          "text-red-600"
                        }`}>
                          {attendanceRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;