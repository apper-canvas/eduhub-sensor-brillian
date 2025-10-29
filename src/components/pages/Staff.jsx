import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/atoms/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { staffService } from '@/services/api/staffService';
import { toast } from 'react-toastify';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [staff, searchQuery, roleFilter]);

  async function loadStaff() {
    try {
      setLoading(true);
      setError(null);
      const data = await staffService.getAll();
      setStaff(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  }

  function filterStaff() {
    let filtered = [...staff];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.fullName.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.department.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((member) => member.role === roleFilter);
    }

    setFilteredStaff(filtered);
  }

  function handleAddStaff() {
    setEditingStaff(null);
    setIsModalOpen(true);
  }

  function handleEditStaff(staffMember) {
    setEditingStaff(staffMember);
    setIsModalOpen(true);
  }

  async function handleSaveStaff(staffData) {
    try {
      if (editingStaff) {
        await staffService.update(editingStaff.Id, staffData);
        toast.success('Staff member updated successfully');
      } else {
        await staffService.create(staffData);
        toast.success('Staff member added successfully');
      }
      setIsModalOpen(false);
      setEditingStaff(null);
      await loadStaff();
    } catch (err) {
      toast.error(err.message || 'Failed to save staff member');
    }
  }

  async function handleDeleteStaff(staffId) {
    if (!confirm('Are you sure you want to delete this staff member?')) {
      return;
    }

    try {
      await staffService.delete(staffId);
      toast.success('Staff member deleted successfully');
      await loadStaff();
    } catch (err) {
      toast.error(err.message || 'Failed to delete staff member');
    }
  }

  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
  }

  function handleClearSearch() {
    setSearchQuery('');
  }

  function handleRoleFilterChange(e) {
    setRoleFilter(e.target.value);
  }

  function getRoleBadgeVariant(role) {
    const variants = {
      Teacher: 'default',
      Administrator: 'destructive',
      Counselor: 'secondary',
      'IT Support': 'outline',
    };
    return variants[role] || 'default';
  }

  function getStatusBadgeVariant(status) {
    return status === 'Active' ? 'success' : 'secondary';
  }

  if (loading) {
    return <Loading message="Loading staff members..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStaff} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage staff members and their information</p>
        </div>
        <Button onClick={handleAddStaff} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={20} />
          Add Staff Member
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            placeholder="Search by name, email, or department..."
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={roleFilter} onChange={handleRoleFilterChange}>
            <option value="all">All Roles</option>
            <option value="Teacher">Teacher</option>
            <option value="Administrator">Administrator</option>
            <option value="Counselor">Counselor</option>
            <option value="IT Support">IT Support</option>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{staff.length}</p>
              </div>
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={24} className="text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Teachers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {staff.filter((s) => s.role === 'Teacher').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={24} className="text-secondary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Administrators</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {staff.filter((s) => s.role === 'Administrator').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Shield" size={24} className="text-accent-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {staff.filter((s) => s.status === 'Active').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <Empty
          message={
            searchQuery || roleFilter !== 'all'
              ? 'No staff members match your filters'
              : 'No staff members found'
          }
          action={
            searchQuery || roleFilter !== 'all' ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('all');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button onClick={handleAddStaff}>Add First Staff Member</Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <Card key={member.Id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {member.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.fullName}</CardTitle>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(member.status)}>{member.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(member.role)}>{member.role}</Badge>
                  <span className="text-sm text-gray-600">{member.department}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ApperIcon name="Phone" size={16} />
                    <span>{member.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ApperIcon name="Calendar" size={16} />
                    <span>Hired: {new Date(member.hireDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditStaff(member)}
                    className="flex-1"
                  >
                    <ApperIcon name="Edit" size={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteStaff(member.Id)}
                    className="flex-1"
                  >
                    <ApperIcon name="Trash2" size={16} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Staff Modal */}
      {isModalOpen && (
        <StaffModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStaff(null);
          }}
          onSave={handleSaveStaff}
          staff={editingStaff}
        />
      )}
    </div>
  );
}

function StaffModal({ isOpen, onClose, onSave, staff }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Teacher',
    department: '',
    phoneNumber: '',
    hireDate: '',
    status: 'Active',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (staff) {
      setFormData({
        fullName: staff.fullName,
        email: staff.email,
        role: staff.role,
        department: staff.department,
        phoneNumber: staff.phoneNumber,
        hireDate: staff.hireDate.split('T')[0],
        status: staff.status,
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        role: 'Teacher',
        department: '',
        phoneNumber: '',
        hireDate: new Date().toISOString().split('T')[0],
        status: 'Active',
      });
    }
  }, [staff]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.department.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {staff ? 'Edit Staff Member' : 'Add Staff Member'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <Select name="role" value={formData.role} onChange={handleChange} required>
                <option value="Teacher">Teacher</option>
                <option value="Administrator">Administrator</option>
                <option value="Counselor">Counselor</option>
                <option value="IT Support">IT Support</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Mathematics"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hire Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? 'Saving...' : staff ? 'Update Staff' : 'Add Staff'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}