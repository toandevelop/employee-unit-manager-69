
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '@/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import WorkReportForm, { WorkReportFormValues } from '@/components/workReport/WorkReportForm';

const AddWorkReportPage = () => {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  
  // Get data and functions from the store
  const { addWorkReport, submitWorkReport } = useAppStore();
  
  // Handle adding a new work report
  const handleAddWorkReport = (formData: WorkReportFormValues, isDraft: boolean) => {
    console.log("Adding work report with data:", formData);
    
    // Add the work report to the store
    addWorkReport({
      ...formData,
      status: 'draft',
    });
    
    // If not a draft, submit immediately
    if (!isDraft) {
      // Get the latest work report (which will be the one we just added)
      const reports = useAppStore.getState().workReports;
      const latestReport = reports[reports.length - 1];
      if (latestReport) {
        submitWorkReport(latestReport.id);
      }
    }
    
    toast.success(isDraft ? "Lưu báo cáo nháp thành công" : "Nộp báo cáo công việc thành công");
    navigate('/work-reports');
  };
  
  const handleCancel = () => {
    navigate('/work-reports');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center bg-card rounded-lg p-4 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span>Tạo báo cáo công việc</span>
          </h1>
          <p className="text-muted-foreground mt-1">Nhập thông tin báo cáo công việc hàng tuần</p>
        </div>
        
        <Button variant="outline" className="flex gap-2 shadow-sm hover:shadow-md transition-all" onClick={() => navigate('/work-reports')}>
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Button>
      </div>
      
      <Card className="bg-card border rounded-lg shadow-sm">
        <CardContent className="p-6">
          <div className="max-w-4xl mx-auto">
            <WorkReportForm
              employeeId={employeeId}
              onSubmit={handleAddWorkReport}
              onCancel={handleCancel}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AddWorkReportPage;
