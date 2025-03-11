
import { useState } from "react";
import { useAppStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkShiftBar } from "@/components/timekeeping/WorkShiftBar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { WorkShiftDialog } from "@/components/timekeeping/WorkShiftDialog";

export function WorkShiftDashboard() {
  const { workShifts } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalShifts = workShifts.length;
  const morningShifts = workShifts.filter(shift => {
    const startHour = parseInt(shift.startTime.split(':')[0]);
    return startHour >= 5 && startHour < 12;
  }).length;
  
  const afternoonShifts = workShifts.filter(shift => {
    const startHour = parseInt(shift.startTime.split(':')[0]);
    return startHour >= 12 && startHour < 18;
  }).length;
  
  const nightShifts = workShifts.filter(shift => {
    const startHour = parseInt(shift.startTime.split(':')[0]);
    return startHour >= 18 || startHour < 5;
  }).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tổng số ca làm việc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalShifts}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ca sáng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{morningShifts}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ca chiều
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{afternoonShifts}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ca đêm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{nightShifts}</div>
        </CardContent>
      </Card>

      <div className="md:col-span-2 lg:col-span-4">
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="mb-4"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm ca làm việc mới
        </Button>

        <Tabs defaultValue="distribution">
          <TabsList className="mb-4">
            <TabsTrigger value="distribution">Phân bố ca làm việc</TabsTrigger>
          </TabsList>
          <TabsContent value="distribution">
            <WorkShiftBar />
          </TabsContent>
        </Tabs>
      </div>
      
      <WorkShiftDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
}
