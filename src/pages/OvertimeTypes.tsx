
import { useState } from "react";
import { motion } from "framer-motion";
import { FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OvertimeTypeTable } from "@/components/overtime/OvertimeTypeTable";
import { OvertimeTypeForm } from "@/components/overtime/OvertimeTypeForm";

const OvertimeTypes = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleOvertimeTypeSuccess = () => {
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
          <h1 className="text-3xl font-bold tracking-tight">Loại tăng ca</h1>
          <p className="text-muted-foreground">
            Quản lý các loại tăng ca theo quy định của pháp luật lao động Việt Nam
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <FilePlus className="mr-2 h-4 w-4" />
          Thêm loại tăng ca
        </Button>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <OvertimeTypeTable />
      </div>

      <OvertimeTypeForm
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleOvertimeTypeSuccess}
      />
    </motion.div>
  );
};

export default OvertimeTypes;
