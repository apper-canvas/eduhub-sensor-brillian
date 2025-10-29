import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const StudentModal = ({ isOpen, onClose, onSave, student = null }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    grade: "",
    address: "",
    parentContact: "",
    status: "Active"
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        phone: student.phone || "",
        grade: student.grade || "",
        address: student.address || "",
        parentContact: student.parentContact || "",
        status: student.status || "Active"
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        grade: "",
        address: "",
        parentContact: "",
        status: "Active"
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.grade.trim()) newErrors.grade = "Grade is required";
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const studentData = {
        ...formData,
        enrollmentDate: student ? student.enrollmentDate : new Date().toISOString()
      };
      
      await onSave(studentData);
      onClose();
    } catch (error) {
      console.error("Error saving student:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const gradeOptions = [
    { value: "K", label: "Kindergarten" },
    { value: "1", label: "1st Grade" },
    { value: "2", label: "2nd Grade" },
    { value: "3", label: "3rd Grade" },
    { value: "4", label: "4th Grade" },
    { value: "5", label: "5th Grade" },
    { value: "6", label: "6th Grade" },
    { value: "7", label: "7th Grade" },
    { value: "8", label: "8th Grade" },
    { value: "9", label: "9th Grade" },
    { value: "10", label: "10th Grade" },
    { value: "11", label: "11th Grade" },
    { value: "12", label: "12th Grade" }
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {student ? "Edit Student" : "Add New Student"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
              required
              placeholder="Enter first name"
            />

            <FormField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
              required
              placeholder="Enter last name"
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
              placeholder="Enter email address"
            />

            <FormField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              placeholder="Enter phone number"
            />

            <FormField
              label="Grade"
              name="grade"
              type="select"
              value={formData.grade}
              onChange={handleInputChange}
              error={errors.grade}
              required
              options={gradeOptions}
            />

            <FormField
              label="Status"
              name="status"
              type="select"
              value={formData.status}
              onChange={handleInputChange}
              options={statusOptions}
            />

            <div className="md:col-span-2">
              <FormField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
                placeholder="Enter home address"
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Parent/Guardian Contact"
                name="parentContact"
                value={formData.parentContact}
                onChange={handleInputChange}
                error={errors.parentContact}
                placeholder="Enter parent/guardian contact information"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  {student ? "Update Student" : "Add Student"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;