import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'staff_c';

export const staffService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "full_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "phone_number_c" } },
          { field: { Name: "hire_date_c" } },
          { field: { Name: "status_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching staff:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(TABLE_NAME, id, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "full_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "phone_number_c" } },
          { field: { Name: "hire_date_c" } },
          { field: { Name: "status_c" } }
        ]
      });

      if (!response.success) {
        throw new Error(response.message || "Staff member not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching staff ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(staffData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Name: staffData.full_name_c,
          full_name_c: staffData.full_name_c,
          email_c: staffData.email_c,
          role_c: staffData.role_c,
          department_c: staffData.department_c || '',
          phone_number_c: staffData.phone_number_c || '',
          hire_date_c: staffData.hire_date_c || new Date().toISOString().split('T')[0],
          status_c: staffData.status_c || 'Active'
        }]
      };

      const response = await apperClient.createRecord(TABLE_NAME, payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create staff:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create staff member");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating staff:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, staffData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Id: parseInt(id),
          Name: staffData.full_name_c,
          full_name_c: staffData.full_name_c,
          email_c: staffData.email_c,
          role_c: staffData.role_c,
          department_c: staffData.department_c,
          phone_number_c: staffData.phone_number_c,
          hire_date_c: staffData.hire_date_c,
          status_c: staffData.status_c
        }]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update staff:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update staff member");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating staff:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord(TABLE_NAME, {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete staff:`, failed);
          throw new Error("Failed to delete staff member");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting staff:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async search(query) {
    try {
      if (!query) return this.getAll();

      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "full_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "phone_number_c" } },
          { field: { Name: "hire_date_c" } },
          { field: { Name: "status_c" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [{
            conditions: [
              { fieldName: "full_name_c", operator: "Contains", values: [query] },
              { fieldName: "email_c", operator: "Contains", values: [query] },
              { fieldName: "department_c", operator: "Contains", values: [query] },
              { fieldName: "role_c", operator: "Contains", values: [query] }
            ],
            operator: "OR"
          }]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching staff:", error?.response?.data?.message || error);
      return [];
    }
  },

  async filterByRole(role) {
    try {
      if (!role || role === 'all') return this.getAll();

      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "full_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "phone_number_c" } },
          { field: { Name: "hire_date_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [{ FieldName: "role_c", Operator: "EqualTo", Values: [role] }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error filtering staff by role:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByDepartment(department) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "full_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "phone_number_c" } },
          { field: { Name: "hire_date_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [{ FieldName: "department_c", Operator: "EqualTo", Values: [department] }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error getting staff by department:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getActive() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "full_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "phone_number_c" } },
          { field: { Name: "hire_date_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [{ FieldName: "status_c", Operator: "EqualTo", Values: ["Active"] }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error getting active staff:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getStats() {
    try {
      const allStaff = await this.getAll();

      return {
        total: allStaff.length,
        active: allStaff.filter(s => s.status_c === 'Active').length,
        onLeave: allStaff.filter(s => s.status_c === 'On Leave').length,
        inactive: allStaff.filter(s => s.status_c === 'Inactive').length,
        byRole: {
          teachers: allStaff.filter(s => s.role_c === 'Teacher').length,
          administrators: allStaff.filter(s => s.role_c === 'Administrator').length,
          counselors: allStaff.filter(s => s.role_c === 'Counselor').length,
          itSupport: allStaff.filter(s => s.role_c === 'IT Support').length,
        },
      };
    } catch (error) {
      console.error("Error getting staff stats:", error?.response?.data?.message || error);
      return {
        total: 0,
        active: 0,
        onLeave: 0,
        inactive: 0,
        byRole: {
          teachers: 0,
          administrators: 0,
          counselors: 0,
          itSupport: 0,
        },
      };
    }
  },
};