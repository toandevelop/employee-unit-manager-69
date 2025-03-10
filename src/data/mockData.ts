
import { Employee, Department, Position, DepartmentEmployee, PositionEmployee } from "../types";

export const positions: Position[] = [
  { id: "1", name: "Giám đốc", positionEmployees: [] },
  { id: "2", name: "Phó giám đốc", positionEmployees: [] },
  { id: "3", name: "Trưởng phòng", positionEmployees: [] },
  { id: "4", name: "Phó phòng", positionEmployees: [] },
  { id: "5", name: "Nhân viên", positionEmployees: [] },
];

export const departments: Department[] = [
  { 
    id: "1", 
    code: "IT",
    name: "Phòng Công nghệ thông tin", 
    foundingDate: "2020-01-10",
    organizationId: "1", // Added organizationId to fix TypeScript error
    departmentEmployees: []
  },
  { 
    id: "2", 
    code: "HR",
    name: "Phòng Nhân sự", 
    foundingDate: "2020-01-10",
    organizationId: "1", // Added organizationId to fix TypeScript error
    departmentEmployees: []
  },
  { 
    id: "3", 
    code: "ACC",
    name: "Phòng Kế toán", 
    foundingDate: "2020-02-20",
    organizationId: "1", // Added organizationId to fix TypeScript error
    departmentEmployees: []
  },
  { 
    id: "4", 
    code: "MKT",
    name: "Phòng Marketing", 
    foundingDate: "2020-03-15",
    organizationId: "1", // Added organizationId to fix TypeScript error
    departmentEmployees: []
  },
];

export const employees: Employee[] = [
  {
    id: "1",
    code: "NV001",
    name: "Nguyễn Văn An",
    address: "Hà Nội",
    phone: "0912345678",
    identityCard: "001201012345",
    contractDate: "2020-02-15",
    departmentEmployees: [],
    positionEmployees: [],
    academicDegreeId: "5", // Tiến sĩ
    academicTitleId: "1"  // Phó Giáo sư
  },
  {
    id: "2",
    code: "NV002",
    name: "Trần Thị Bình",
    address: "Hồ Chí Minh",
    phone: "0923456789",
    identityCard: "079201054321",
    contractDate: "2020-03-20",
    departmentEmployees: [],
    positionEmployees: [],
    academicDegreeId: "4" // Thạc sĩ
  },
  {
    id: "3",
    code: "NV003",
    name: "Lê Văn Cường",
    address: "Đà Nẵng",
    phone: "0934567890",
    identityCard: "048201012345",
    contractDate: "2020-04-10",
    departmentEmployees: [],
    positionEmployees: [],
    academicDegreeId: "5", // Tiến sĩ
    academicTitleId: "2"  // Giáo sư
  },
  {
    id: "4",
    code: "NV004",
    name: "Phạm Thị Dung",
    address: "Hải Phòng",
    phone: "0945678901",
    identityCard: "031201087654",
    contractDate: "2020-05-05",
    departmentEmployees: [],
    positionEmployees: [],
    academicDegreeId: "4" // Thạc sĩ
  },
  {
    id: "5",
    code: "NV005",
    name: "Hoàng Văn Tuấn",
    address: "Cần Thơ",
    phone: "0956789012",
    identityCard: "092201076543",
    contractDate: "2020-06-15",
    departmentEmployees: [],
    positionEmployees: [],
    academicDegreeId: "3" // Đại học
  },
  {
    id: "6",
    code: "NV006",
    name: "Võ Thị Lan",
    address: "Huế",
    phone: "0967890123",
    identityCard: "054201065432",
    contractDate: "2020-07-20",
    departmentEmployees: [],
    positionEmployees: [],
    academicDegreeId: "2" // Cử nhân
  },
  {
    id: "7",
    code: "NV007",
    name: "Đặng Văn Minh",
    address: "Nha Trang",
    phone: "0978901234",
    identityCard: "056201054321",
    contractDate: "2020-08-10",
    departmentEmployees: [],
    positionEmployees: [],
    academicDegreeId: "4" // Thạc sĩ
  },
  {
    id: "8",
    code: "NV008",
    name: "Bùi Thị Hương",
    address: "Vũng Tàu",
    phone: "0989012345",
    identityCard: "077201043210",
    contractDate: "2020-09-05",
    departmentEmployees: [],
    positionEmployees: [],
    academicDegreeId: "3" // Đại học
  },
  {
    id: "9",
    code: "NV009",
    name: "Lý Văn Tùng",
    address: "Đà Lạt",
    phone: "0990123456",
    identityCard: "061201032109",
    contractDate: "2020-10-15",
    departmentEmployees: [],
    positionEmployees: [],
    academicDegreeId: "3" // Đại học
  },
  {
    id: "10",
    code: "NV010",
    name: "Ngô Thị Mai",
    address: "Quảng Ninh",
    phone: "0901234567",
    identityCard: "022201021098",
    contractDate: "2020-11-20",
    departmentEmployees: [],
    positionEmployees: [],
    academicDegreeId: "2" // Cử nhân
  },
];

