
import { create } from 'zustand';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { JobPosting, JobApplication, Interview } from '../../types';

// Mock data for job postings
const mockJobPostings: JobPosting[] = [
  {
    id: '1',
    title: 'Chuyên viên nhân sự',
    departmentId: '1',
    positionId: '2',
    description: 'Chúng tôi đang tìm kiếm một chuyên viên nhân sự có kinh nghiệm để tham gia vào đội ngũ nhân sự của công ty.',
    requirements: '- Tốt nghiệp đại học chuyên ngành quản trị nhân sự hoặc các ngành liên quan\n- Có ít nhất 2 năm kinh nghiệm làm việc trong lĩnh vực nhân sự\n- Kỹ năng giao tiếp và tổ chức tốt',
    salary: '15-20 triệu VNĐ',
    status: 'open',
    openDate: '2023-09-01',
    closeDate: '2023-10-01',
    createdAt: '2023-08-15',
    updatedAt: '2023-08-15',
  },
  {
    id: '2',
    title: 'Kỹ sư phần mềm',
    departmentId: '3',
    positionId: '5',
    description: 'Phát triển và bảo trì các ứng dụng phần mềm của công ty.',
    requirements: '- Tốt nghiệp đại học chuyên ngành CNTT hoặc các ngành liên quan\n- Thành thạo JavaScript, TypeScript, React\n- Có ít nhất 3 năm kinh nghiệm làm việc',
    salary: '25-35 triệu VNĐ',
    status: 'open',
    openDate: '2023-09-15',
    closeDate: '2023-10-15',
    createdAt: '2023-09-01',
    updatedAt: '2023-09-01',
  }
];

// Mock data for job applications
const mockJobApplications: JobApplication[] = [
  {
    id: '1',
    jobPostingId: '1',
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    resumeUrl: 'https://example.com/resume/nguyenvana.pdf',
    coverLetter: 'Tôi rất mong muốn được trở thành một phần của đội ngũ nhân sự của công ty.',
    status: 'reviewing',
    applicationDate: '2023-09-05',
    notes: 'Hồ sơ khá tốt, nên mời phỏng vấn',
  },
  {
    id: '2',
    jobPostingId: '2',
    fullName: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0909876543',
    resumeUrl: 'https://example.com/resume/tranthib.pdf',
    coverLetter: 'Tôi có 5 năm kinh nghiệm lập trình và mong muốn được đóng góp cho công ty.',
    status: 'interview',
    applicationDate: '2023-09-16',
    notes: 'Đã liên hệ và lên lịch phỏng vấn',
  }
];

// Mock data for interviews
const mockInterviews: Interview[] = [
  {
    id: '1',
    applicationId: '2',
    interviewDate: '2023-09-20',
    interviewTime: '10:00',
    interviewType: 'online',
    interviewers: ['Nguyễn Quản Lý', 'Trần Trưởng Phòng'],
    meetingLink: 'https://meet.example.com/interview1',
    notes: 'Chuẩn bị các câu hỏi về kinh nghiệm lập trình',
    status: 'scheduled',
  }
];

interface RecruitmentState {
  jobPostings: JobPosting[];
  jobApplications: JobApplication[];
  interviews: Interview[];
  
  // Job posting actions
  addJobPosting: (jobPosting: Omit<JobPosting, 'id' | 'createdAt' | 'updatedAt' | 'applications'>) => void;
  updateJobPosting: (id: string, jobPosting: Partial<JobPosting>) => void;
  deleteJobPosting: (id: string) => void;
  
  // Job application actions
  addJobApplication: (application: Omit<JobApplication, 'id' | 'applicationDate' | 'interviews'>) => void;
  updateJobApplication: (id: string, application: Partial<JobApplication>) => void;
  deleteJobApplication: (id: string) => void;
  
