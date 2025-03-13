
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { InterviewFormValues } from '../schemas/interviewFormSchema';

interface InterviewFeedbackFieldsProps {
  form: UseFormReturn<InterviewFormValues>;
  status: string;
}

const InterviewFeedbackFields = ({ form, status }: InterviewFeedbackFieldsProps) => {
  if (status !== 'completed') {
    return null;
  }

  return (
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
              value={field.value?.toString() || undefined}
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
  );
};

export default InterviewFeedbackFields;
