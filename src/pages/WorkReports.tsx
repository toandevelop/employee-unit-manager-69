
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Search } from 'lucide-react';
import WorkReportList from '@/components/workReport/WorkReportList';

const WorkReportsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { employees } = useAppStore();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span>Báo cáo công việc</span>
          </h1>
          <p className="text-muted-foreground">Quản lý báo cáo công việc hàng tuần của nhân viên</p>
        </div>
        
        <Button
          onClick={() => navigate('/work-reports/add')}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo báo cáo mới</span>
        </Button>
      </div>
      
      <div className="flex w-full max-w-sm items-center space-x-2 mb-6">
        <Input
          type="search"
          placeholder="Tìm kiếm báo cáo..."
          className="flex-1"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      <WorkReportList />
    </motion.div>
  );
};

export default WorkReportsPage;
