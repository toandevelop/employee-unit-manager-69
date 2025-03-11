
import { motion } from 'framer-motion';
import DeviceSyncDashboard from '@/components/timekeeping/DeviceSyncDashboard';

const DeviceSyncPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Đồng bộ máy chấm công</h1>
        <p className="text-muted-foreground mt-1">Quản lý dữ liệu thô từ các máy chấm công</p>
      </div>
      
      <DeviceSyncDashboard />
    </motion.div>
  );
};

export default DeviceSyncPage;
