
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
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="new">Mới</SelectItem>
              <SelectItem value="reviewing">Đang xem xét</SelectItem>
              <SelectItem value="interview">Phỏng vấn</SelectItem>
              <SelectItem value="offered">Đã đề xuất</SelectItem>
              <SelectItem value="hired">Đã tuyển</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StatusField;
