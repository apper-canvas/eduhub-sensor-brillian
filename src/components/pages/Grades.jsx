import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import GradeBookTable from "@/components/organisms/GradeBookTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { gradeService } from "@/services/api/gradeService";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { toast } from "react-toastify";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [gradesData, studentsData, classesData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
        classService.getAll()
      ]);
      setGrades(gradesData);
      setStudents(studentsData);
      setClasses(classesData);
    } catch (err) {
      setError(err.message || "Failed to load grades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateGrade = async (gradeId, gradeData) => {
    try {
      const updatedGrade = await gradeService.update(gradeId, gradeData);
      setGrades(prev => prev.map(g => g.Id === gradeId ? updatedGrade : g));
    } catch (error) {
      throw error;
    }
  };

  const calculateOverallStats = () => {
    if (grades.length === 0) return { avgGrade: 0, totalAssignments: 0, gradingProgress: 0 };

    const avgGrade = Math.round(
      grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore * 100), 0) / grades.length
    );

    const totalAssignments = grades.length;
    const gradingProgress = 100; // All grades are recorded

    return { avgGrade, totalAssignments, gradingProgress };
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const stats = calculateOverallStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Grades
          </h1>
          <p className="text-gray-600 mt-1">
            Manage student grades and track academic performance
          </p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Grade
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="BarChart" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{stats.avgGrade}%</p>
              <p className="text-blue-700">Class Average</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="FileText" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">{stats.totalAssignments}</p>
              <p className="text-green-700">Total Assignments</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">{stats.gradingProgress}%</p>
              <p className="text-purple-700">Grading Complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Book Table */}
      {grades.length > 0 ? (
        <GradeBookTable
          grades={grades}
          students={students}
          classes={classes}
          onUpdateGrade={handleUpdateGrade}
        />
      ) : (
        <Empty
          title="No grades recorded"
          description="Start by adding grades for your students' assignments and assessments."
          actionLabel="Add First Grade"
          icon="GraduationCap"
        />
      )}
    </div>
  );
};

export default Grades;