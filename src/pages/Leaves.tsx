
import { useState } from "react";
import { motion } from "framer-motion";
import { FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeaveForm } from "@/components/leave/LeaveForm";
import { LeaveTable } from "@/components/leave/LeaveTable";
import { LeaveDashboard } from "@/components/leave/LeaveDashboard";
import { LeaveFilters, LeaveFilters as LeaveFiltersType } from "@/components/leave/LeaveFilters";
import { useAppStore } from "@/store";

const Leaves = () => {
  const { leaves } = useAppStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filters, setFilters] = useState<LeaveFiltersType>({
    filterType: 'month',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    departmentId: undefined,
    employeeId: undefined
  });

  const handleFilterChange = (newFilters: LeaveFiltersType) => {
    setFilters(newFilters);
  };

  const handleLeaveSuccess = () => {
    // Refresh data or update UI as needed
    console.log("Leave request submitted successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-6"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý nghỉ phép</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin đăng ký nghỉ phép của nhân viên
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0" 
          onClick={() => setIsAddDialogOpen(true)}
        >
          <FilePlus className="mr-2 h-4 w-4" />
          Thêm đơn nghỉ phép
        </Button>
      </div>

      <LeaveDashboard 
        startDate={filters.startDate}
        endDate={filters.endDate}
        departmentId={filters.departmentId}
        employeeId={filters.employeeId}
      />

      <LeaveFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <LeaveTable 
        startDate={filters.startDate}
        endDate={filters.endDate}
        departmentId={filters.departmentId}
        employeeId={filters.employeeId}
      />

      <LeaveForm
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleLeaveSuccess}
      />
    </motion.div>
  );
};

export default Leaves;
