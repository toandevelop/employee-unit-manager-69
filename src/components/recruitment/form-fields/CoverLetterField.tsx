
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationFormValues } from '../schemas/applicationFormSchema';

interface CoverLetterFieldProps {
  form: UseFormReturn<ApplicationFormValues>;
}

const CoverLetterField = ({ form }: CoverLetterFieldProps) => {
  return (
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
  );
};

export default CoverLetterField;
