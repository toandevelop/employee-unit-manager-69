
import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeaveTypeForm } from "@/components/leave/LeaveTypeForm";
import { LeaveTypeTable } from "@/components/leave/LeaveTypeTable";

const LeaveTypes = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-6"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loại nghỉ phép</h1>
          <p className="text-muted-foreground">
            Quản lý các loại nghỉ phép trong hệ thống
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0" 
          onClick={() => setIsAddDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm loại nghỉ phép
        </Button>
      </div>

      <div className="grid gap-4">
        <LeaveTypeTable />
      </div>

      <LeaveTypeForm
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => {}}
      />
    </motion.div>
  );
};

export default LeaveTypes;
