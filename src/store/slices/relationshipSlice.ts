
import { departmentEmployees as initialDepartmentEmployees, positionEmployees as initialPositionEmployees } from '../../data/mockData';
import { DepartmentEmployee, PositionEmployee } from '../../types';

interface RelationshipState {
  departmentEmployees: DepartmentEmployee[];
  positionEmployees: PositionEmployee[];
}

export const createRelationshipSlice = (
  set: (fn: (state: any) => any) => void,
  get: () => any
) => ({
  departmentEmployees: initialDepartmentEmployees,
  positionEmployees: initialPositionEmployees,
});
