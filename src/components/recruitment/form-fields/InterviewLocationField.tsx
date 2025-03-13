
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { InterviewFormValues } from '../schemas/interviewFormSchema';

interface InterviewLocationFieldProps {
  form: UseFormReturn<InterviewFormValues>;
  interviewType: string;
}

const InterviewLocationField = ({ form, interviewType }: InterviewLocationFieldProps) => {
  if (interviewType === 'in-person') {
    return (
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
    );
  }
  
  if (interviewType === 'online') {
    return (
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
    );
  }
  
  return null;
};

export default InterviewLocationField;
