
import { useState } from 'react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Eye, Trash2 } from 'lucide-react';
import ApplicationForm from './ApplicationForm';
import ApplicationDetails from './ApplicationDetails';
import { Card, CardContent } from '@/components/ui/card';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'new':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Mới</Badge>;
    case 'reviewing':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Đang xem xét</Badge>;
    case 'interview':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Phỏng vấn</Badge>;
    case 'offered':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đã đề xuất</Badge>;
    case 'hired':
      return <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">Đã tuyển</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Từ chối</Badge>;
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

const ApplicationsList = () => {
  const jobApplications = useAppStore((state) => state.jobApplications);
  const jobPostings = useAppStore((state) => state.jobPostings);
  const deleteJobApplication = useAppStore((state) => state.deleteJobApplication);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewingApplication, setViewingApplication] = useState<string | null>(null);
  
  const getJobTitle = (jobPostingId: string) => {
    const posting = jobPostings.find(p => p.id === jobPostingId);
    return posting ? posting.title : 'Vị trí không xác định';
  };
  
  const viewingApplicationData = viewingApplication 
    ? jobApplications.find(app => app.id === viewingApplication) 
    : null;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Danh sách hồ sơ ứng viên</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Thêm hồ sơ mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Thêm hồ sơ ứng viên mới</DialogTitle>
            </DialogHeader>
            <ApplicationForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ứng viên</TableHead>
                <TableHead>Vị trí ứng tuyển</TableHead>
                <TableHead>Ngày ứng tuyển</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    <div>{application.fullName}</div>
                    <div className="text-sm text-gray-500">{application.email}</div>
                  </TableCell>
                  <TableCell>{getJobTitle(application.jobPostingId)}</TableCell>
                  <TableCell>{new Date(application.applicationDate).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog open={viewingApplication === application.id} onOpenChange={(open) => {
                        if (!open) setViewingApplication(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setViewingApplication(application.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết hồ sơ ứng viên</DialogTitle>
                          </DialogHeader>
                          {viewingApplicationData && (
                            <ApplicationDetails 
                              application={viewingApplicationData} 
                              onClose={() => setViewingApplication(null)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteJobApplication(application.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {jobApplications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Chưa có hồ sơ ứng viên nào. Hãy thêm hồ sơ ứng viên mới.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsList;
