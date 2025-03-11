
import { useState } from 'react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WorkShiftTable from './WorkShiftTable';
import WorkShiftDialog from './WorkShiftDialog';
import { WorkShift } from '@/types';

const WorkShiftDashboard = () => {
  const { workShifts } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<WorkShift | null>(null);
  
  const handleAddShift = () => {
    setEditingShift(null);
    setIsDialogOpen(true);
  };
  
  const handleEditShift = (shift: WorkShift) => {
    setEditingShift(shift);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý ca làm việc</h1>
          <p className="text-muted-foreground mt-1">Tạo và quản lý các ca làm việc</p>
        </div>
        
        <Button 
          className="flex gap-2 shadow-md hover:shadow-lg transition-all"
          onClick={handleAddShift}
        >
          <Plus className="h-4 w-4" />
          <span>Thêm ca làm việc</span>
        </Button>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng ca làm việc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workShifts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ca sáng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workShifts.filter(shift => 
                new Date(`2000-01-01T${shift.startTime}`) < new Date('2000-01-01T12:00')
              ).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ca chiều</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workShifts.filter(shift => 
                new Date(`2000-01-01T${shift.startTime}`) >= new Date('2000-01-01T12:00') &&
                new Date(`2000-01-01T${shift.startTime}`) < new Date('2000-01-01T18:00')
              ).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ca tối</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workShifts.filter(shift => 
                new Date(`2000-01-01T${shift.startTime}`) >= new Date('2000-01-01T18:00')
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <WorkShiftTable 
        workShifts={workShifts}
        onEditClick={handleEditShift}
      />
      
      <WorkShiftDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        shift={editingShift}
      />
    </div>
  );
};

export default WorkShiftDashboard;
