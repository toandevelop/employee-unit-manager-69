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

export interface Organization {
  id: string;
  code: string;
  name: string;
  foundingDate: string;
  description: string;
  departments: Department[];
  logo1?: string; // Primary logo
  logo2?: string; // Secondary logo
  logo3?: string; // Tertiary logo
}

export interface Department {
  id: string;
  code: string;
  name: string;
  foundingDate: string;
  headId?: string;
  organizationId: string; // Each department belongs to one organization
  organization?: Organization;
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
