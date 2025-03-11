
import { motion } from 'framer-motion';
import WorkShiftDashboard from '@/components/timekeeping/WorkShiftDashboard';

const WorkShiftsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <WorkShiftDashboard />
    </motion.div>
  );
};

export default WorkShiftsPage;
