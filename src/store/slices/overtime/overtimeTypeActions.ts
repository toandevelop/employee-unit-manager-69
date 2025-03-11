
import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { OvertimeType } from '@/types';

export interface OvertimeTypeState {
  overtimeTypes: OvertimeType[];
}

export interface OvertimeTypeActions {
  addOvertimeType: (overtimeType: Omit<OvertimeType, 'id' | 'overtimes'>) => void;
  updateOvertimeType: (id: string, overtimeType: Partial<OvertimeType>) => void;
  deleteOvertimeType: (id: string) => void;
}

export type OvertimeTypeSlice = OvertimeTypeState & OvertimeTypeActions;

export const createOvertimeTypeActions = <T extends OvertimeTypeState>(
  set: (fn: (state: T) => Partial<T>) => void
): OvertimeTypeActions => ({
  addOvertimeType: (overtimeType) => {
    set((state) => ({
      overtimeTypes: [
        ...state.overtimeTypes,
        {
          ...overtimeType,
          id: uuidv4(),
          overtimes: []
        }
      ]
    }));
  },
  
  updateOvertimeType: (id, overtimeType) => {
    set((state) => ({
      overtimeTypes: state.overtimeTypes.map((ot) => 
        ot.id === id ? { ...ot, ...overtimeType } : ot
      )
    }));
  },
  
  deleteOvertimeType: (id) => {
    set((state) => ({
      overtimeTypes: state.overtimeTypes.filter((ot) => ot.id !== id)
    }));
  },
});
