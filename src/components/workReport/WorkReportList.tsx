
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { format, parseISO } from 'date-fns';
import { 
  CheckCircle, 
  Clock, 
  Edit, 
  Eye, 
  FileText, 
  Send, 
  Trash2, 
  XCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEmployeeHelpers } from '@/hooks/useEmployeeHelpers';
import { WorkReport } from '@/store/slices/workReportSlice';

const getStatusBadge = (status: WorkReport['status']) => {
  switch (status) {
    case 'draft':
      return <Badge variant="outline" className="bg-muted"><Clock className="h-3 w-3 mr-1" /> Nháp</Badge>;
    case 'submitted':
      return <Badge variant="secondary"><Send className="h-3 w-3 mr-1" /> Đã nộp</Badge>;
    case 'approved':
      return <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle className="h-3 w-3 mr-1" /> Đã duyệt</Badge>;
    case 'rejected':
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Từ chối</Badge>;
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy');
  } catch (error) {
    return dateString;
  }
};

export default function WorkReportList() {
  const navigate = useNavigate();
  const { workReports, employees, deleteWorkReport, submitWorkReport } = useAppStore();
  const { getEmployeeDepartments } = useEmployeeHelpers();
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Unknown Employee';
  };

  const handleViewDetails = (reportId: string) => {
    setExpandedReportId(expandedReportId === reportId ? null : reportId);
  };

  const handleDelete = (reportId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa báo cáo này?')) {
      deleteWorkReport(reportId);
    }
  };

  const handleSubmit = (reportId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn nộp báo cáo này?')) {
      submitWorkReport(reportId);
    }
  };

  if (workReports.length === 0) {
    return (
      <div className="text-center p-8">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">Chưa có báo cáo công việc nào</h3>
        <p className="text-muted-foreground mt-1">Tạo báo cáo công việc hàng tuần mới để theo dõi và quản lý công việc.</p>
        <Button 
          className="mt-4" 
          onClick={() => navigate('/work-reports/add')}
        >
          Tạo báo cáo mới
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workReports.sort((a, b) => {
        // Sort by date, newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }).map((report) => (
        <Card key={report.id} className="overflow-hidden">
          <div className="bg-muted p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  Báo cáo tuần: {formatDate(report.weekStartDate)} - {formatDate(report.weekEndDate)}
                </span>
                {getStatusBadge(report.status)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Nhân viên: {getEmployeeName(report.employeeId)}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleViewDetails(report.id)}
              >
                {expandedReportId === report.id ? 'Ẩn' : 'Xem'}
                <Eye className="ml-1 h-4 w-4" />
              </Button>
              
              {report.status === 'draft' && (
                <>
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => handleSubmit(report.id)}
                  >
                    Nộp
                    <Send className="ml-1 h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/work-reports/edit/${report.id}`)}
                  >
                    Sửa
                    <Edit className="ml-1 h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDelete(report.id)}
                  >
                    Xóa
                    <Trash2 className="ml-1 h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {expandedReportId === report.id && (
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="font-medium">Công việc đã hoàn thành</h3>
                  <p className="whitespace-pre-wrap">{report.tasksCompleted}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Công việc đang thực hiện</h3>
                  <p className="whitespace-pre-wrap">{report.tasksInProgress}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Kế hoạch tuần tới</h3>
                  <p className="whitespace-pre-wrap">{report.nextWeekPlans}</p>
                </div>
                
                {report.issues && (
                  <div>
                    <h3 className="font-medium">Vấn đề gặp phải</h3>
                    <p className="whitespace-pre-wrap">{report.issues}</p>
                  </div>
                )}
                
                {report.status === 'rejected' && report.rejectedReason && (
                  <div>
                    <h3 className="font-medium text-destructive">Lý do từ chối</h3>
                    <p className="whitespace-pre-wrap">{report.rejectedReason}</p>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground">
                  <p>Ngày tạo: {formatDate(report.createdAt)}</p>
                  {report.submittedDate && <p>Ngày nộp: {formatDate(report.submittedDate)}</p>}
                  {report.approvedDate && <p>Ngày duyệt: {formatDate(report.approvedDate)}</p>}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
