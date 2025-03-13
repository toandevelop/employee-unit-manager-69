
import { useAppStore } from '@/store';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationFormValues } from '../schemas/applicationFormSchema';

interface JobPostingFieldProps {
  form: UseFormReturn<ApplicationFormValues>;
}

const JobPostingField = ({ form }: JobPostingFieldProps) => {
  const jobPostings = useAppStore((state) => state.jobPostings.filter(jp => jp.status === 'open'));
  
  return (
    <FormField
      control={form.control}
      name="jobPostingId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Vị trí ứng tuyển</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vị trí tuyển dụng" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {jobPostings.map((posting) => (
                <SelectItem key={posting.id} value={posting.id}>
                  {posting.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default JobPostingField;
