import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
  async getAll() {
    await delay(300);
    return [...students];
  },

  async getById(id) {
    await delay(200);
    const student = students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  },

  async create(studentData) {
    await delay(400);
    const maxId = students.length > 0 ? Math.max(...students.map(s => s.Id)) : 0;
    const newStudent = {
      ...studentData,
      Id: maxId + 1,
      enrollmentDate: studentData.enrollmentDate || new Date().toISOString()
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await delay(400);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    students[index] = { ...students[index], ...studentData, Id: parseInt(id) };
    return { ...students[index] };
  },

  async delete(id) {
    await delay(300);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    const deletedStudent = students.splice(index, 1)[0];
    return { ...deletedStudent };
  },

  async search(query) {
    await delay(250);
    if (!query) return [...students];
    
    const searchTerm = query.toLowerCase();
    return students.filter(student =>
      student.firstName.toLowerCase().includes(searchTerm) ||
      student.lastName.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm) ||
      student.grade.toLowerCase().includes(searchTerm)
    );
  }
};