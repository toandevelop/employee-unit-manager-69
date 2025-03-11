
import { useState } from 'react';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TimeEntry } from '@/types';
import { useAppStore } from '@/store';
import { toast } from 'sonner';

interface TimeEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: TimeEntry;
}

const formSchema = z.object({
  checkInTime: z.string().nullable().optional(),
  checkOutTime: z.string().nullable().optional(),
  status: z.enum(['late', 'early_leave', 'normal', 'absent', 'leave', 'holiday']),
  overtimeHours: z.number().min(0).max(24),
  notes: z.string().nullable().optional(),
});

const TimeEntryDialog: React.FC<TimeEntryDialogProps> = ({ 
  open, 
  onOpenChange,
  entry 
}) => {
  const { updateTimeEntry } = useAppStore();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkInTime: entry.checkInTime || '',
      checkOutTime: entry.checkOutTime || '',
      status: entry.status,
      overtimeHours: entry.overtimeHours,
      notes: entry.notes || '',
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateTimeEntry(entry.id, {
      ...data,
      checkInTime: data.checkInTime || undefined,
      checkOutTime: data.checkOutTime || undefined,
      notes: data.notes || undefined,
    });
    toast.success('Cập nhật dữ liệu chấm công thành công');
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa dữ liệu chấm công</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin chấm công của nhân viên
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="checkInTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ vào</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="checkOutTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ ra</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="normal">Bình thường</SelectItem>
                        <SelectItem value="late">Đi muộn</SelectItem>
                        <SelectItem value="early_leave">Về sớm</SelectItem>
                        <SelectItem value="absent">Vắng mặt</SelectItem>
                        <SelectItem value="leave">Nghỉ phép</SelectItem>
                        <SelectItem value="holiday">Ngày lễ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="overtimeHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ tăng ca</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        max="24"
                        step="0.5"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập ghi chú cho dữ liệu chấm công này"
                      className="resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">Lưu thay đổi</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TimeEntryDialog;
