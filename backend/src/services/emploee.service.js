import Employee from "../models/paymentSystem/employee.model.js";

export async function createEmployee(data) {
  const employee = await Employee.create({
    employeeCode: data.employeeCode,
    name: data.name,
    email: data.email,
    department: data.department,
    role: data.role,
    dateOfJoining: data.dateOfJoining,
  });

  return employee;
}
