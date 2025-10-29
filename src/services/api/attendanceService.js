import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(300);
    return [...attendance];
  },

  async getById(id) {
    await delay(200);
    const record = attendance.find(a => a.Id === parseInt(id));
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  },

  async getByStudentId(studentId) {
    await delay(250);
    return attendance.filter(a => parseInt(a.studentId) === parseInt(studentId));
  },

  async getByClassId(classId) {
    await delay(250);
    return attendance.filter(a => parseInt(a.classId) === parseInt(classId));
  },

  async getByDateRange(startDate, endDate) {
    await delay(300);
    return attendance.filter(a => {
      const recordDate = new Date(a.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return recordDate >= start && recordDate <= end;
    });
  },

  async create(attendanceData) {
    await delay(400);
    const maxId = attendance.length > 0 ? Math.max(...attendance.map(a => a.Id)) : 0;
    const newRecord = {
      ...attendanceData,
      Id: maxId + 1,
      date: attendanceData.date || new Date().toISOString().split("T")[0]
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, attendanceData) {
    await delay(400);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    attendance[index] = { ...attendance[index], ...attendanceData, Id: parseInt(id) };
    return { ...attendance[index] };
  },

  async delete(id) {
    await delay(300);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    const deletedRecord = attendance.splice(index, 1)[0];
    return { ...deletedRecord };
  }
};