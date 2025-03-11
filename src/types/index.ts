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

export interface LeaveType {
  id: string;
  code: string;
  name: string;
  description?: string;
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
  reason?: string;
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

export interface OvertimeType {
  id: string;
  code: string;
  name: string;
  coefficient: number; // Hệ số
  overtimes: Overtime[];
}

export interface Overtime {
  id: string;
  employeeId: string;
  overtimeTypeId: string;
  departmentId: string;
  overtimeDate: string;
  startTime: string;
  endTime: string;
  hours: number;
  content: string;
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
  overtimeType?: OvertimeType;
  department?: Department;
}

export interface WorkShift {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
  timeEntries: TimeEntry[];
}

export interface TimeEntry {
  id: string;
  code: string;
  employeeId: string;
  departmentId: string;
  workShiftId: string;
  checkInTime?: string;
  checkOutTime?: string;
  workDate: string;
  status: 'late' | 'early_leave' | 'normal' | 'absent' | 'leave' | 'holiday';
  overtimeHours: number;
  notes?: string;
  employee?: Employee;
  department?: Department;
  workShift?: WorkShift;
}

export interface RawTimeData {
  id: string;
  deviceId: string;
  employeeCode: string;
  timestamp: string;
  direction: 'in' | 'out';
  synced: boolean;
  syncDate?: string;
  processed: boolean;
}

export interface TimekeepingDevice {
  id: string;
  code: string;
  name: string;
  ipAddress: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastSyncDate?: string;
}
