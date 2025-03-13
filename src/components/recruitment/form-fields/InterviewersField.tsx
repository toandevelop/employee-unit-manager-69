
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { InterviewFormValues } from '../schemas/interviewFormSchema';

interface InterviewersFieldProps {
  form: UseFormReturn<InterviewFormValues>;
}

const InterviewersField = ({ form }: InterviewersFieldProps) => {
  return (
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
  );
};

export default InterviewersField;
