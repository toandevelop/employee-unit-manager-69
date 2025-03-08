import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  employees as initialEmployees, 
  departments as initialDepartments,
  positions as initialPositions,
  departmentEmployees as initialDepartmentEmployees,
  positionEmployees as initialPositionEmployees,
  contractTypes as initialContractTypes,
  contracts as initialContracts
} from '../data/mockData';
import { Employee, Department, Position, DepartmentEmployee, PositionEmployee, ContractType, Contract } from '../types';
import { toast } from 'sonner';

interface AppState {
  employees: Employee[];
  departments: Department[];
  positions: Position[];
  departmentEmployees: DepartmentEmployee[];
  positionEmployees: PositionEmployee[];
  contractTypes: ContractType[];
  contracts: Contract[];
  
  addEmployee: (employee: Omit<Employee, 'id' | 'departmentEmployees' | 'positionEmployees'> & { 
    departmentIds: string[],
    positionIds: string[] 
  }) => void;
  updateEmployee: (id: string, employee: Partial<Employee> & { 
    departmentIds?: string[],
    positionIds?: string[] 
  }) => void;
  deleteEmployee: (id: string) => void;
  
  addDepartment: (department: Omit<Department, 'id' | 'departmentEmployees'>) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  
  addPosition: (position: Omit<Position, 'id' | 'positionEmployees'>) => void;
  updatePosition: (id: string, position: Partial<Position>) => void;
  deletePosition: (id: string) => void;
  
  addContractType: (contractType: Omit<ContractType, 'id' | 'contracts'>) => void;
  updateContractType: (id: string, contractType: Partial<ContractType>) => void;
  deleteContractType: (id: string) => void;
  
