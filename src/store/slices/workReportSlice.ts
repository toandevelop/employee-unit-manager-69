
import { create } from 'zustand';
import { toast } from 'sonner';

// Define the work report type
export interface WorkReport {
  id: string;
  employeeId: string;
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

interface WorkReportState {
  workReports: WorkReport[];
  addWorkReport: (report: Omit<WorkReport, 'id' | 'createdAt'>) => void;
  updateWorkReport: (id: string, report: Partial<WorkReport>) => void;
  deleteWorkReport: (id: string) => void;
  submitWorkReport: (id: string) => void;
  approveWorkReport: (id: string, approvedById: string) => void;
  rejectWorkReport: (id: string, reason: string) => void;
}

export const createWorkReportSlice = (
  set: (fn: (state: any) => any) => void,
  get: () => any
) => ({
  workReports: [],
  
  addWorkReport: (reportData) => {
    set((state: any) => {
      // Generate a new ID for the report
      const newId = state.workReports.length > 0
        ? (Math.max(0, ...state.workReports.map(r => parseInt(r.id))) + 1).toString()
        : "1";
      
      const newReport: WorkReport = {
        id: newId,
        ...reportData,
        status: 'draft',
        createdAt: new Date().toISOString(),
      };
      
      toast.success("Thêm báo cáo công việc thành công");
      
      return {
        workReports: [...state.workReports, newReport]
      };
    });
  },
  
  updateWorkReport: (id, reportData) => {
    set((state: any) => {
      const updatedReports = state.workReports.map(report => 
        report.id === id ? { ...report, ...reportData } : report
      );
      
      toast.success("Cập nhật báo cáo công việc thành công");
      
      return {
        workReports: updatedReports
      };
    });
  },
  
  deleteWorkReport: (id) => {
    set((state: any) => {
      toast.success("Xóa báo cáo công việc thành công");
      
      return {
        workReports: state.workReports.filter(report => report.id !== id)
      };
    });
  },
  
  submitWorkReport: (id) => {
    set((state: any) => {
      const updatedReports = state.workReports.map(report => 
        report.id === id ? { 
          ...report, 
          status: 'submitted',
          submittedDate: new Date().toISOString()
        } : report
      );
      
      toast.success("Nộp báo cáo công việc thành công");
      
      return {
        workReports: updatedReports
      };
    });
  },
  
  approveWorkReport: (id, approvedById) => {
    set((state: any) => {
      const updatedReports = state.workReports.map(report => 
        report.id === id ? { 
          ...report, 
          status: 'approved',
          approvedDate: new Date().toISOString(),
          approvedById
        } : report
      );
      
      toast.success("Phê duyệt báo cáo công việc thành công");
      
      return {
        workReports: updatedReports
      };
    });
  },
  
  rejectWorkReport: (id, reason) => {
    set((state: any) => {
      const updatedReports = state.workReports.map(report => 
        report.id === id ? { 
          ...report, 
          status: 'rejected',
          rejectedReason: reason
        } : report
      );
      
      toast.success("Từ chối báo cáo công việc thành công");
      
      return {
        workReports: updatedReports
      };
    });
  },
});
