import staffData from '@/services/mockData/staff.json';

// Simulate API delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// In-memory storage (simulates database)
let staffStore = [...staffData];

export const staffService = {
  // Get all staff members
  async getAll() {
    await delay(500);
    return [...staffStore];
  },

  // Get staff member by ID
  async getById(id) {
    await delay(300);
    const staff = staffStore.find(s => s.Id === parseInt(id));
    if (!staff) {
      throw new Error('Staff member not found');
    }
    return { ...staff };
  },

  // Create new staff member
  async create(staffData) {
    await delay(600);
    
    // Validate required fields
    if (!staffData.fullName || !staffData.email || !staffData.role) {
      throw new Error('Full name, email, and role are required');
    }

    // Check for duplicate email
    if (staffStore.some(s => s.email.toLowerCase() === staffData.email.toLowerCase())) {
      throw new Error('A staff member with this email already exists');
    }

    // Generate new ID
    const maxId = staffStore.length > 0 
      ? Math.max(...staffStore.map(s => s.Id))
      : 0;
    
    const newStaff = {
      Id: maxId + 1,
      fullName: staffData.fullName.trim(),
      email: staffData.email.trim().toLowerCase(),
      role: staffData.role,
      department: staffData.department?.trim() || '',
      phoneNumber: staffData.phoneNumber?.trim() || '',
      hireDate: staffData.hireDate || new Date().toISOString(),
      status: staffData.status || 'Active',
    };

    staffStore.push(newStaff);
    return { ...newStaff };
  },

  // Update existing staff member
  async update(id, staffData) {
    await delay(600);
    
    const index = staffStore.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Staff member not found');
    }

    // Validate required fields
    if (!staffData.fullName || !staffData.email || !staffData.role) {
      throw new Error('Full name, email, and role are required');
    }

    // Check for duplicate email (excluding current staff)
    if (staffStore.some(s => 
      s.Id !== parseInt(id) && 
      s.email.toLowerCase() === staffData.email.toLowerCase()
    )) {
      throw new Error('A staff member with this email already exists');
    }

    const updatedStaff = {
      ...staffStore[index],
      fullName: staffData.fullName.trim(),
      email: staffData.email.trim().toLowerCase(),
      role: staffData.role,
      department: staffData.department?.trim() || staffStore[index].department,
      phoneNumber: staffData.phoneNumber?.trim() || staffStore[index].phoneNumber,
      hireDate: staffData.hireDate || staffStore[index].hireDate,
      status: staffData.status || staffStore[index].status,
    };

    staffStore[index] = updatedStaff;
    return { ...updatedStaff };
  },

  // Delete staff member
  async delete(id) {
    await delay(400);
    
    const index = staffStore.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Staff member not found');
    }

    const deleted = staffStore[index];
    staffStore.splice(index, 1);
    return { ...deleted };
  },

  // Search staff by query
  async search(query) {
    await delay(400);
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) {
      return [...staffStore];
    }

    return staffStore.filter(staff => 
      staff.fullName.toLowerCase().includes(lowerQuery) ||
      staff.email.toLowerCase().includes(lowerQuery) ||
      staff.department.toLowerCase().includes(lowerQuery) ||
      staff.role.toLowerCase().includes(lowerQuery)
    );
  },

  // Filter staff by role
  async filterByRole(role) {
    await delay(300);
    
    if (!role || role === 'all') {
      return [...staffStore];
    }

    return staffStore.filter(staff => staff.role === role);
  },

  // Get staff by department
  async getByDepartment(department) {
    await delay(300);
    return staffStore.filter(staff => 
      staff.department.toLowerCase() === department.toLowerCase()
    );
  },

  // Get active staff only
  async getActive() {
    await delay(300);
    return staffStore.filter(staff => staff.status === 'Active');
  },

  // Get staff statistics
  async getStats() {
    await delay(200);
    
    return {
      total: staffStore.length,
      active: staffStore.filter(s => s.status === 'Active').length,
      onLeave: staffStore.filter(s => s.status === 'On Leave').length,
      inactive: staffStore.filter(s => s.status === 'Inactive').length,
      byRole: {
        teachers: staffStore.filter(s => s.role === 'Teacher').length,
        administrators: staffStore.filter(s => s.role === 'Administrator').length,
        counselors: staffStore.filter(s => s.role === 'Counselor').length,
        itSupport: staffStore.filter(s => s.role === 'IT Support').length,
      },
    };
  },
};