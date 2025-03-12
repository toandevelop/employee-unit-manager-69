
import { useState } from 'react';
import { useAppStore } from '@/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Mail, 
  Phone, 
  Link, 
  FileText, 
  ExternalLink,
  Clock,
  User,
  MapPin,
  MessageSquare,
  Star,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApplicationForm from './ApplicationForm';
import InterviewForm from './InterviewForm';

interface ApplicationDetailsProps {
  applicationId: string;
  onClose: () => void;
}

const ApplicationDetails = ({ applicationId, onClose }: ApplicationDetailsProps) => {
  const { 
    jobApplications, 
    jobPostings, 
    interviews, 
    updateJobApplication, 
    deleteJobApplication,
    deleteInterview
  } = useAppStore();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddInterviewMode, setIsAddInterviewMode] = useState(false);
  const [currentInterviewId, setCurrentInterviewId] = useState<string | null>(null);
  
  // Get the application details
  const application = jobApplications.find(app => app.id === applicationId);
  
  // Get the job posting details
  const jobPosting = application 
    ? jobPostings.find(jp => jp.id === application.jobPostingId) 
    : null;
  
  // Get interviews for this application
  const applicationInterviews = interviews.filter(
    interview => interview.applicationId === applicationId
  );
  
  if (!application) {
    return <div>Không tìm thấy hồ sơ ứng viên.</div>;
  }
  
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
  
  const getInterviewStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const getInterviewStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Đã lên lịch';
      case 'completed':
        return 'Đã hoàn thành';
      case 'canceled':
        return 'Đã hủy';
      default:
        return status;
    }
  };
  
  const getInterviewTypeText = (type: string) => {
    switch (type) {
      case 'phone':
        return 'Phỏng vấn qua điện thoại';
      case 'online':
        return 'Phỏng vấn trực tuyến';
      case 'in-person':
        return 'Phỏng vấn trực tiếp';
      default:
        return type;
    }
  };
  
  const handleDeleteApplication = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ ứng viên này không?')) {
      deleteJobApplication(applicationId);
      onClose();
    }
  };
  
  const handleDeleteInterview = (interviewId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch phỏng vấn này không?')) {
      deleteInterview(interviewId);
    }
  };
  
  const handleUpdateStatus = (newStatus: 'new' | 'reviewing' | 'interview' | 'offered' | 'hired' | 'rejected') => {
    updateJobApplication(applicationId, { status: newStatus });
  };
  
  return (
    <>
      {isEditMode ? (
        <ApplicationForm 
          applicationId={applicationId} 
          onSuccess={() => setIsEditMode(false)} 
        />
      ) : isAddInterviewMode || currentInterviewId ? (
        <InterviewForm 
          applicationId={applicationId}
          interviewId={currentInterviewId || undefined}
          onSuccess={() => {
            setIsAddInterviewMode(false);
            setCurrentInterviewId(null);
          }} 
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{application.fullName}</h2>
                <Badge className={getStatusBadgeClass(application.status)}>
                  {getStatusText(application.status)}
                </Badge>
              </div>
              {jobPosting && (
                <p className="text-muted-foreground">Vị trí: {jobPosting.title}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditMode(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Chỉnh sửa
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive border-destructive hover:bg-destructive/10"
                onClick={handleDeleteApplication}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Xóa
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="info">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="info">Thông tin</TabsTrigger>
              <TabsTrigger value="interviews">Phỏng vấn ({applicationInterviews.length})</TabsTrigger>
              <TabsTrigger value="actions">Hành động</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Thông tin liên hệ</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{application.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{application.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Ngày nộp: {new Date(application.applicationDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {application.resumeUrl && (
                    <div>
                      <h3 className="font-medium mb-2">CV</h3>
                      <Button 
                        variant="outline" 
                        className="w-full text-center"
                        onClick={() => window.open(application.resumeUrl, '_blank')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="truncate">Xem CV</span>
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {application.coverLetter && (
                    <div>
                      <h3 className="font-medium mb-2">Thư xin việc</h3>
                      <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                        {application.coverLetter}
                      </div>
                    </div>
                  )}
                  
                  {application.notes && (
                    <div>
                      <h3 className="font-medium mb-2">Ghi chú</h3>
                      <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
                        {application.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              {jobPosting && (
                <div className="space-y-4">
                  <h3 className="font-medium">Thông tin vị trí tuyển dụng</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium">{jobPosting.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{jobPosting.description}</p>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Mức lương:</span> {jobPosting.salary}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Trạng thái:</span> {jobPosting.status === 'open' ? 'Đang mở' : jobPosting.status === 'closed' ? 'Đã đóng' : 'Bản nháp'}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ngày mở:</span> {new Date(jobPosting.openDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ngày đóng:</span> {new Date(jobPosting.closeDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="interviews" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Lịch phỏng vấn</h3>
                <Button 
                  onClick={() => setIsAddInterviewMode(true)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> 
                  Thêm lịch phỏng vấn
                </Button>
              </div>
              
              {applicationInterviews.length === 0 ? (
                <div className="text-center py-8 bg-muted rounded-md">
                  <p className="text-muted-foreground">Chưa có lịch phỏng vấn nào được lên lịch.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applicationInterviews.map((interview) => (
                    <div key={interview.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Badge className={getInterviewStatusBadgeClass(interview.status)}>
                            {getInterviewStatusText(interview.status)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {getInterviewTypeText(interview.interviewType)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setCurrentInterviewId(interview.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteInterview(interview.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{new Date(interview.interviewDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{interview.interviewTime}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {interview.interviewers.join(', ')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {interview.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{interview.location}</span>
                            </div>
                          )}
                          
                          {interview.meetingLink && (
                            <div className="flex items-center">
                              <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                              <a 
                                href={interview.meetingLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Link phỏng vấn
                              </a>
                            </div>
                          )}
                          
                          {interview.rating && (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>Đánh giá: {interview.rating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {(interview.notes || interview.feedback) && (
                        <div className="mt-3 pt-3 border-t">
                          {interview.notes && (
                            <div className="mb-2">
                              <div className="flex items-center mb-1">
                                <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="text-sm font-medium">Ghi chú:</span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap pl-5">{interview.notes}</p>
                            </div>
                          )}
                          
                          {interview.feedback && (
                            <div>
                              <div className="flex items-center mb-1">
                                <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="text-sm font-medium">Đánh giá:</span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap pl-5">{interview.feedback}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-4 pt-4">
              <h3 className="font-medium">Chuyển trạng thái</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  className={application.status === 'new' ? 'border-blue-500 bg-blue-50' : ''}
                  onClick={() => handleUpdateStatus('new')}
                >
                  Mới
                </Button>
                <Button 
                  variant="outline"
                  className={application.status === 'reviewing' ? 'border-purple-500 bg-purple-50' : ''}
                  onClick={() => handleUpdateStatus('reviewing')}
                >
                  Đang xem xét
                </Button>
                <Button 
                  variant="outline"
                  className={application.status === 'interview' ? 'border-amber-500 bg-amber-50' : ''}
                  onClick={() => handleUpdateStatus('interview')}
                >
                  Phỏng vấn
                </Button>
                <Button 
                  variant="outline"
                  className={application.status === 'offered' ? 'border-green-500 bg-green-50' : ''}
                  onClick={() => handleUpdateStatus('offered')}
                >
                  Đã offer
                </Button>
                <Button 
                  variant="outline"
                  className={application.status === 'hired' ? 'border-emerald-500 bg-emerald-50' : ''}
                  onClick={() => handleUpdateStatus('hired')}
                >
                  Đã tuyển
                </Button>
                <Button 
                  variant="outline"
                  className={application.status === 'rejected' ? 'border-red-500 bg-red-50' : ''}
                  onClick={() => handleUpdateStatus('rejected')}
                >
                  Từ chối
                </Button>
              </div>
              
              <div className="pt-4 border-t mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsAddInterviewMode(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Lên lịch phỏng vấn
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default ApplicationDetails;
