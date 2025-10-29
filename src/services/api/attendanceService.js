import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'attendance_c';

export const attendanceService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(TABLE_NAME, id, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ]
      });

      if (!response.success) {
        throw new Error(response.message || "Attendance record not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByStudentId(studentId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ],
        where: [{ FieldName: "student_id_c", Operator: "EqualTo", Values: [parseInt(studentId)] }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by student:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByClassId(classId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ],
        where: [{ FieldName: "class_id_c", Operator: "EqualTo", Values: [parseInt(classId)] }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by class:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByDateRange(startDate, endDate) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ],
        whereGroups: [{
          operator: "AND",
          subGroups: [{
            conditions: [
              { fieldName: "date_c", operator: "GreaterThanOrEqualTo", values: [startDate] },
              { fieldName: "date_c", operator: "LessThanOrEqualTo", values: [endDate] }
            ],
            operator: "AND"
          }]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by date range:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(attendanceData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Name: `Attendance ${attendanceData.date_c}`,
          student_id_c: attendanceData.student_id_c?.Id || parseInt(attendanceData.student_id_c),
          class_id_c: attendanceData.class_id_c?.Id || parseInt(attendanceData.class_id_c),
          date_c: attendanceData.date_c || new Date().toISOString().split('T')[0],
          status_c: attendanceData.status_c,
          notes_c: attendanceData.notes_c || ''
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
          console.error(`Failed to create attendance:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create attendance record");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating attendance:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, attendanceData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Id: parseInt(id),
          Name: `Attendance ${attendanceData.date_c}`,
          student_id_c: attendanceData.student_id_c?.Id || parseInt(attendanceData.student_id_c),
          class_id_c: attendanceData.class_id_c?.Id || parseInt(attendanceData.class_id_c),
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c,
          notes_c: attendanceData.notes_c
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
          console.error(`Failed to update attendance:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update attendance record");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating attendance:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete attendance:`, failed);
          throw new Error("Failed to delete attendance record");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting attendance:", error?.response?.data?.message || error);
      throw error;
    }
  }
};