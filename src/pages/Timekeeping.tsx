
import { motion } from 'framer-motion';
import TimeEntryDashboard from '@/components/timekeeping/TimeEntryDashboard';

const TimekeepingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Quản lý chấm công</h1>
        <p className="text-muted-foreground mt-1">Theo dõi dữ liệu chấm công của nhân viên</p>
      </div>
      
      <TimeEntryDashboard />
    </motion.div>
  );
};

export default TimekeepingPage;
