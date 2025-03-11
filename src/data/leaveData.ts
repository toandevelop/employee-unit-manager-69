
import { LeaveType, Leave } from '@/types';

// Sample data for leave types according to Vietnamese labor law
export const initialLeaveTypes: LeaveType[] = [
  {
    id: "lt-1",
    code: "AL",
    name: "Nghỉ phép năm",
    description: "Nghỉ phép năm theo quy định của Bộ luật Lao động",
    daysAllowed: 12, // 12 days for employees with less than 5 years of service
    paidPercentage: 100,
    leaves: []
  },
  {
    id: "lt-2",
    code: "AL-S",
    name: "Nghỉ phép năm (đặc biệt)",
    description: "Nghỉ phép năm cho người lao động có thâm niên từ 5 năm trở lên",
    daysAllowed: 13, // Additional day for 5+ years of service
    paidPercentage: 100,
    leaves: []
  },
  {
    id: "lt-3",
    code: "SL",
    name: "Nghỉ ốm",
    description: "Nghỉ ốm đau có xác nhận của cơ sở y tế",
    daysAllowed: 30, // Up to 30 days per year depending on contribution period
    paidPercentage: 75, // Paid by social insurance
    leaves: []
  },
  {
    id: "lt-4",
    code: "ML",
    name: "Nghỉ thai sản",
    description: "Nghỉ thai sản cho lao động nữ",
    daysAllowed: 180, // 6 months
    paidPercentage: 100, // Paid by social insurance
    leaves: []
  },
  {
    id: "lt-5",
    code: "PL",
    name: "Nghỉ khám thai",
    description: "Nghỉ khám thai cho lao động nữ",
    daysAllowed: 5, // 1 day per examination, up to 5 times
    paidPercentage: 100,
    leaves: []
  },
  {
    id: "lt-6",
    code: "WPA",
    name: "Nghỉ do tai nạn lao động",
    description: "Nghỉ điều trị do tai nạn lao động hoặc bệnh nghề nghiệp",
    daysAllowed: 180, // Depending on severity
    paidPercentage: 100, // Paid by social insurance
    leaves: []
  },
  {
    id: "lt-7",
    code: "PL-M",
    name: "Nghỉ khi vợ sinh con",
    description: "Nghỉ cho lao động nam khi vợ sinh con",
    daysAllowed: 5, // 5-14 days depending on birth circumstances
    paidPercentage: 100, // Paid by social insurance
    leaves: []
  },
  {
    id: "lt-8",
    code: "UL",
    name: "Nghỉ không lương",
    description: "Nghỉ không hưởng lương theo thỏa thuận",
    daysAllowed: 90, // By agreement
    paidPercentage: 0,
    leaves: []
  },
  {
    id: "lt-9",
    code: "CL",
    name: "Nghỉ chăm con ốm",
    description: "Nghỉ để chăm sóc con ốm dưới 7 tuổi",
    daysAllowed: 20, // 20 days for children under 3, 15 days for children 3-7
    paidPercentage: 75, // Paid by social insurance
    leaves: []
  },
  {
    id: "lt-10",
    code: "ML-M",
    name: "Nghỉ do sảy thai, nạo hút thai",
    description: "Nghỉ do sảy thai, nạo hút thai hoặc các thủ thuật sản khoa",
    daysAllowed: 10, // 10-50 days depending on pregnancy stage
    paidPercentage: 100, // Paid by social insurance
    leaves: []
  },
  {
    id: "lt-11",
    code: "CL-A",
    name: "Nghỉ nuôi con nuôi",
    description: "Nghỉ khi nhận con nuôi",
    daysAllowed: 90, // 3 months for child under 6 months old
    paidPercentage: 100, // Paid by social insurance
    leaves: []
  },
  {
    id: "lt-12",
    code: "WBL",
    name: "Nghỉ lễ theo luật",
    description: "Nghỉ các ngày lễ, tết theo quy định của Luật Lao động",
    daysAllowed: 11, // Total of 11 public holidays
    paidPercentage: 100,
    leaves: []
  },
  {
    id: "lt-13",
    code: "FL",
    name: "Nghỉ việc riêng có lương",
    description: "Nghỉ việc riêng có hưởng lương (kết hôn, con kết hôn, thân nhân mất)",
    daysAllowed: 3, // 3 days for marriage, 1 day for child's marriage, 3 days for death of family members
    paidPercentage: 100,
    leaves: []
  }
];

