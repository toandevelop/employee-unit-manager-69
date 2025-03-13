
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { InterviewFormValues } from '../schemas/interviewFormSchema';

interface InterviewNotesFieldProps {
  form: UseFormReturn<InterviewFormValues>;
}

const InterviewNotesField = ({ form }: InterviewNotesFieldProps) => {
  return (
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
  );
};

export default InterviewNotesField;
