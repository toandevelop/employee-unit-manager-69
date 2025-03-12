
import { motion } from "framer-motion";
import { DeviceSyncDashboard } from "@/components/timekeeping/DeviceSyncDashboard";
import { RawDataTable } from "@/components/timekeeping/RawDataTable";

const DeviceSync = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-6 space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Đồng bộ máy chấm công
        </h1>
        <p className="text-muted-foreground">
          Quản lý dữ liệu từ thiết bị chấm công và đồng bộ vào hệ thống
        </p>
      </div>

      <DeviceSyncDashboard />

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Dữ liệu chấm công thô</h2>
        <RawDataTable />
      </div>
    </motion.div>
  );
};

export default DeviceSync;
