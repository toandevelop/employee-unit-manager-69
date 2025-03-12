
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Calendar, 
  Building2, 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  Search
} from 'lucide-react';
import { useAppStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import JobPostingForm from './JobPostingForm';

export const JobPostingsList = () => {
  const { jobPostings, departments, positions, jobApplications, deleteJobPosting } = useAppStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentJobPosting, setCurrentJobPosting] = useState<string | null>(null);

  // Filter job postings based on search term
  const filteredJobPostings = jobPostings.filter(posting => 
    posting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    posting.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : 'N/A';
  };

  const getPositionName = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    return position ? position.name : 'N/A';
  };

  const getApplicationCount = (jobPostingId: string) => {
    return jobApplications.filter(app => app.jobPostingId === jobPostingId).length;
  };

  const handleViewDetails = (id: string) => {
    navigate(`/recruitment/job/${id}`);
  };

  const handleEditJobPosting = (id: string) => {
    setCurrentJobPosting(id);
    setIsEditDialogOpen(true);
  };

  const handleDeleteJobPosting = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vị trí tuyển dụng này không?')) {
      deleteJobPosting(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm vị trí tuyển dụng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Thêm vị trí mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Thêm vị trí tuyển dụng mới</DialogTitle>
            </DialogHeader>
            <JobPostingForm 
              onSuccess={() => setIsAddDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {filteredJobPostings.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">Không có vị trí tuyển dụng nào</h3>
          <p className="text-muted-foreground mt-1">Thêm vị trí tuyển dụng mới để bắt đầu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobPostings.map((posting) => (
            <Card key={posting.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className={getStatusClassName(posting.status)}>
                      {posting.status === 'open' ? 'Đang mở' : 
                       posting.status === 'closed' ? 'Đã đóng' : 
                       'Bản nháp'}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditJobPosting(posting.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteJobPosting(posting.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl mt-2">{posting.title}</CardTitle>
                <CardDescription className="mt-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 mr-1" />
                    {getDepartmentName(posting.departmentId)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Briefcase className="h-3.5 w-3.5 mr-1" />
                    {getPositionName(posting.positionId)}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground line-clamp-3">{posting.description}</p>
                <div className="mt-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(posting.openDate).toLocaleDateString()} - {new Date(posting.closeDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2 flex items-center">
                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {getApplicationCount(posting.id)} ứng viên
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-1">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleViewDetails(posting.id)}
                >
                  Xem chi tiết
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Job Posting Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa vị trí tuyển dụng</DialogTitle>
          </DialogHeader>
          {currentJobPosting && (
            <JobPostingForm 
              jobPostingId={currentJobPosting} 
              onSuccess={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobPostingsList;
