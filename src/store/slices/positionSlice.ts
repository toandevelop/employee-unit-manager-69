
import { create } from 'zustand';
import { positions as initialPositions } from '../../data/mockData';
import { Position } from '../../types';
import { toast } from 'sonner';

interface PositionState {
  positions: Position[];
  
  addPosition: (position: Omit<Position, 'id' | 'positionEmployees'>) => void;
  updatePosition: (id: string, position: Partial<Position>) => void;
  deletePosition: (id: string) => void;
}

export const createPositionSlice = (
  set: (fn: (state: any) => any) => void,
  get: () => any
) => ({
  positions: initialPositions,
  
  addPosition: (positionData) => {
    set((state: any) => {
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
    set((state: any) => {
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
    set((state: any) => {
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
});
