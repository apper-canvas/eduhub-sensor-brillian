import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'class_item_c';

export const classService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "teacher_c" } },
          { field: { Name: "room_c" } },
          { field: { Name: "max_capacity_c" } },
          { field: { Name: "students_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Parse students_c (comma-separated IDs) into array
      const data = (response.data || []).map(item => ({
        ...item,
        students: item.students_c ? item.students_c.split(',').map(id => parseInt(id.trim())) : []
      }));

      return data;
    } catch (error) {
      console.error("Error fetching classes:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(TABLE_NAME, id, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "teacher_c" } },
          { field: { Name: "room_c" } },
          { field: { Name: "max_capacity_c" } },
          { field: { Name: "students_c" } }
        ]
      });

      if (!response.success) {
        throw new Error(response.message || "Class not found");
      }

      // Parse students_c into array
      const data = {
        ...response.data,
        students: response.data.students_c ? response.data.students_c.split(',').map(id => parseInt(id.trim())) : []
      };

      return data;
    } catch (error) {
      console.error(`Error fetching class ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(classData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Name: classData.name_c,
          name_c: classData.name_c,
          subject_c: classData.subject_c,
          teacher_c: classData.teacher_c,
          room_c: classData.room_c,
          max_capacity_c: parseInt(classData.max_capacity_c),
          students_c: Array.isArray(classData.students) ? classData.students.join(',') : ''
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
          console.error(`Failed to create class:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create class");
        }
        const result = response.results[0].data;
        return {
          ...result,
          students: result.students_c ? result.students_c.split(',').map(id => parseInt(id.trim())) : []
        };
      }

      return response.data;
    } catch (error) {
      console.error("Error creating class:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, classData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Id: parseInt(id),
          Name: classData.name_c,
          name_c: classData.name_c,
          subject_c: classData.subject_c,
          teacher_c: classData.teacher_c,
          room_c: classData.room_c,
          max_capacity_c: parseInt(classData.max_capacity_c),
          students_c: Array.isArray(classData.students) ? classData.students.join(',') : classData.students_c
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
          console.error(`Failed to update class:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update class");
        }
        const result = response.results[0].data;
        return {
          ...result,
          students: result.students_c ? result.students_c.split(',').map(id => parseInt(id.trim())) : []
        };
      }

      return response.data;
    } catch (error) {
      console.error("Error updating class:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete class:`, failed);
          throw new Error("Failed to delete class");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting class:", error?.response?.data?.message || error);
      throw error;
    }
  }
};