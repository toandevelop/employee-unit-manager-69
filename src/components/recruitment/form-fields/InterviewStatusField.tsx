
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { InterviewFormValues } from '../schemas/interviewFormSchema';
import StatusBadge from '../StatusBadge';

interface InterviewStatusFieldProps {
  form: UseFormReturn<InterviewFormValues>;
}

const InterviewStatusField = ({ form }: InterviewStatusFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Trạng thái</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái">
                  {field.value && (
                    <div className="flex items-center gap-2">
                      <StatusBadge status={field.value} type="interview" />
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="scheduled">
                <div className="flex items-center gap-2">
                  <StatusBadge status="scheduled" type="interview" />
                </div>
              </SelectItem>
              <SelectItem value="completed">
                <div className="flex items-center gap-2">
                  <StatusBadge status="completed" type="interview" />
                </div>
              </SelectItem>
              <SelectItem value="canceled">
                <div className="flex items-center gap-2">
                  <StatusBadge status="canceled" type="interview" />
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InterviewStatusField;
