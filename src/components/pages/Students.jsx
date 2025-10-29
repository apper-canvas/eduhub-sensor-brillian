import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StudentCard from "@/components/organisms/StudentCard";
import StudentModal from "@/components/organisms/StudentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { toast } from "react-toastify";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const loadStudents = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.grade.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleSaveStudent = async (studentData) => {
    try {
      if (editingStudent) {
        const updatedStudent = await studentService.update(editingStudent.Id, studentData);
        setStudents(prev => prev.map(s => s.Id === editingStudent.Id ? updatedStudent : s));
        toast.success("Student updated successfully");
      } else {
        const newStudent = await studentService.create(studentData);
        setStudents(prev => [...prev, newStudent]);
        toast.success("Student added successfully");
      }
      setShowModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to save student");
      throw error;
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await studentService.delete(studentId);
      setStudents(prev => prev.filter(s => s.Id !== studentId));
      toast.success("Student deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete student");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (loading) return <Loading variant="cards" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your student roster and information
          </p>
        </div>
        <Button onClick={handleAddStudent} variant="primary" className="shrink-0">
          <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search students by name, email, or grade..."
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={handleClearSearch}
            />
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Total: <strong>{students.length}</strong> students</span>
            <span>Active: <strong>{students.filter(s => s.status === "Active").length}</strong></span>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.Id}
              student={student}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          ))}
        </div>
      ) : (
        <Empty
          title={searchQuery ? "No students found" : "No students yet"}
          description={
            searchQuery 
              ? "Try adjusting your search terms or filters."
              : "Start by adding your first student to the system."
          }
          action={searchQuery ? undefined : handleAddStudent}
          actionLabel="Add First Student"
          icon="Users"
        />
      )}

      {/* Student Modal */}
      <StudentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveStudent}
        student={editingStudent}
      />
    </div>
  );
};

export default Students;