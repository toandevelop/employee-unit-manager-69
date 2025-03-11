
import { useState } from "react";
import { motion } from "framer-motion";
import { FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeaveTypeTable } from "@/components/leave/LeaveTypeTable";
import { LeaveTypeForm } from "@/components/leave/LeaveTypeForm";

const LeaveTypes = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleLeaveTypeSuccess = () => {
    // Handle success, e.g., refresh data
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loại nghỉ phép</h1>
          <p className="text-muted-foreground">
            Quản lý các loại nghỉ phép theo quy định của pháp luật lao động Việt Nam
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <FilePlus className="mr-2 h-4 w-4" />
          Thêm loại nghỉ phép
        </Button>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <LeaveTypeTable />
      </div>

      <LeaveTypeForm
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleLeaveTypeSuccess}
      />
    </motion.div>
  );
};

export default LeaveTypes;
