
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store';
import { WorkShiftBar } from '@/components/timekeeping/WorkShiftBar';
import { WorkShiftDialog } from '@/components/timekeeping/WorkShiftDialog';
import WorkShiftTable from '@/components/timekeeping/WorkShiftTable';

export interface WorkShiftDashboardProps {
  // No props needed for now
}

export const WorkShiftDashboard = ({}: WorkShiftDashboardProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  
  const { workShifts, addWorkShift, updateWorkShift, deleteWorkShift } = useAppStore();
  
  const handleEdit = (id: string) => {
    setSelectedShiftId(id);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ca làm việc này?')) {
      deleteWorkShift(id);
    }
  };
  
  // Get selected shift for editing
  const selectedShift = selectedShiftId 
    ? workShifts.find(shift => shift.id === selectedShiftId)
    : null;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Ca làm việc</h2>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Thêm ca mới
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Thời gian ca làm việc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <WorkShiftBar shifts={workShifts} />
            
            <div className="mt-6">
              <WorkShiftTable 
                workShifts={workShifts}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Dialog */}
      <WorkShiftDialog 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onSubmit={(data) => {
          addWorkShift(data);
          setIsAddDialogOpen(false);
        }}
      />
      
      {/* Edit Dialog */}
      {selectedShift && (
        <WorkShiftDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          defaultValues={selectedShift}
          onSubmit={(data) => {
            updateWorkShift(selectedShiftId!, data);
            setIsEditDialogOpen(false);
          }}
          mode="edit"
        />
      )}
    </div>
  );
};
