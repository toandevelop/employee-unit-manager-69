
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { InterviewFormValues } from '../schemas/interviewFormSchema';

interface InterviewTypeFieldProps {
  form: UseFormReturn<InterviewFormValues>;
}

const InterviewTypeField = ({ form }: InterviewTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="interviewType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Hình thức phỏng vấn</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || undefined}
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
  );
};

export default InterviewTypeField;
