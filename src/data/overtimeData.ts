
import { OvertimeType, Overtime } from '@/types';

// Sample data for overtime types according to Vietnamese labor law
export const initialOvertimeTypes: OvertimeType[] = [
  {
    id: "ot-type-1",
    code: "OT-N",
    name: "Làm thêm giờ ngày thường",
    coefficient: 1.5, // 150% normal salary
    overtimes: []
  },
  {
    id: "ot-type-2",
    code: "OT-W",
    name: "Làm thêm giờ ngày nghỉ hàng tuần",
    coefficient: 2, // 200% normal salary
    overtimes: []
  },
  {
    id: "ot-type-3",
    code: "OT-H",
    name: "Làm thêm giờ ngày nghỉ lễ",
    coefficient: 3, // 300% normal salary
    overtimes: []
  },
  {
    id: "ot-type-4",
    code: "OT-N-N",
    name: "Làm thêm giờ ban đêm ngày thường",
    coefficient: 1.5 * 1.3, // 150% * 130% for night shift
    overtimes: []
  },
  {
    id: "ot-type-5",
    code: "OT-W-N",
    name: "Làm thêm giờ ban đêm ngày nghỉ hàng tuần",
    coefficient: 2 * 1.3, // 200% * 130% for night shift
    overtimes: []
  },
  {
    id: "ot-type-6",
    code: "OT-H-N",
    name: "Làm thêm giờ ban đêm ngày nghỉ lễ",
    coefficient: 3 * 1.3, // 300% * 130% for night shift
    overtimes: []
  }
];

