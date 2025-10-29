import documentsData from "@/services/mockData/documents.json";

let documents = [...documentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const documentService = {
  async getAll() {
    await delay(300);
    return [...documents];
  },

  async getById(id) {
    await delay(200);
    const document = documents.find(d => d.Id === parseInt(id));
    if (!document) {
      throw new Error("Document not found");
    }
    return { ...document };
  },

  async getByStudentId(studentId) {
    await delay(250);
    return documents.filter(d => parseInt(d.studentId) === parseInt(studentId));
  },

  async create(documentData) {
    await delay(400);
    const maxId = documents.length > 0 ? Math.max(...documents.map(d => d.Id)) : 0;
    const newDocument = {
      ...documentData,
      Id: maxId + 1,
      uploadDate: documentData.uploadDate || new Date().toISOString().split("T")[0]
    };
    documents.push(newDocument);
    return { ...newDocument };
  },

  async update(id, documentData) {
    await delay(400);
    const index = documents.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Document not found");
    }
    documents[index] = { ...documents[index], ...documentData, Id: parseInt(id) };
    return { ...documents[index] };
  },

  async delete(id) {
    await delay(300);
    const index = documents.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Document not found");
    }
    const deletedDocument = documents.splice(index, 1)[0];
    return { ...deletedDocument };
  }
};