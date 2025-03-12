
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobPostingsList from '@/components/recruitment/JobPostingsList';
import ApplicationsList from '@/components/recruitment/ApplicationsList';

const RecruitmentPage = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Quản lý tuyển dụng</h1>
        <p className="text-muted-foreground mt-1">Theo dõi và quản lý quy trình tuyển dụng nhân sự</p>
      </div>
      
      <Tabs defaultValue="jobs" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="jobs">Vị trí tuyển dụng</TabsTrigger>
          <TabsTrigger value="applications">Hồ sơ ứng viên</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="mt-0">
          <JobPostingsList />
        </TabsContent>
        
        <TabsContent value="applications" className="mt-0">
          <ApplicationsList />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default RecruitmentPage;
