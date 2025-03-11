
export interface Employee {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  identityCard: string;
  contractDate: string;
  avatar?: string;
  idPhoto?: string; // ID photo in 3x4 format
  departmentEmployees: DepartmentEmployee[];
  positionEmployees: PositionEmployee[];
  academicDegreeId?: string;
  academicTitleId?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  foundingDate: string;
  headId?: string;
  departmentEmployees: DepartmentEmployee[];
}

export interface DepartmentEmployee {
  id: string;
  employeeId: string;
  departmentId: string;
  employee?: Employee;
  department?: Department;
}

export interface Position {
  id: string;
  name: string;
  positionEmployees: PositionEmployee[];
}

export interface PositionEmployee {
  id: string;
  employeeId: string;
  positionId: string;
  employee?: Employee;
  position?: Position;
}

export interface ContractType {
  id: string;
  code: string;
  name: string;
  contracts: Contract[];
}

export interface Contract {
  id: string;
  code: string;
  employeeId: string;
  contractTypeId: string;
  startDate: string;
  endDate: string;
  baseSalary: number;
  allowance: number;
  employee?: Employee;
  contractType?: ContractType;
}

export interface AcademicDegree {
  id: string;
  code: string;
  name: string;
  shortName: string;
  employees?: Employee[];
}

export interface AcademicTitle {
  id: string;
  code: string;
  name: string;
  shortName: string;
  employees?: Employee[];
}

export interface WorkReport {
  id: string;
  employeeId: string;
  departmentId?: string;
  weekStartDate: string;
  weekEndDate: string;
  tasksCompleted: string;
  tasksInProgress: string;
  nextWeekPlans: string;
  issues: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedDate?: string;
  approvedDate?: string;
  approvedById?: string;
  rejectedReason?: string;
  createdAt: string;
}

// New types for leave management
export interface LeaveType {
  id: string;
  code: string;
  name: string;
  leaves: Leave[];
}

export interface Leave {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  departmentId: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  status: 'pending' | 'department_approved' | 'approved' | 'rejected';
  departmentApprovedById?: string;
  departmentApprovedDate?: string;
  approvedById?: string;
  approvedDate?: string;
  rejectedById?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  createdAt: string;
  employee?: Employee;
  leaveType?: LeaveType;
  department?: Department;
}