export const contractTypes = [
  {
    id: "1",
    code: "HD-XDTH",
    name: "Hợp đồng xác định thời hạn",
    contracts: []
  },
  {
    id: "2",
    code: "HD-KDTH",
    name: "Hợp đồng không xác định thời hạn",
    contracts: []
  },
  {
    id: "3",
    code: "HD-TV",
    name: "Hợp đồng thử việc",
    contracts: []
  },
  {
    id: "4",
    code: "HD-HDLD",
    name: "Hợp đồng học nghề",
    contracts: []
  },
  {
    id: "5",
    code: "HD-MLC",
    name: "Hợp đồng mùa vụ",
    contracts: []
  }
];

export const contracts = [
  {
    id: "1",
    code: "HD001",
    employeeId: "1",
    contractTypeId: "1",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    baseSalary: 10000000,
    allowance: 1500000
  },
  {
    id: "2",
    code: "HD002",
    employeeId: "2",
    contractTypeId: "2",
    startDate: "2022-05-15",
    endDate: "",
    baseSalary: 12000000,
    allowance: 2000000
  },
  {
    id: "3",
    code: "HD003",
    employeeId: "3",
    contractTypeId: "1",
    startDate: "2023-02-10",
    endDate: "2024-02-09",
    baseSalary: 11000000,
    allowance: 1800000
  },
  {
    id: "4",
    code: "HD004",
    employeeId: "4",
    contractTypeId: "3",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    baseSalary: 8500000,
    allowance: 1000000
  },
  {
    id: "5",
    code: "HD005",
    employeeId: "5",
    contractTypeId: "2",
    startDate: "2021-12-01",
    endDate: "",
    baseSalary: 15000000,
    allowance: 3000000
  },
  {
    id: "6",
    code: "HD006",
    employeeId: "6",
    contractTypeId: "1",
    startDate: "2023-04-15",
    endDate: "2024-04-14",
    baseSalary: 12500000,
    allowance: 2200000
  },
  {
    id: "7",
    code: "HD007",
    employeeId: "7",
    contractTypeId: "4",
    startDate: "2023-07-01",
    endDate: "2024-01-01",
    baseSalary: 7500000,
    allowance: 800000
  },
  {
    id: "8",
    code: "HD008",
    employeeId: "8",
    contractTypeId: "5",
    startDate: "2023-05-01",
    endDate: "2023-09-30",
    baseSalary: 9000000,
    allowance: 1200000
  },
  {
    id: "9",
    code: "HD009",
    employeeId: "9",
    contractTypeId: "1",
    startDate: "2023-03-01",
    endDate: "2024-02-29",
    baseSalary: 13000000,
    allowance: 2500000
  },
  {
    id: "10",
    code: "HD010",
    employeeId: "10",
    contractTypeId: "2",
    startDate: "2022-09-15",
    endDate: "",
    baseSalary: 14500000,
    allowance: 2800000
  }
];

export const departmentEmployees: DepartmentEmployee[] = [
  { id: "1", employeeId: "1", departmentId: "1" },
  { id: "2", employeeId: "1", departmentId: "4" },
  { id: "3", employeeId: "2", departmentId: "2" },
  { id: "4", employeeId: "3", departmentId: "3" },
  { id: "5", employeeId: "3", departmentId: "1" },
  { id: "6", employeeId: "4", departmentId: "2" },
  { id: "7", employeeId: "5", departmentId: "4" },
  { id: "8", employeeId: "6", departmentId: "3" },
  { id: "9", employeeId: "7", departmentId: "1" },
  { id: "10", employeeId: "7", departmentId: "4" },
  { id: "11", employeeId: "8", departmentId: "2" },
  { id: "12", employeeId: "9", departmentId: "3" },
  { id: "13", employeeId: "10", departmentId: "1" },
  { id: "14", employeeId: "6", departmentId: "2" },
  { id: "15", employeeId: "8", departmentId: "4" },
];

export const positionEmployees: PositionEmployee[] = [
  { id: "1", employeeId: "1", positionId: "1" },
  { id: "2", employeeId: "1", positionId: "3" },
  { id: "3", employeeId: "2", positionId: "3" },
  { id: "4", employeeId: "3", positionId: "5" },
  { id: "5", employeeId: "3", positionId: "4" },
  { id: "6", employeeId: "4", positionId: "5" },
  { id: "7", employeeId: "5", positionId: "5" },
  { id: "8", employeeId: "6", positionId: "5" },
  { id: "9", employeeId: "7", positionId: "3" },
  { id: "10", employeeId: "8", positionId: "5" },
  { id: "11", employeeId: "9", positionId: "5" },
  { id: "12", employeeId: "10", positionId: "5" },
  { id: "13", employeeId: "2", positionId: "2" },
  { id: "14", employeeId: "4", positionId: "4" },
  { id: "15", employeeId: "7", positionId: "4" },
];

departmentEmployees.forEach(de => {
  const employee = employees.find(e => e.id === de.employeeId);
  const department = departments.find(d => d.id === de.departmentId);
  
  if (employee) {
    employee.departmentEmployees.push(de);
  }
  
  if (department) {
    department.departmentEmployees.push(de);
  }
});

positionEmployees.forEach(pe => {
  const employee = employees.find(e => e.id === pe.employeeId);
  const position = positions.find(p => p.id === pe.positionId);
  
  if (employee) {
    employee.positionEmployees.push(pe);
  }
  
  if (position) {
    position.positionEmployees.push(pe);
  }
});
