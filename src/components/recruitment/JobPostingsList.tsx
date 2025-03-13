
import { useState } from 'react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import JobPostingForm from './JobPostingForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const JobPostingsList = () => {
  const jobPostings = useAppStore((state) => state.jobPostings);
  const deleteJobPosting = useAppStore((state) => state.deleteJobPosting);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingJobPosting, setEditingJobPosting] = useState<string | null>(null);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500';
      case 'closed':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Danh sách vị trí tuyển dụng</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Thêm vị trí mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Thêm vị trí tuyển dụng mới</DialogTitle>
            </DialogHeader>
            <JobPostingForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobPostings.map((jobPosting) => (
          <Card key={jobPosting.id} className="overflow-hidden">
            <div className={`${getStatusColor(jobPosting.status)} h-2 w-full`}></div>
            <CardContent className="p-4 pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{jobPosting.title}</h3>
                  <Badge variant="outline" className="mt-1">
                    {jobPosting.status === 'open' ? 'Đang tuyển' : jobPosting.status === 'closed' ? 'Đã đóng' : 'Bản nháp'}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Mở menu</span>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                        <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Dialog open={editingJobPosting === jobPosting.id} onOpenChange={(open) => {
                      if (!open) setEditingJobPosting(null);
                    }}>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={() => setEditingJobPosting(jobPosting.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Chỉnh sửa</span>
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Chỉnh sửa vị trí tuyển dụng</DialogTitle>
                        </DialogHeader>
                        <JobPostingForm 
                          jobPosting={jobPosting} 
                          onSuccess={() => setEditingJobPosting(null)} 
                        />
                      </DialogContent>
                    </Dialog>
                    <DropdownMenuItem 
                      onSelect={() => deleteJobPosting(jobPosting.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Xóa</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <div>
                  <span className="font-medium">Thời hạn nộp hồ sơ: </span>
                  <span>{new Date(jobPosting.closeDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div>
                  <span className="font-medium">Mức lương: </span>
                  <span>{jobPosting.salary}</span>
                </div>
                <p className="line-clamp-2 text-gray-500 mt-2">{jobPosting.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {jobPostings.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Chưa có vị trí tuyển dụng nào. Hãy tạo vị trí tuyển dụng mới.
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPostingsList;
