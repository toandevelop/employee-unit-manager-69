
import { useForm } from 'react-hook-form';
import { useAppStore } from '@/store';
import { Interview } from '@/types';
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
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface InterviewFormProps {
  applicationId: string;
  interview?: Interview;
  onSuccess: () => void;
}

const InterviewForm = ({ applicationId, interview, onSuccess }: InterviewFormProps) => {
  const addInterview = useAppStore((state) => state.addInterview);
  const updateInterview = useAppStore((state) => state.updateInterview);
  
  const defaultValues = interview
    ? {
        ...interview,
        interviewDate: new Date(interview.interviewDate),
        interviewersInput: interview.interviewers.join(', '),
      }
    : {
        applicationId,
        interviewDate: new Date(),
        interviewTime: '09:00',
        interviewType: 'in-person',
        interviewersInput: '',
        location: '',
        meetingLink: '',
        notes: '',
        status: 'scheduled',
        feedback: '',
        rating: undefined,
      };
  
  const form = useForm({
    defaultValues,
  });
  
  const watchInterviewType = form.watch('interviewType');
  
  const onSubmit = (data: any) => {
    // Convert the comma-separated interviewers string to an array
    const interviewers = data.interviewersInput
      .split(',')
      .map((name: string) => name.trim())
      .filter((name: string) => name !== '');
    
    const submitData = {
      ...data,
      interviewDate: data.interviewDate.toISOString().split('T')[0],
      interviewers,
    };
    
    // Remove the temporary interviewersInput field
    delete submitData.interviewersInput;
    
    if (interview) {
      updateInterview(interview.id, submitData);
    } else {
      addInterview(submitData);
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
                        className="pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, 'dd/MM/yyyy', { locale: vi })
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
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="interviewType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình thức phỏng vấn</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hình thức phỏng vấn" />
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
        
        {watchInterviewType === 'in-person' && (
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa điểm</FormLabel>
                <FormControl>
                  <Input placeholder="Vd: Phòng họp tầng 3, 123 Đường ABC..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {watchInterviewType === 'online' && (
          <FormField
            control={form.control}
            name="meetingLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link phỏng vấn</FormLabel>
                <FormControl>
                  <Input placeholder="Vd: https://meet.google.com/abc-def-ghi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="interviewersInput"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Người phỏng vấn</FormLabel>
              <FormControl>
                <Input placeholder="Tên người phỏng vấn, cách nhau bởi dấu phẩy" {...field} />
              </FormControl>
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
                <Textarea placeholder="Ghi chú cho buổi phỏng vấn..." {...field} />
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
                defaultValue={field.value}
              >
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
        
        {form.watch('status') === 'completed' && (
          <>
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đánh giá</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhận xét sau phỏng vấn..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đánh giá (số sao)</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn số sao đánh giá" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 sao</SelectItem>
                      <SelectItem value="2">2 sao</SelectItem>
                      <SelectItem value="3">3 sao</SelectItem>
                      <SelectItem value="4">4 sao</SelectItem>
                      <SelectItem value="5">5 sao</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>Hủy</Button>
          <Button type="submit">{interview ? 'Cập nhật' : 'Tạo mới'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default InterviewForm;
