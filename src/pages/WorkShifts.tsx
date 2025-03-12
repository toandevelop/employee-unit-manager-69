
import { motion } from 'framer-motion';
import { WorkShiftDashboard } from '@/components/timekeeping/WorkShiftDashboard';

const WorkShiftsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Quản lý ca làm việc</h1>
        <p className="text-muted-foreground mt-1">Thiết lập và quản lý ca làm việc</p>
      </div>
      
      <WorkShiftDashboard />
    </motion.div>
  );
};

export default WorkShiftsPage;
