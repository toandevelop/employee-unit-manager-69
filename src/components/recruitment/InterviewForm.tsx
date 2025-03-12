
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/store';
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
  interviewDate: z.date({ required_error: 'Vui lòng chọn ngày phỏng vấn' }),
  interviewTime: z.string().min(1, { message: 'Vui lòng nhập giờ phỏng vấn' }),
  interviewType: z.enum(['phone', 'online', 'in-person']),
  interviewers: z.string().min(1, { message: 'Vui lòng nhập người phỏng vấn' }),
  location: z.string().optional(),
  meetingLink: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'canceled']),
  feedback: z.string().optional(),
  rating: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InterviewFormProps {
  applicationId: string;
  interviewId?: string;
  onSuccess: () => void;
}

const InterviewForm = ({ applicationId, interviewId, onSuccess }: InterviewFormProps) => {
  const { interviews, addInterview, updateInterview } = useAppStore();
  
  // Get the interview if we're editing
  const interview = interviewId 
    ? interviews.find(i => i.id === interviewId) 
    : null;
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interviewDate: new Date(),
      interviewTime: '',
      interviewType: 'online' as const,
      interviewers: '',
      location: '',
      meetingLink: '',
      notes: '',
      status: 'scheduled' as const,
      feedback: '',
      rating: '',
    }
  });
  
  // Set form values if editing an existing interview
  useEffect(() => {
    if (interview) {
      form.reset({
        interviewDate: new Date(interview.interviewDate),
        interviewTime: interview.interviewTime,
        interviewType: interview.interviewType,
        interviewers: interview.interviewers.join(', '),
        location: interview.location || '',
        meetingLink: interview.meetingLink || '',
        notes: interview.notes || '',
        status: interview.status,
        feedback: interview.feedback || '',
        rating: interview.rating ? String(interview.rating) : '',
      });
    }
  }, [interview, form]);
  
  // Form submission handler
  const onSubmit = (values: FormValues) => {
    // Convert data for submission
    const interviewData = {
      ...values,
      interviewDate: values.interviewDate.toISOString().split('T')[0],
      interviewers: values.interviewers.split(',').map(i => i.trim()),
      rating: values.rating ? parseInt(values.rating) : undefined,
      applicationId,
    };
    
    if (interviewId) {
      // Update existing interview
      updateInterview(interviewId, interviewData);
    } else {
      // Add new interview
      addInterview(interviewData);
    }
    
    onSuccess();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="interviewDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày phỏng vấn</FormLabel>
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
            name="interviewTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ phỏng vấn</FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: 10:00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="interviewType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình thức phỏng vấn</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hình thức" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="phone">Phỏng vấn qua điện thoại</SelectItem>
                    <SelectItem value="online">Phỏng vấn trực tuyến</SelectItem>
                    <SelectItem value="in-person">Phỏng vấn trực tiếp</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                    <SelectItem value="completed">Đã hoàn thành</SelectItem>
                    <SelectItem value="canceled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="interviewers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Người phỏng vấn</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên người phỏng vấn, phân tách bằng dấu phẩy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.watch('interviewType') === 'in-person' && (
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa điểm</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa điểm phỏng vấn" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {form.watch('interviewType') === 'online' && (
            <FormField
              control={form.control}
              name="meetingLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link phỏng vấn</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập link phỏng vấn" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú phỏng vấn</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập các ghi chú về buổi phỏng vấn" 
                  className="min-h-[80px]" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.watch('status') === 'completed' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đánh giá (1-5)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn đánh giá" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 - Kém</SelectItem>
                        <SelectItem value="2">2 - Trung bình</SelectItem>
                        <SelectItem value="3">3 - Khá</SelectItem>
                        <SelectItem value="4">4 - Tốt</SelectItem>
                        <SelectItem value="5">5 - Xuất sắc</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đánh giá chi tiết</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Nhập đánh giá chi tiết về ứng viên" 
                      className="min-h-[100px]" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Hủy
          </Button>
          <Button type="submit">
            {interviewId ? 'Cập nhật' : 'Lên lịch phỏng vấn'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InterviewForm;
