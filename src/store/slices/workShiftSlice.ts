
import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { WorkShift } from '@/types';

// Sample data
const initialWorkShifts: WorkShift[] = [
  {
    id: "shift-001",
    code: "CA-SANG",
    name: "Ca sáng",
    startTime: "08:00",
    endTime: "12:00",
    description: "Ca làm việc buổi sáng",
    timeEntries: []
  },
  {
    id: "shift-002",
    code: "CA-CHIEU",
    name: "Ca chiều",
    startTime: "13:00",
    endTime: "17:00",
    description: "Ca làm việc buổi chiều",
    timeEntries: []
  },
  {
    id: "shift-003",
    code: "CA-TOI",
    name: "Ca tối",
    startTime: "18:00",
    endTime: "22:00",
    description: "Ca làm việc buổi tối",
    timeEntries: []
  },
  {
    id: "shift-004",
    code: "CA-FULL",
    name: "Ca toàn thời gian",
    startTime: "08:00",
    endTime: "17:00",
    description: "Ca làm việc toàn thời gian",
    timeEntries: []
  }
];

export interface WorkShiftSlice {
  workShifts: WorkShift[];
  
  // Work shift actions
  addWorkShift: (workShift: Omit<WorkShift, 'id' | 'timeEntries'>) => void;
  updateWorkShift: (id: string, data: Partial<Omit<WorkShift, 'id' | 'timeEntries'>>) => void;
  deleteWorkShift: (id: string) => void;
}

export const createWorkShiftSlice: StateCreator<WorkShiftSlice, [], [], WorkShiftSlice> = 
  (set, get, api) => ({
    workShifts: initialWorkShifts,
    
    addWorkShift: (workShift) => {
      const newWorkShift: WorkShift = {
        id: uuidv4(),
        ...workShift,
        timeEntries: []
      };
      
      set((state) => ({
        workShifts: [...state.workShifts, newWorkShift]
      }));
    },
    
    updateWorkShift: (id, data) => {
      set((state) => ({
        workShifts: state.workShifts.map((workShift) => 
          workShift.id === id ? { ...workShift, ...data } : workShift
        )
      }));
    },
    
    deleteWorkShift: (id) => {
      set((state) => ({
        workShifts: state.workShifts.filter((workShift) => workShift.id !== id)
      }));
    }
  });
