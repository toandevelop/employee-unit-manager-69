
import * as z from 'zod';

export const applicationFormSchema = z.object({
  jobPostingId: z.string().min(1, { message: 'Vui lòng chọn vị trí ứng tuyển' }),
  fullName: z.string().min(2, { message: 'Vui lòng nhập họ và tên đầy đủ' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  phone: z.string().min(10, { message: 'Số điện thoại không hợp lệ' }),
  resumeUrl: z.string().url({ message: 'URL không hợp lệ' }).optional().or(z.literal('')),
  coverLetter: z.string().optional(),
  status: z.enum(['new', 'reviewing', 'interview', 'offered', 'hired', 'rejected'], { 
    required_error: 'Vui lòng chọn trạng thái' 
  }),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export const defaultValues: ApplicationFormValues = {
  jobPostingId: '',
  fullName: '',
  email: '',
  phone: '',
  resumeUrl: '',
  coverLetter: '',
  status: 'new',
};
