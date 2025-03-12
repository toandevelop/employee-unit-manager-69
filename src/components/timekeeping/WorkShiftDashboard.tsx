
import { useState } from "react";
import { useAppStore } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkShiftBar } from "@/components/timekeeping/WorkShiftBar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { WorkShiftDialog } from "@/components/timekeeping/WorkShiftDialog";
import { WorkShiftTable } from "@/components/timekeeping/WorkShiftTable";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý ca làm việc</h1>
        <p className="text-muted-foreground mt-1">Tạo và quản lý ca làm việc cho nhân viên</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      </div>

      <div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="mb-4"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm ca làm việc mới
        </Button>

        <Tabs defaultValue="distribution" className="space-y-4">
          <TabsList>
            <TabsTrigger value="distribution">Phân bố ca làm việc</TabsTrigger>
            <TabsTrigger value="table">Danh sách ca làm việc</TabsTrigger>
          </TabsList>
          <TabsContent value="distribution" className="space-y-4">
            <WorkShiftBar />
          </TabsContent>
          <TabsContent value="table" className="space-y-4">
            <WorkShiftTable />
          </TabsContent>
        </Tabs>
      </div>
      
      <WorkShiftDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
}