  // Interview actions
  addInterview: (interview: Omit<Interview, 'id' | 'application'>) => void;
  updateInterview: (id: string, interview: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;
}

export const createRecruitmentSlice = (
  set: (fn: (state: any) => any) => void,
  get: () => any
) => ({
  jobPostings: mockJobPostings,
  jobApplications: mockJobApplications,
  interviews: mockInterviews,
  
  // Job posting actions
  addJobPosting: (jobPostingData) => {
    set((state: any) => {
      const now = new Date().toISOString();
      const newJobPosting: JobPosting = {
        id: uuidv4(),
        ...jobPostingData,
        createdAt: now,
        updatedAt: now,
      };
      
      toast.success("Đã thêm vị trí tuyển dụng mới");
      
      return {
        jobPostings: [...state.jobPostings, newJobPosting]
      };
    });
  },
  
  updateJobPosting: (id, jobPostingData) => {
    set((state: any) => {
      const now = new Date().toISOString();
      const updatedJobPostings = state.jobPostings.map((posting: JobPosting) =>
        posting.id === id ? { 
          ...posting, 
          ...jobPostingData, 
          updatedAt: now 
        } : posting
      );
      
      toast.success("Đã cập nhật vị trí tuyển dụng");
      
      return {
        jobPostings: updatedJobPostings
      };
    });
  },
  
  deleteJobPosting: (id) => {
    set((state: any) => {
      // Also delete all associated applications
      const applicationsToDelete = state.jobApplications.filter(
        (app: JobApplication) => app.jobPostingId === id
      );
      
      const appIdsToDelete = applicationsToDelete.map((app: JobApplication) => app.id);
      
      // Delete interviews for these applications
      const remainingInterviews = state.interviews.filter(
        (interview: Interview) => !appIdsToDelete.includes(interview.applicationId)
      );
      
      // Filter out the deleted job posting and applications
      const remainingJobPostings = state.jobPostings.filter(
        (posting: JobPosting) => posting.id !== id
      );
      
      const remainingApplications = state.jobApplications.filter(
        (app: JobApplication) => app.jobPostingId !== id
      );
      
      toast.success("Đã xóa vị trí tuyển dụng");
      
      return {
        jobPostings: remainingJobPostings,
        jobApplications: remainingApplications,
        interviews: remainingInterviews
      };
    });
  },
  
  // Job application actions
  addJobApplication: (applicationData) => {
    set((state: any) => {
      const now = new Date().toISOString();
      const newApplication: JobApplication = {
        id: uuidv4(),
        ...applicationData,
        applicationDate: now,
      };
      
      toast.success("Đã thêm hồ sơ ứng viên mới");
      
      return {
        jobApplications: [...state.jobApplications, newApplication]
      };
    });
  },
  
  updateJobApplication: (id, applicationData) => {
    set((state: any) => {
      const updatedApplications = state.jobApplications.map((app: JobApplication) =>
        app.id === id ? { ...app, ...applicationData } : app
      );
      
      toast.success("Đã cập nhật hồ sơ ứng viên");
      
      return {
        jobApplications: updatedApplications
      };
    });
  },
  
  deleteJobApplication: (id) => {
    set((state: any) => {
      // Also delete all associated interviews
      const remainingInterviews = state.interviews.filter(
        (interview: Interview) => interview.applicationId !== id
      );
      
      const remainingApplications = state.jobApplications.filter(
        (app: JobApplication) => app.id !== id
      );
      
      toast.success("Đã xóa hồ sơ ứng viên");
      
      return {
        jobApplications: remainingApplications,
        interviews: remainingInterviews
      };
    });
  },
  
  // Interview actions
  addInterview: (interviewData) => {
    set((state: any) => {
      const newInterview: Interview = {
        id: uuidv4(),
        ...interviewData,
      };
      
      toast.success("Đã lên lịch phỏng vấn mới");
      
      return {
        interviews: [...state.interviews, newInterview]
      };
    });
  },
  
  updateInterview: (id, interviewData) => {
    set((state: any) => {
      const updatedInterviews = state.interviews.map((interview: Interview) =>
        interview.id === id ? { ...interview, ...interviewData } : interview
      );
      
      toast.success("Đã cập nhật lịch phỏng vấn");
      
      return {
        interviews: updatedInterviews
      };
    });
  },
  
  deleteInterview: (id) => {
    set((state: any) => {
      const remainingInterviews = state.interviews.filter(
        (interview: Interview) => interview.id !== id
      );
      
      toast.success("Đã xóa lịch phỏng vấn");
      
      return {
        interviews: remainingInterviews
      };
    });
  },
});
