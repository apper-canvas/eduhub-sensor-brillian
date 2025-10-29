import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { documentService } from "@/services/api/documentService";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudentData = async () => {
    try {
      setError("");
      setLoading(true);

      const [studentData, gradesData, attendanceData, documentsData] = await Promise.all([
        studentService.getById(id),
        gradeService.getByStudentId(id),
        attendanceService.getByStudentId(id),
        documentService.getByStudentId(id)
      ]);

      setStudent(studentData);
      setGrades(gradesData);
      setAttendance(attendanceData);
      setDocuments(documentsData);
    } catch (err) {
      setError(err.message || "Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, [id]);

  const calculateGPA = () => {
    if (grades.length === 0) return "N/A";
    const totalPoints = grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore * 4), 0);
    return (totalPoints / grades.length).toFixed(2);
  };

  const calculateAttendanceRate = () => {
    if (attendance.length === 0) return "N/A";
    const presentDays = attendance.filter(a => a.status === "present").length;
    return Math.round((presentDays / attendance.length) * 100);
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

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStudentData} />;
  if (!student) return <Error message="Student not found" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/students")}
            className="p-2"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600">Student Profile</p>
          </div>
        </div>
        <Button variant="secondary">
          <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Info Card */}
        <div className="lg:col-span-1">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  {student.photo ? (
                    <img
                      src={student.photo}
                      alt={`${student.firstName} ${student.lastName}`}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <ApperIcon name="User" className="w-12 h-12 text-primary-600" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {student.firstName} {student.lastName}
                </h2>
                <Badge variant={getStatusVariant(student.status)}>
                  {student.status}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <ApperIcon name="GraduationCap" className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Grade</p>
                    <p className="font-medium">{student.grade}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <ApperIcon name="Mail" className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{student.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <ApperIcon name="Phone" className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{student.phone || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <ApperIcon name="MapPin" className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{student.address || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <ApperIcon name="Users" className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Parent Contact</p>
                    <p className="font-medium">{student.parentContact || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <ApperIcon name="Calendar" className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Enrolled</p>
                    <p className="font-medium">
                      {new Date(student.enrollmentDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Academic Performance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Trophy" className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{calculateGPA()}</p>
                <p className="text-sm text-gray-600">GPA</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Calendar" className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{calculateAttendanceRate()}%</p>
                <p className="text-sm text-gray-600">Attendance</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="BookOpen" className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{grades.length}</p>
                <p className="text-sm text-gray-600">Assignments</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Grades */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="GraduationCap" className="w-5 h-5 mr-2" />
                Recent Grades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {grades.slice(0, 5).map((grade) => {
                  const percentage = Math.round((grade.score / grade.maxScore) * 100);
                  const getGradeColor = (percentage) => {
                    if (percentage >= 90) return "success";
                    if (percentage >= 80) return "primary";
                    if (percentage >= 70) return "warning";
                    return "danger";
                  };

                  return (
                    <div key={grade.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{grade.assignmentName}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(grade.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getGradeColor(percentage)}>
                          {grade.score}/{grade.maxScore} ({percentage}%)
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                {grades.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="BookOpen" className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No grades recorded yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="FileText" className="w-5 h-5 mr-2" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <ApperIcon name="FileText" className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.title}</h4>
                        <p className="text-sm text-gray-600">
                          {doc.type} • {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Download" className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {documents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="FileText" className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No documents uploaded yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;