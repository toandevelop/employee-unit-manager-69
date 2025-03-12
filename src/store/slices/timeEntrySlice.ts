
import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { TimeEntry } from '@/types';

// Generate sample time entries for the past week
const generateInitialTimeEntries = (): TimeEntry[] => {
  const entries: TimeEntry[] = [];
  const employeeIds = ["emp-001", "emp-002", "emp-003", "emp-004"];
  const departmentIds = ["dept-001", "dept-002"];
  const workShiftIds = ["shift-001", "shift-002", "shift-003", "shift-004"];
  const statuses: TimeEntry['status'][] = ['normal', 'late', 'early_leave', 'absent', 'leave'];
  
  // Generate entries for the past 14 days
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Generate 10-15 entries per day
    const entriesCount = Math.floor(Math.random() * 6) + 10;
    
    for (let j = 0; j < entriesCount; j++) {
      const employeeId = employeeIds[Math.floor(Math.random() * employeeIds.length)];
      const departmentId = departmentIds[Math.floor(Math.random() * departmentIds.length)];
      const workShiftId = workShiftIds[Math.floor(Math.random() * workShiftIds.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Generate check-in time (if not absent)
      let checkInTime: string | undefined;
      let checkOutTime: string | undefined;
      let overtimeHours = 0;
      
      if (status !== 'absent' && status !== 'leave') {
        const shift = workShiftId === "shift-001" ? {start: "08:00", end: "12:00"} :
                      workShiftId === "shift-002" ? {start: "13:00", end: "17:00"} :
                      workShiftId === "shift-003" ? {start: "18:00", end: "22:00"} :
                      {start: "08:00", end: "17:00"};
        
        // Check in time with some variance
        const checkInHour = parseInt(shift.start.split(':')[0]);
        const checkInMinute = parseInt(shift.start.split(':')[1]);
        const checkInVariance = status === 'late' ? Math.floor(Math.random() * 30) + 5 : -Math.floor(Math.random() * 10);
        const actualCheckInMinute = checkInMinute + checkInVariance;
        checkInTime = `${checkInHour.toString().padStart(2, '0')}:${Math.abs(actualCheckInMinute).toString().padStart(2, '0')}`;
        
        // Check out time with some variance
        const checkOutHour = parseInt(shift.end.split(':')[0]);
        const checkOutMinute = parseInt(shift.end.split(':')[1]);
        const checkOutVariance = status === 'early_leave' ? -Math.floor(Math.random() * 30) - 5 : Math.floor(Math.random() * 15);
        const actualCheckOutMinute = checkOutMinute + checkOutVariance;
        checkOutTime = `${checkOutHour.toString().padStart(2, '0')}:${Math.abs(actualCheckOutMinute).toString().padStart(2, '0')}`;
        
        // Occasional overtime
        if (Math.random() > 0.7) {
          overtimeHours = Math.floor(Math.random() * 3) + 1;
          
          // Adjust check out time for overtime
          const newCheckOutHour = checkOutHour + Math.floor(overtimeHours);
          const newCheckOutMinute = checkOutMinute + (overtimeHours % 1) * 60;
          checkOutTime = `${newCheckOutHour.toString().padStart(2, '0')}:${Math.abs(newCheckOutMinute).toString().padStart(2, '0')}`;
        }
      }
      
      entries.push({
        id: uuidv4(),
        code: `ATT-${format(date, 'yyMMdd')}-${j + 1}`,
        employeeId,
        departmentId,
        workShiftId,
        checkInTime,
        checkOutTime,
        workDate: formattedDate,
        status,
        overtimeHours,
        notes: status === 'late' ? 'Đi muộn do kẹt xe' : 
               status === 'early_leave' ? 'Về sớm do việc gia đình' : 
               status === 'absent' ? 'Vắng không phép' :
               status === 'leave' ? 'Nghỉ phép có phép' : '',
      });
    }
  }
  
  return entries;
};

const initialTimeEntries = generateInitialTimeEntries();

export interface TimeEntrySlice {
  timeEntries: TimeEntry[];
  
  // Time entry actions
  addTimeEntry: (timeEntry: Omit<TimeEntry, 'id'>) => void;
  updateTimeEntry: (id: string, data: Partial<Omit<TimeEntry, 'id'>>) => void;
  deleteTimeEntry: (id: string) => void;
  bulkAddTimeEntries: (timeEntries: Omit<TimeEntry, 'id'>[]) => void;
}

export const createTimeEntrySlice: StateCreator<TimeEntrySlice, [], [], TimeEntrySlice> = 
  (set, get, api) => ({
    timeEntries: initialTimeEntries,
    
    addTimeEntry: (timeEntry) => {
      const newTimeEntry: TimeEntry = {
        id: uuidv4(),
        ...timeEntry
      };
      
      set((state) => ({
        timeEntries: [...state.timeEntries, newTimeEntry]
      }));
    },
    
    updateTimeEntry: (id, data) => {
      set((state) => ({
        timeEntries: state.timeEntries.map((timeEntry) => 
          timeEntry.id === id ? { ...timeEntry, ...data } : timeEntry
        )
      }));
    },
    
    deleteTimeEntry: (id) => {
      set((state) => ({
        timeEntries: state.timeEntries.filter((timeEntry) => timeEntry.id !== id)
      }));
    },
    
    bulkAddTimeEntries: (timeEntries) => {
      const newTimeEntries = timeEntries.map(entry => ({
        id: uuidv4(),
        ...entry
      }));
      
      set((state) => ({
        timeEntries: [...state.timeEntries, ...newTimeEntries]
      }));
    }
  });
