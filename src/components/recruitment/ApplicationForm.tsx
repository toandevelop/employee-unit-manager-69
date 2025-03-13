
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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ApplicationFormProps {
  onSuccess: () => void;
}

const applicationFormSchema = z.object({
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

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

const ApplicationForm = ({ onSuccess }: ApplicationFormProps) => {
  const jobPostings = useAppStore((state) => state.jobPostings.filter(jp => jp.status === 'open'));
  const addJobApplication = useAppStore((state) => state.addJobApplication);
  
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      jobPostingId: '',
      fullName: '',
      email: '',
      phone: '',
      resumeUrl: '',
      coverLetter: '',
      status: 'new',
    },
  });
  
  const onSubmit = (data: ApplicationFormValues) => {
    addJobApplication(data);
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
              <FormLabel>Vị trí ứng tuyển</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vị trí tuyển dụng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {jobPostings.map((posting) => (
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
                <Input placeholder="Nhập họ và tên đầy đủ" {...field} />
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
                  <Input placeholder="Ví dụ: 0901234567" {...field} />
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
              <FormLabel>Link hồ sơ (URL)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/resume.pdf" {...field} />
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
              <FormLabel>Thư ngỏ</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập thư ngỏ..." 
                  className="min-h-[150px]" 
                  {...field} 
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
              <Select 
                onValueChange={field.onChange} 
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="new">Mới</SelectItem>
                  <SelectItem value="reviewing">Đang xem xét</SelectItem>
                  <SelectItem value="interview">Phỏng vấn</SelectItem>
                  <SelectItem value="offered">Đã đề xuất</SelectItem>
                  <SelectItem value="hired">Đã tuyển</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>Hủy</Button>
          <Button type="submit">Lưu hồ sơ</Button>
        </div>
      </form>
    </Form>
  );
};

export default ApplicationForm;
