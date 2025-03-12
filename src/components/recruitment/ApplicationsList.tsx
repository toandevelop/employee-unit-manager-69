
import { useState } from 'react';
import { 
  Calendar, 
  Mail, 
  Phone, 
  FileText, 
  ArrowUpRight, 
  Search,
  Plus
} from 'lucide-react';
import { useAppStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ApplicationForm from './ApplicationForm';
import ApplicationDetails from './ApplicationDetails';

export const ApplicationsList = () => {
  const { jobApplications, jobPostings } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedPostingId, setSelectedPostingId] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentApplication, setCurrentApplication] = useState<string | null>(null);

  // Filter applications based on search, status and job posting
  const filteredApplications = jobApplications.filter(application => {
    const matchesSearch = 
      application.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (selectedTab === 'all' ? true : application.status === statusFilter);
    
    const matchesPosting = 
      selectedPostingId === 'all' || 
      application.jobPostingId === selectedPostingId;
    
    return matchesSearch && matchesStatus && matchesPosting;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'reviewing':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'interview':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'offered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'hired':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Mới';
      case 'reviewing':
        return 'Đang xem xét';
      case 'interview':
        return 'Phỏng vấn';
      case 'offered':
        return 'Đã offer';
      case 'hired':
        return 'Đã tuyển';
      case 'rejected':
        return 'Từ chối';
      default:
        return status;
    }
  };

  const getJobTitle = (jobPostingId: string) => {
    const posting = jobPostings.find(p => p.id === jobPostingId);
    return posting ? posting.title : 'N/A';
  };

  const handleViewApplication = (id: string) => {
    setCurrentApplication(id);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm ứng viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <Select 
            value={selectedPostingId} 
            onValueChange={setSelectedPostingId}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Vị trí tuyển dụng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vị trí</SelectItem>
              {jobPostings.map((posting) => (
                <SelectItem key={posting.id} value={posting.id}>
                  {posting.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" />
                Thêm ứng viên
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Thêm hồ sơ ứng viên mới</DialogTitle>
              </DialogHeader>
              <ApplicationForm 
                onSuccess={() => setIsAddDialogOpen(false)}
                preselectedJobPostingId={selectedPostingId !== 'all' ? selectedPostingId : undefined}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4">
          <TabsTrigger 
            value="all" 
            onClick={() => setStatusFilter('all')}
          >
            Tất cả
          </TabsTrigger>
          <TabsTrigger 
            value="new" 
            onClick={() => setStatusFilter('new')}
          >
            Mới
          </TabsTrigger>
          <TabsTrigger 
            value="reviewing" 
            onClick={() => setStatusFilter('reviewing')}
          >
            Xem xét
          </TabsTrigger>
          <TabsTrigger 
            value="interview" 
            onClick={() => setStatusFilter('interview')}
          >
            Phỏng vấn
          </TabsTrigger>
          <TabsTrigger 
            value="offered" 
            onClick={() => setStatusFilter('offered')}
          >
            Đã offer
          </TabsTrigger>
          <TabsTrigger 
            value="hired" 
            onClick={() => setStatusFilter('hired')}
          >
            Đã tuyển
          </TabsTrigger>
          <TabsTrigger 
            value="rejected" 
            onClick={() => setStatusFilter('rejected')}
          >
            Từ chối
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedTab}>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">Không có hồ sơ ứng viên nào</h3>
              <p className="text-muted-foreground mt-1">Thêm hồ sơ ứng viên mới để bắt đầu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className={getStatusBadgeClass(application.status)}>
                        {getStatusText(application.status)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2 line-clamp-1">{application.fullName}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-1">
                      {getJobTitle(application.jobPostingId)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{application.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">{application.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {new Date(application.applicationDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-1">
                    <div className="w-full flex space-x-2">
                      {application.resumeUrl && (
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => window.open(application.resumeUrl, '_blank')}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          CV
                        </Button>
                      )}
                      <Button 
                        variant="default" 
                        className="flex-1"
                        onClick={() => handleViewApplication(application.id)}
                      >
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Chi tiết
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết hồ sơ ứng viên</DialogTitle>
          </DialogHeader>
          {currentApplication && (
            <ApplicationDetails 
              applicationId={currentApplication} 
              onClose={() => setIsViewDialogOpen(false)}
            />
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsList;
