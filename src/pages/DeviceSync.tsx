
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { DeviceSyncDashboard } from '@/components/timekeeping/DeviceSyncDashboard';
import { RawDataTable } from '@/components/timekeeping/RawDataTable';

const DeviceSyncPage = () => {
  const { syncDeviceData } = useAppStore();
  
  const handleSync = (deviceId: string) => {
    syncDeviceData(deviceId);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Đồng bộ thiết bị chấm công</h1>
        <p className="text-muted-foreground mt-1">Quản lý thiết bị và đồng bộ dữ liệu chấm công</p>
      </div>
      
      <DeviceSyncDashboard onSync={handleSync} />
      
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Dữ liệu chấm công thô</h2>
        <RawDataTable />
      </div>
    </motion.div>
  );
};

export default DeviceSyncPage;
