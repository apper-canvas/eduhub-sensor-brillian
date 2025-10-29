import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'student_c';

export const studentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "parent_contact_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "photo_c" } },
          { field: { Name: "status_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(TABLE_NAME, id, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "parent_contact_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "photo_c" } },
          { field: { Name: "status_c" } }
        ]
      });

      if (!response.success) {
        throw new Error(response.message || "Student not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(studentData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Name: `${studentData.first_name_c || ''} ${studentData.last_name_c || ''}`.trim(),
          first_name_c: studentData.first_name_c,
          last_name_c: studentData.last_name_c,
          email_c: studentData.email_c,
          phone_c: studentData.phone_c || '',
          grade_c: studentData.grade_c,
          address_c: studentData.address_c || '',
          parent_contact_c: studentData.parent_contact_c || '',
          enrollment_date_c: studentData.enrollment_date_c || new Date().toISOString().split('T')[0],
          photo_c: studentData.photo_c || '',
          status_c: studentData.status_c || 'Active'
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
          console.error(`Failed to create student:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create student");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, studentData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Id: parseInt(id),
          Name: `${studentData.first_name_c || ''} ${studentData.last_name_c || ''}`.trim(),
          first_name_c: studentData.first_name_c,
          last_name_c: studentData.last_name_c,
          email_c: studentData.email_c,
          phone_c: studentData.phone_c,
          grade_c: studentData.grade_c,
          address_c: studentData.address_c,
          parent_contact_c: studentData.parent_contact_c,
          enrollment_date_c: studentData.enrollment_date_c,
          photo_c: studentData.photo_c,
          status_c: studentData.status_c
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
          console.error(`Failed to update student:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update student");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete student:`, failed);
          throw new Error("Failed to delete student");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
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
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "parent_contact_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "photo_c" } },
          { field: { Name: "status_c" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [{
            conditions: [
              { fieldName: "first_name_c", operator: "Contains", values: [query] },
              { fieldName: "last_name_c", operator: "Contains", values: [query] },
              { fieldName: "email_c", operator: "Contains", values: [query] },
              { fieldName: "grade_c", operator: "Contains", values: [query] }
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
      console.error("Error searching students:", error?.response?.data?.message || error);
      return [];
    }
  }
};