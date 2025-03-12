
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/store';
import { JobPosting } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

// Form schema validation
const formSchema = z.object({
  title: z.string().min(1, { message: 'Vui lòng nhập tiêu đề vị trí' }),
  departmentId: z.string().min(1, { message: 'Vui lòng chọn phòng ban' }),
  positionId: z.string().min(1, { message: 'Vui lòng chọn chức vụ' }),
  description: z.string().min(1, { message: 'Vui lòng nhập mô tả công việc' }),
  requirements: z.string().min(1, { message: 'Vui lòng nhập yêu cầu công việc' }),
  salary: z.string().min(1, { message: 'Vui lòng nhập mức lương' }),
  status: z.enum(['open', 'closed', 'draft']),
  openDate: z.date({ required_error: 'Vui lòng chọn ngày mở đơn' }),
  closeDate: z.date({ required_error: 'Vui lòng chọn ngày đóng đơn' }),
});

type FormValues = z.infer<typeof formSchema>;

interface JobPostingFormProps {
  jobPostingId?: string;
  onSuccess: () => void;
}

const JobPostingForm = ({ jobPostingId, onSuccess }: JobPostingFormProps) => {
  const { departments, positions, jobPostings, addJobPosting, updateJobPosting } = useAppStore();
  
  // Get the job posting if we're editing
  const jobPosting = jobPostingId 
    ? jobPostings.find(jp => jp.id === jobPostingId) 
    : null;
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      departmentId: '',
      positionId: '',
      description: '',
      requirements: '',
      salary: '',
      status: 'draft' as const,
      openDate: new Date(),
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
    }
  });
  
  // Set form values if editing an existing job posting
  useEffect(() => {
    if (jobPosting) {
      form.reset({
        title: jobPosting.title,
        departmentId: jobPosting.departmentId,
        positionId: jobPosting.positionId,
        description: jobPosting.description,
        requirements: jobPosting.requirements,
        salary: jobPosting.salary,
        status: jobPosting.status as 'open' | 'closed' | 'draft',
        openDate: new Date(jobPosting.openDate),
        closeDate: new Date(jobPosting.closeDate),
      });
    }
  }, [jobPosting, form]);
  
  // Form submission handler
  const onSubmit = (values: FormValues) => {
    // Convert dates to ISO strings for storage
    const formattedValues = {
      ...values,
      openDate: values.openDate.toISOString().split('T')[0],
      closeDate: values.closeDate.toISOString().split('T')[0],
    };
    
    if (jobPostingId) {
      // Update existing job posting
      updateJobPosting(jobPostingId, formattedValues);
    } else {
      // Add new job posting
      addJobPosting(formattedValues);
    }
    
    onSuccess();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề vị trí</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tiêu đề vị trí tuyển dụng" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phòng ban</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
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
            name="positionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chức vụ</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chức vụ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả công việc</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập mô tả chi tiết về công việc" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yêu cầu công việc</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập các yêu cầu đối với ứng viên" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mức lương</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: 15-20 triệu VNĐ" {...field} />
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
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="open">Đang mở</SelectItem>
                    <SelectItem value="closed">Đã đóng</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="openDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày mở đơn</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="closeDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày đóng đơn</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Hủy
          </Button>
          <Button type="submit">
            {jobPostingId ? 'Cập nhật' : 'Tạo vị trí'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JobPostingForm;
