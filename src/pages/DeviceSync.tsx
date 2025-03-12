
import { motion } from 'framer-motion';
import { DeviceSyncDashboard } from '@/components/timekeeping/DeviceSyncDashboard';
import { RawDataTable } from '@/components/timekeeping/RawDataTable';
import { useAppStore } from '@/store';

const DeviceSyncPage = () => {
  const { syncDeviceData } = useAppStore();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Đồng bộ dữ liệu chấm công</h1>
        <p className="text-muted-foreground mt-1">Quản lý thiết bị và đồng bộ dữ liệu</p>
      </div>
      
      <DeviceSyncDashboard onSync={syncDeviceData} />
      <RawDataTable />
    </motion.div>
  );
};

export default DeviceSyncPage;
