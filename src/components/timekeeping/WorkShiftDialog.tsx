
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WorkShift } from '@/types';
import { useAppStore } from '@/store';
import { toast } from 'sonner';

interface WorkShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift: WorkShift | null;
}

const formSchema = z.object({
  code: z.string().min(2, {
    message: "Mã ca làm việc phải có ít nhất 2 ký tự",
  }),
  name: z.string().min(2, {
    message: "Tên ca làm việc phải có ít nhất 2 ký tự",
  }),
  startTime: z.string().min(1, {
    message: "Vui lòng nhập thời gian bắt đầu",
  }),
  endTime: z.string().min(1, {
    message: "Vui lòng nhập thời gian kết thúc",
  }),
  description: z.string().optional(),
});

const WorkShiftDialog: React.FC<WorkShiftDialogProps> = ({
  open,
  onOpenChange,
  shift
}) => {
  const { addWorkShift, updateWorkShift, workShifts } = useAppStore();
  const isEditing = Boolean(shift);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: shift?.code || '',
      name: shift?.name || '',
      startTime: shift?.startTime || '',
      endTime: shift?.endTime || '',
      description: shift?.description || '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Check if code already exists (for new shifts)
    if (!isEditing && workShifts.some(s => s.code === data.code)) {
      form.setError('code', {
        type: 'manual',
        message: 'Mã ca làm việc đã tồn tại'
      });
      return;
    }
    
    if (isEditing && shift) {
      updateWorkShift(shift.id, data);
      toast.success('Cập nhật ca làm việc thành công');
    } else {
      addWorkShift(data);
      toast.success('Thêm ca làm việc mới thành công');
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Chỉnh sửa ca làm việc' : 'Thêm ca làm việc mới'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Chỉnh sửa thông tin ca làm việc'
              : 'Nhập thông tin cho ca làm việc mới'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã ca làm việc</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ví dụ: CA-SANG" 
                        {...field} 
                        disabled={isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên ca làm việc</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: Ca sáng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian bắt đầu</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian kết thúc</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ca làm việc"
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit">
                {isEditing ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkShiftDialog;
