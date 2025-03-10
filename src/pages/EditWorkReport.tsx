
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '@/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import WorkReportForm, { WorkReportFormValues } from '@/components/workReport/WorkReportForm';

const EditWorkReportPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Get data and functions from the store
  const { workReports, updateWorkReport, submitWorkReport } = useAppStore();
  
  // Find the work report to edit
  const workReport = workReports.find(report => report.id === id);
  
  // Handle updating the work report
  const handleUpdateWorkReport = (formData: WorkReportFormValues, isDraft: boolean) => {
    if (!id) {
      toast.error("Không tìm thấy báo cáo để cập nhật");
      return;
    }
    
    console.log("Updating work report with data:", formData);
    
    // Update the work report in the store
    updateWorkReport(id, formData);
    
    // If not a draft, submit immediately
    if (!isDraft) {
      submitWorkReport(id);
    }
    
    toast.success(isDraft ? "Cập nhật báo cáo nháp thành công" : "Nộp báo cáo công việc thành công");
    navigate('/work-reports');
  };
  
  const handleCancel = () => {
    navigate('/work-reports');
  };
  
  // If work report is not found
  if (!workReport) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">Không tìm thấy báo cáo</h3>
        <p className="text-muted-foreground mt-1">Báo cáo bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Button 
          className="mt-4" 
          onClick={() => navigate('/work-reports')}
        >
          Quay lại danh sách báo cáo
        </Button>
      </div>
    );
  }
  
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
            <Edit className="h-8 w-8 text-primary" />
            <span>Chỉnh sửa báo cáo công việc</span>
          </h1>
          <p className="text-muted-foreground mt-1">Cập nhật thông tin báo cáo công việc hàng tuần</p>
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
              workReport={workReport}
              onSubmit={handleUpdateWorkReport}
              onCancel={handleCancel}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EditWorkReportPage;