// Sample data for overtime entries
export const initialOvertimes: Overtime[] = [
  {
    id: "ot-1",
    employeeId: "emp-1",
    overtimeTypeId: "ot-type-1",
    departmentId: "dept-1",
    overtimeDate: "2024-03-01",
    startTime: "17:30",
    endTime: "19:30",
    hours: 2,
    content: "Hoàn thành báo cáo quý 1",
    status: "approved",
    departmentApprovedById: "emp-4",
    departmentApprovedDate: "2024-03-02",
    approvedById: "emp-5",
    approvedDate: "2024-03-03",
    createdAt: "2024-03-01T10:00:00Z"
  },
  {
    id: "ot-2",
    employeeId: "emp-2",
    overtimeTypeId: "ot-type-1",
    departmentId: "dept-1",
    overtimeDate: "2024-03-02",
    startTime: "17:30",
    endTime: "20:30",
    hours: 3,
    content: "Chuẩn bị tài liệu cho cuộc họp",
    status: "approved",
    departmentApprovedById: "emp-4",
    departmentApprovedDate: "2024-03-03",
    approvedById: "emp-5",
    approvedDate: "2024-03-04",
    createdAt: "2024-03-02T09:30:00Z"
  },
  {
    id: "ot-3",
    employeeId: "emp-3",
    overtimeTypeId: "ot-type-2",
    departmentId: "dept-2",
    overtimeDate: "2024-03-04",
    startTime: "08:00",
    endTime: "12:00",
    hours: 4,
    content: "Xử lý sự cố hệ thống",
    status: "pending",
    createdAt: "2024-03-04T07:45:00Z"
  },
  {
    id: "ot-4",
    employeeId: "emp-1",
    overtimeTypeId: "ot-type-3",
    departmentId: "dept-1",
    overtimeDate: "2024-04-30",
    startTime: "08:00",
    endTime: "17:00",
    hours: 8,
    content: "Trực lễ 30/4",
    status: "department_approved",
    departmentApprovedById: "emp-4",
    departmentApprovedDate: "2024-04-28",
    createdAt: "2024-04-25T14:20:00Z"
  },
  {
    id: "ot-5",
    employeeId: "emp-6",
    overtimeTypeId: "ot-type-1",
    departmentId: "dept-3",
    overtimeDate: "2024-03-10",
    startTime: "17:30",
    endTime: "19:00",
    hours: 1.5,
    content: "Đào tạo nhân viên mới",
    status: "rejected",
    departmentApprovedById: "emp-7",
    departmentApprovedDate: "2024-03-11",
    rejectedById: "emp-5",
    rejectedDate: "2024-03-12",
    rejectionReason: "Không phù hợp với kế hoạch đào tạo",
    createdAt: "2024-03-10T16:00:00Z"
  },
  {
    id: "ot-6",
    employeeId: "emp-8",
    overtimeTypeId: "ot-type-4",
    departmentId: "dept-4",
    overtimeDate: "2024-03-15",
    startTime: "22:00",
    endTime: "24:00",
    hours: 2,
    content: "Bảo trì hệ thống sau giờ làm việc",
    status: "approved",
    departmentApprovedById: "emp-9",
    departmentApprovedDate: "2024-03-16",
    approvedById: "emp-5",
    approvedDate: "2024-03-17",
    createdAt: "2024-03-15T10:30:00Z"
  },
  {
    id: "ot-7",
    employeeId: "emp-10",
    overtimeTypeId: "ot-type-1",
    departmentId: "dept-5",
    overtimeDate: "2024-03-20",
    startTime: "17:30",
    endTime: "20:30",
    hours: 3,
    content: "Hoàn thiện dự án cho khách hàng",
    status: "department_approved",
    departmentApprovedById: "emp-11",
    departmentApprovedDate: "2024-03-21",
    createdAt: "2024-03-20T16:45:00Z"
  },
  {
    id: "ot-8",
    employeeId: "emp-12",
    overtimeTypeId: "ot-type-2",
    departmentId: "dept-6",
    overtimeDate: "2024-03-24",
    startTime: "09:00",
    endTime: "15:00",
    hours: 6,
    content: "Kiểm kê hàng hóa cuối tháng",
    status: "pending",
    createdAt: "2024-03-23T17:00:00Z"
  },
  {
    id: "ot-9",
    employeeId: "emp-2",
    overtimeTypeId: "ot-type-5",
    departmentId: "dept-1",
    overtimeDate: "2024-03-30",
    startTime: "22:00",
    endTime: "02:00",
    hours: 4,
    content: "Xử lý dữ liệu khẩn cấp",
    status: "approved",
    departmentApprovedById: "emp-4",
    departmentApprovedDate: "2024-03-31",
    approvedById: "emp-5",
    approvedDate: "2024-04-01",
    createdAt: "2024-03-29T14:00:00Z"
  },
  {
    id: "ot-10",
    employeeId: "emp-3",
    overtimeTypeId: "ot-type-1",
    departmentId: "dept-2",
    overtimeDate: "2024-04-05",
    startTime: "17:30",
    endTime: "19:30",
    hours: 2,
    content: "Họp khẩn với đối tác",
    status: "rejected",
    departmentApprovedById: "emp-4",
    departmentApprovedDate: "2024-04-06",
    rejectedById: "emp-5",
    rejectedDate: "2024-04-07",
    rejectionReason: "Không có ngân sách cho hoạt động này",
    createdAt: "2024-04-05T16:30:00Z"
  },
  {
    id: "ot-11",
    employeeId: "emp-6",
    overtimeTypeId: "ot-type-6",
    departmentId: "dept-3",
    overtimeDate: "2024-05-01",
    startTime: "22:00",
    endTime: "02:00",
    hours: 4,
    content: "Trực lễ 1/5 ban đêm",
    status: "department_approved",
    departmentApprovedById: "emp-7",
    departmentApprovedDate: "2024-04-29",
    createdAt: "2024-04-28T09:15:00Z"
  },
  {
    id: "ot-12",
    employeeId: "emp-8",
    overtimeTypeId: "ot-type-3",
    departmentId: "dept-4",
    overtimeDate: "2024-09-02",
    startTime: "08:00",
    endTime: "17:00",
    hours: 8,
    content: "Trực lễ Quốc khánh",
    status: "pending",
    createdAt: "2024-08-30T11:20:00Z"
  }
];
