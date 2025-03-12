
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Form schema validation
const formSchema = z.object({
  jobPostingId: z.string().min(1, { message: 'Vui lòng chọn vị trí tuyển dụng' }),
  fullName: z.string().min(1, { message: 'Vui lòng nhập họ tên' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  phone: z.string().min(1, { message: 'Vui lòng nhập số điện thoại' }),
  resumeUrl: z.string().optional(),
  coverLetter: z.string().optional(),
  status: z.enum(['new', 'reviewing', 'interview', 'offered', 'hired', 'rejected']),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ApplicationFormProps {
  applicationId?: string;
  preselectedJobPostingId?: string;
  onSuccess: () => void;
}

const ApplicationForm = ({ applicationId, preselectedJobPostingId, onSuccess }: ApplicationFormProps) => {
  const { jobPostings, jobApplications, addJobApplication, updateJobApplication } = useAppStore();
  
  // Get the application if we're editing
  const application = applicationId 
    ? jobApplications.find(app => app.id === applicationId) 
    : null;
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobPostingId: preselectedJobPostingId || '',
      fullName: application?.fullName || '',
      email: application?.email || '',
      phone: application?.phone || '',
      resumeUrl: application?.resumeUrl || '',
      coverLetter: application?.coverLetter || '',
      status: application?.status || 'new',
      notes: application?.notes || '',
    }
  });
  
  // Form submission handler
  const onSubmit = (values: FormValues) => {
    if (applicationId) {
      // Update existing application
      updateJobApplication(applicationId, values);
    } else {
      // Add new application
      addJobApplication(values);
    }
    
    onSuccess();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="jobPostingId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vị trí tuyển dụng</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={!!preselectedJobPostingId}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vị trí ứng tuyển" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {jobPostings
                    .filter(posting => posting.status === 'open')
                    .map((posting) => (
                      <SelectItem key={posting.id} value={posting.id}>
                        {posting.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input placeholder="Nhập họ và tên ứng viên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="Số điện thoại" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="resumeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link CV (URL)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/cv.pdf" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thư xin việc</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập nội dung thư xin việc" 
                  className="min-h-[100px]" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="new">Mới</SelectItem>
                  <SelectItem value="reviewing">Đang xem xét</SelectItem>
                  <SelectItem value="interview">Phỏng vấn</SelectItem>
                  <SelectItem value="offered">Đã offer</SelectItem>
                  <SelectItem value="hired">Đã tuyển</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập ghi chú về ứng viên" 
                  className="min-h-[80px]" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Hủy
          </Button>
          <Button type="submit">
            {applicationId ? 'Cập nhật' : 'Thêm hồ sơ'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ApplicationForm;
