import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'document_c';

export const documentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "file_url_c" } },
          { field: { Name: "upload_date_c" } },
          { field: { Name: "student_id_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching documents:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(TABLE_NAME, id, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "file_url_c" } },
          { field: { Name: "upload_date_c" } },
          { field: { Name: "student_id_c" } }
        ]
      });

      if (!response.success) {
        throw new Error(response.message || "Document not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching document ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByStudentId(studentId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(TABLE_NAME, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "file_url_c" } },
          { field: { Name: "upload_date_c" } },
          { field: { Name: "student_id_c" } }
        ],
        where: [{ FieldName: "student_id_c", Operator: "EqualTo", Values: [parseInt(studentId)] }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching documents by student:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(documentData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Name: documentData.title_c,
          title_c: documentData.title_c,
          type_c: documentData.type_c,
          file_url_c: documentData.file_url_c,
          upload_date_c: documentData.upload_date_c || new Date().toISOString().split('T')[0],
          student_id_c: documentData.student_id_c?.Id || parseInt(documentData.student_id_c)
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
          console.error(`Failed to create document:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create document");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating document:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, documentData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Id: parseInt(id),
          Name: documentData.title_c,
          title_c: documentData.title_c,
          type_c: documentData.type_c,
          file_url_c: documentData.file_url_c,
          upload_date_c: documentData.upload_date_c,
          student_id_c: documentData.student_id_c?.Id || parseInt(documentData.student_id_c)
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
          console.error(`Failed to update document:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update document");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating document:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete document:`, failed);
          throw new Error("Failed to delete document");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting document:", error?.response?.data?.message || error);
      throw error;
    }
  }
};