  addContract: (contract: Omit<Contract, 'id' | 'employee' | 'contractType'>) => void;
  updateContract: (id: string, contract: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        employees: initialEmployees,
        departments: initialDepartments,
        positions: initialPositions,
        departmentEmployees: initialDepartmentEmployees,
        positionEmployees: initialPositionEmployees,
        contractTypes: initialContractTypes,
        contracts: initialContracts,
        
        addEmployee: (employeeData) => {
          set((state) => {
            const newId = (Math.max(...state.employees.map(e => parseInt(e.id))) + 1).toString();
            const { departmentIds, positionIds, ...employeeFields } = employeeData;
            
            const newEmployee: Employee = {
              id: newId,
              ...employeeFields,
              departmentEmployees: [],
              positionEmployees: []
            };
            
            const newDepartmentEmployees: DepartmentEmployee[] = departmentIds.map((deptId, index) => {
              const newDepartmentEmployeeId = (Math.max(...state.departmentEmployees.map(de => parseInt(de.id))) + index + 1).toString();
              return {
                id: newDepartmentEmployeeId,
                employeeId: newId,
                departmentId: deptId
              };
            });
            
            const newPositionEmployees: PositionEmployee[] = positionIds.map((posId, index) => {
              const newPositionEmployeeId = (Math.max(...state.positionEmployees.map(pe => parseInt(pe.id))) + index + 1).toString();
              return {
                id: newPositionEmployeeId,
                employeeId: newId,
                positionId: posId
              };
            });
            
            toast.success("Thêm nhân viên thành công");
            
            return {
              employees: [...state.employees, newEmployee],
              departmentEmployees: [...state.departmentEmployees, ...newDepartmentEmployees],
              positionEmployees: [...state.positionEmployees, ...newPositionEmployees],
            };
          });
        },
        
        updateEmployee: (id, employeeData) => {
          set((state) => {
            const { departmentIds, positionIds, ...employeeFields } = employeeData;
            
            const updatedEmployees = state.employees.map(emp => 
              emp.id === id ? { ...emp, ...employeeFields } : emp
            );
            
            let updatedDepartmentEmployees = [...state.departmentEmployees];
            let updatedPositionEmployees = [...state.positionEmployees];
            
            if (departmentIds) {
              updatedDepartmentEmployees = updatedDepartmentEmployees.filter(de => de.employeeId !== id);
              
              const newDepartmentEmployees = departmentIds.map((deptId, index) => {
                const newId = (Math.max(...state.departmentEmployees.map(de => parseInt(de.id))) + index + 1).toString();
                return {
                  id: newId,
                  employeeId: id,
                  departmentId: deptId
                };
              });
              
              updatedDepartmentEmployees = [...updatedDepartmentEmployees, ...newDepartmentEmployees];
            }
            
            if (positionIds) {
              updatedPositionEmployees = updatedPositionEmployees.filter(pe => pe.employeeId !== id);
              
              const newPositionEmployees = positionIds.map((posId, index) => {
                const newId = (Math.max(...state.positionEmployees.map(pe => parseInt(pe.id))) + index + 1).toString();
                return {
                  id: newId,
                  employeeId: id,
                  positionId: posId
                };
              });
              
              updatedPositionEmployees = [...updatedPositionEmployees, ...newPositionEmployees];
            }
            
            toast.success("Cập nhật thông tin nhân viên thành công");
            
            return {
              employees: updatedEmployees,
              departmentEmployees: updatedDepartmentEmployees,
              positionEmployees: updatedPositionEmployees
            };
          });
        },
        
        deleteEmployee: (id) => {
          set((state) => {
            toast.success("Xoá nhân viên thành công");
            
            return {
              employees: state.employees.filter(emp => emp.id !== id),
              departmentEmployees: state.departmentEmployees.filter(de => de.employeeId !== id),
              positionEmployees: state.positionEmployees.filter(pe => pe.employeeId !== id)
            };
          });
        },
        
        addDepartment: (departmentData) => {
          set((state) => {
            const newId = (Math.max(...state.departments.map(d => parseInt(d.id))) + 1).toString();
            
            const newDepartment: Department = {
              id: newId,
              ...departmentData,
              departmentEmployees: []
            };
            
            toast.success("Thêm đơn vị thành công");
            
            return {
              departments: [...state.departments, newDepartment]
            };
          });
        },
        
        updateDepartment: (id, departmentData) => {
          set((state) => {
            const updatedDepartments = state.departments.map(dept => 
              dept.id === id ? { ...dept, ...departmentData } : dept
            );
            
            toast.success("Cập nhật thông tin đơn vị thành công");
            
            return {
              departments: updatedDepartments
            };
          });
        },
        
        deleteDepartment: (id) => {
          set((state) => {
            const hasEmployees = state.departmentEmployees.some(de => de.departmentId === id);
            
            if (hasEmployees) {
              toast.error("Không thể xoá đơn vị đang có nhân viên");
              return state;
            }
            
            toast.success("Xoá đơn vị thành công");
            
            return {
              departments: state.departments.filter(dept => dept.id !== id),
              departmentEmployees: state.departmentEmployees.filter(de => de.departmentId !== id)
            };
          });
        },
        
        addPosition: (positionData) => {
          set((state) => {
            const newId = (Math.max(...state.positions.map(p => parseInt(p.id))) + 1).toString();
            
            const newPosition: Position = {
              id: newId,
              ...positionData,
              positionEmployees: []
            };
            
            toast.success("Thêm chức vụ thành công");
            
            return {
              positions: [...state.positions, newPosition]
            };
          });
        },
        
        updatePosition: (id, positionData) => {
          set((state) => {
            const updatedPositions = state.positions.map(pos => 
              pos.id === id ? { ...pos, ...positionData } : pos
            );
            
            toast.success("Cập nhật thông tin chức vụ thành công");
            
            return {
              positions: updatedPositions
            };
          });
        },
        
        deletePosition: (id) => {
          set((state) => {
            const hasEmployees = state.positionEmployees.some(pe => pe.positionId === id);
            
            if (hasEmployees) {
              const updatedPositionEmployees = state.positionEmployees.filter(pe => pe.positionId !== id);
              
              toast.success("Xoá chức vụ thành công");
              
              return {
                positions: state.positions.filter(pos => pos.id !== id),
                positionEmployees: updatedPositionEmployees
              };
            }
            
            toast.success("Xoá chức vụ thành công");
            
            return {
              positions: state.positions.filter(pos => pos.id !== id)
            };
          });
        },
        
        addContractType: (contractTypeData) => {
          set((state) => {
            const newId = (Math.max(...state.contractTypes.map(ct => parseInt(ct.id) || 0), 0) + 1).toString();
            
            const newContractType: ContractType = {
              id: newId,
              ...contractTypeData,
              contracts: []
            };
            
            toast.success("Thêm loại hợp đồng thành công");
            
            return {
              contractTypes: [...state.contractTypes, newContractType]
            };
          });
        },
        
        updateContractType: (id, contractTypeData) => {
          set((state) => {
            const updatedContractTypes = state.contractTypes.map(ct => 
              ct.id === id ? { ...ct, ...contractTypeData } : ct
            );
            
            toast.success("Cập nhật loại hợp đồng thành công");
            
            return {
              contractTypes: updatedContractTypes
            };
          });
        },
        
        deleteContractType: (id) => {
          set((state) => {
            const hasContracts = state.contracts.some(c => c.contractTypeId === id);
            
            if (hasContracts) {
              toast.error("Không thể xoá loại hợp đồng đang có hợp đồng");
              return state;
            }
            
            toast.success("Xoá loại hợp đồng thành công");
            
            return {
              contractTypes: state.contractTypes.filter(ct => ct.id !== id)
            };
          });
        },
        
        addContract: (contractData) => {
          set((state) => {
            const newId = (Math.max(...state.contracts.map(c => parseInt(c.id) || 0), 0) + 1).toString();
            
            const newContract: Contract = {
              id: newId,
              ...contractData
            };
            
            toast.success("Thêm hợp đồng thành công");
            
            return {
              contracts: [...state.contracts, newContract]
            };
          });
        },
        
        updateContract: (id, contractData) => {
          set((state) => {
            const updatedContracts = state.contracts.map(c => 
              c.id === id ? { ...c, ...contractData } : c
            );
            
            toast.success("Cập nhật hợp đồng thành công");
            
            return {
              contracts: updatedContracts
            };
          });
        },
        
        deleteContract: (id) => {
          set((state) => {
            toast.success("Xoá hợp đồng thành công");
            
            return {
              contracts: state.contracts.filter(c => c.id !== id)
            };
          });
        },
      }),
      {
        name: 'employee-management-storage',
        partialize: (state) => ({
          employees: state.employees,
          departments: state.departments,
          positions: state.positions,
          departmentEmployees: state.departmentEmployees,
          positionEmployees: state.positionEmployees,
          contractTypes: state.contractTypes,
          contracts: state.contracts,
        }),
        version: 1,
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            return JSON.parse(str);
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          },
        },
      }
    )
  )
);
