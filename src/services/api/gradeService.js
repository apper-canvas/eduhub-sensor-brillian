import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

const TABLE_NAME = 'grade_c';

export const gradeService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "assignment_name_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "category_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
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
          { field: { Name: "assignment_name_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "category_c" } }
        ]
      });

      if (!response.success) {
        throw new Error(response.message || "Grade not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error);
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
          { field: { Name: "assignment_name_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "category_c" } }
        ],
        where: [{ FieldName: "student_id_c", Operator: "EqualTo", Values: [parseInt(studentId)] }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades by student:", error?.response?.data?.message || error);
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
          { field: { Name: "assignment_name_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "category_c" } }
        ],
        where: [{ FieldName: "class_id_c", Operator: "EqualTo", Values: [parseInt(classId)] }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades by class:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(gradeData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Name: gradeData.assignment_name_c,
          student_id_c: gradeData.student_id_c?.Id || parseInt(gradeData.student_id_c),
          class_id_c: gradeData.class_id_c?.Id || parseInt(gradeData.class_id_c),
          assignment_name_c: gradeData.assignment_name_c,
          score_c: parseInt(gradeData.score_c),
          max_score_c: parseInt(gradeData.max_score_c),
          date_c: gradeData.date_c || new Date().toISOString().split('T')[0],
          category_c: gradeData.category_c || ''
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
          console.error(`Failed to create grade:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create grade");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, gradeData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Id: parseInt(id),
          Name: gradeData.assignment_name_c,
          student_id_c: gradeData.student_id_c?.Id || parseInt(gradeData.student_id_c),
          class_id_c: gradeData.class_id_c?.Id || parseInt(gradeData.class_id_c),
          assignment_name_c: gradeData.assignment_name_c,
          score_c: parseInt(gradeData.score_c),
          max_score_c: parseInt(gradeData.max_score_c),
          date_c: gradeData.date_c,
          category_c: gradeData.category_c
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
          console.error(`Failed to update grade:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update grade");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete grade:`, failed);
          throw new Error("Failed to delete grade");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error);
throw error;
    }
  }
};