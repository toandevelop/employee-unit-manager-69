
import { z } from "zod";

export const formSchema = z.object({
  code: z.string().min(1, "Mã nhân viên không được để trống"),
  name: z.string().min(1, "Tên nhân viên không được để trống"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  phone: z.string().min(1, "Số điện thoại không được để trống"),
  identityCard: z.string().min(1, "Số CMND/CCCD không được để trống"),
  contractDate: z.string().min(1, "Ngày hợp đồng không được để trống"),
  departmentIds: z.array(z.string()).min(1, "Phải chọn ít nhất một đơn vị"),
  positionIds: z.array(z.string()).min(1, "Phải chọn ít nhất một chức vụ"),
  academicDegreeId: z.string().min(1, "Học vị không được để trống"),
  academicTitleId: z.string().optional(),
  avatar: z.string().optional(),
  idPhoto: z.string().optional(),
  originalIdPhoto: z.string().optional(), // Store the original image for cropping
});

export type EmployeeFormValues = z.infer<typeof formSchema>;
