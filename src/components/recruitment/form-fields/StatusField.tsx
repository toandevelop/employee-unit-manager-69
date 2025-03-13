
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
import StatusBadge from '../StatusBadge';

interface StatusFieldProps {
  form: UseFormReturn<ApplicationFormValues>;
}

const StatusField = ({ form }: StatusFieldProps) => {
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
                      <StatusBadge status={field.value} type="application" />
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="new">
                <div className="flex items-center gap-2">
                  <StatusBadge status="new" type="application" />
                </div>
              </SelectItem>
              <SelectItem value="reviewing">
                <div className="flex items-center gap-2">
                  <StatusBadge status="reviewing" type="application" />
                </div>
              </SelectItem>
              <SelectItem value="interview">
                <div className="flex items-center gap-2">
                  <StatusBadge status="interview" type="application" />
                </div>
              </SelectItem>
              <SelectItem value="offered">
                <div className="flex items-center gap-2">
                  <StatusBadge status="offered" type="application" />
                </div>
              </SelectItem>
              <SelectItem value="hired">
                <div className="flex items-center gap-2">
                  <StatusBadge status="hired" type="application" />
                </div>
              </SelectItem>
              <SelectItem value="rejected">
                <div className="flex items-center gap-2">
                  <StatusBadge status="rejected" type="application" />
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

export default StatusField;
