
import { useState } from "react";
import { motion } from "framer-motion";
import { FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OvertimeForm } from "@/components/overtime/OvertimeForm";
import { OvertimeTable } from "@/components/overtime/OvertimeTable";
import { OvertimeDashboard } from "@/components/overtime/OvertimeDashboard";
import { OvertimeFilters, OvertimeFilters as OvertimeFiltersType } from "@/components/overtime/OvertimeFilters";

const Overtimes = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filters, setFilters] = useState<OvertimeFiltersType>({
    filterType: 'month',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    departmentId: undefined,
    employeeId: undefined
  });

  const handleFilterChange = (newFilters: OvertimeFiltersType) => {
    setFilters(newFilters);
  };

  const handleOvertimeSuccess = () => {
    // Handle success, e.g., refresh data
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
          <h1 className="text-3xl font-bold tracking-tight">Quản lý tăng ca</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin đăng ký tăng ca của nhân viên
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0" 
          onClick={() => setIsAddDialogOpen(true)}
        >
          <FilePlus className="mr-2 h-4 w-4" />
          Đăng ký tăng ca
        </Button>
      </div>

      <OvertimeDashboard 
        startDate={filters.startDate}
        endDate={filters.endDate}
        departmentId={filters.departmentId}
        employeeId={filters.employeeId}
      />

      <OvertimeFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <OvertimeTable 
        startDate={filters.startDate}
        endDate={filters.endDate}
        departmentId={filters.departmentId}
        employeeId={filters.employeeId}
      />

      <OvertimeForm
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleOvertimeSuccess}
      />
    </motion.div>
  );
};

export default Overtimes;