// Sample data for leave entries
export const initialLeaves: Leave[] = [
  {
    id: "leave-1",
    employeeId: "1",
    leaveTypeId: "lt-1",
    startDate: "2024-01-15",
    endDate: "2024-01-19",
    numberOfDays: 5,
    reason: "Nghỉ phép cá nhân",
    status: "approved",
    departmentApprovedById: "4",
    departmentApprovedDate: "2024-01-10T00:00:00Z",
    approvedById: "5",
    approvedDate: "2024-01-12T00:00:00Z",
    createdAt: "2024-01-05T00:00:00Z"
  },
  {
    id: "leave-2",
    employeeId: "2",
    leaveTypeId: "lt-3",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    numberOfDays: 3,
    reason: "Nghỉ ốm có giấy xác nhận y tế",
    status: "approved",
    departmentApprovedById: "4",
    departmentApprovedDate: "2024-02-10T00:00:00Z",
    approvedById: "5",
    approvedDate: "2024-02-11T00:00:00Z",
    createdAt: "2024-02-10T00:00:00Z"
  },
  {
    id: "leave-3",
    employeeId: "3",
    leaveTypeId: "lt-8",
    startDate: "2024-03-01",
    endDate: "2024-03-15",
    numberOfDays: 15,
    reason: "Nghỉ không lương để giải quyết việc gia đình",
    status: "pending",
    createdAt: "2024-02-20T00:00:00Z"
  },
  {
    id: "leave-4",
    employeeId: "4",
    leaveTypeId: "lt-1",
    startDate: "2024-04-10",
    endDate: "2024-04-17",
    numberOfDays: 8,
    reason: "Nghỉ phép năm theo kế hoạch",
    status: "department_approved",
    departmentApprovedById: "7",
    departmentApprovedDate: "2024-04-01T00:00:00Z",
    createdAt: "2024-03-25T00:00:00Z"
  },
  {
    id: "leave-5",
    employeeId: "5",
    leaveTypeId: "lt-4",
    startDate: "2024-04-01",
    endDate: "2024-09-30",
    numberOfDays: 180,
    reason: "Nghỉ thai sản",
    status: "approved",
    departmentApprovedById: "7",
    departmentApprovedDate: "2024-03-15T00:00:00Z",
    approvedById: "5",
    approvedDate: "2024-03-20T00:00:00Z",
    createdAt: "2024-03-10T00:00:00Z"
  },
  {
    id: "leave-6",
    employeeId: "6",
    leaveTypeId: "lt-7",
    startDate: "2024-02-15",
    endDate: "2024-02-19",
    numberOfDays: 5,
    reason: "Nghỉ khi vợ sinh con",
    status: "approved",
    departmentApprovedById: "7",
    departmentApprovedDate: "2024-02-14T00:00:00Z",
    approvedById: "5",
    approvedDate: "2024-02-14T00:00:00Z",
    createdAt: "2024-02-13T00:00:00Z"
  },
  {
    id: "leave-7",
    employeeId: "7",
    leaveTypeId: "lt-9",
    startDate: "2024-03-05",
    endDate: "2024-03-10",
    numberOfDays: 6,
    reason: "Nghỉ chăm con ốm",
    status: "rejected",
    departmentApprovedById: "4",
    departmentApprovedDate: "2024-03-05T00:00:00Z",
    rejectedById: "5",
    rejectedDate: "2024-03-06T00:00:00Z",
    rejectionReason: "Yêu cầu bổ sung giấy xác nhận y tế",
    createdAt: "2024-03-04T00:00:00Z"
  },
  {
    id: "leave-8",
    employeeId: "8",
    leaveTypeId: "lt-13",
    startDate: "2024-04-02",
    endDate: "2024-04-04",
    numberOfDays: 3,
    reason: "Nghỉ cưới",
    status: "approved",
    departmentApprovedById: "9",
    departmentApprovedDate: "2024-03-25T00:00:00Z",
    approvedById: "5",
    approvedDate: "2024-03-27T00:00:00Z",
    createdAt: "2024-03-20T00:00:00Z"
  }
];
