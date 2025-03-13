
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationFormValues } from '../schemas/applicationFormSchema';

interface ResumeFieldProps {
  form: UseFormReturn<ApplicationFormValues>;
}

const ResumeField = ({ form }: ResumeFieldProps) => {
  return (
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
  );
};

export default ResumeField;
