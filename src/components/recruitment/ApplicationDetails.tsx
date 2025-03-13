import { useState } from 'react';
import { useAppStore } from '@/store';
import { JobApplication } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, LinkIcon, FileText, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import InterviewForm from './InterviewForm';
import StatusBadge from './StatusBadge';

interface ApplicationDetailsProps {
  application: JobApplication;
  onClose: () => void;
}

const ApplicationDetails = ({ application, onClose }: ApplicationDetailsProps) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isAddInterviewOpen, setIsAddInterviewOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<string | null>(null);
  
  const jobPostings = useAppStore((state) => state.jobPostings);
  const interviews = useAppStore((state) => 
    state.interviews.filter(interview => interview.applicationId === application.id)
  );
  const updateJobApplication = useAppStore((state) => state.updateJobApplication);
  const deleteInterview = useAppStore((state) => state.deleteInterview);
  
  const jobPosting = jobPostings.find(jp => jp.id === application.jobPostingId);
  
  const handleStatusChange = (status: string) => {
    updateJobApplication(application.id, { status });
  };
  
  const editingInterviewData = editingInterview
    ? interviews.find(interview => interview.id === editingInterview)
    : null;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{application.fullName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500">{jobPosting?.title || 'Vị trí không xác định'}</p>
            <StatusBadge status={application.status} type="application" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select 
            value={application.status} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Cập nhật trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Mới</SelectItem>
              <SelectItem value="reviewing">Đang xem xét</SelectItem>
              <SelectItem value="interview">Phỏng vấn</SelectItem>
              <SelectItem value="offered">Đã đề xuất</SelectItem>
              <SelectItem value="hired">Đã tuyển</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Thông tin ứng viên</TabsTrigger>
          <TabsTrigger value="interviews">Lịch phỏng vấn</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Thông tin liên hệ</h4>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Email:</span> {application.email}</p>
                  <p><span className="font-medium">Điện thoại:</span> {application.phone}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Thông tin ứng tuyển</h4>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Ngày nộp hồ sơ:</span> {new Date(application.applicationDate).toLocaleDateString('vi-VN')}</p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Hồ sơ:</span> 
                    {application.resumeUrl && (
                      <a 
                        href={application.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <LinkIcon className="h-3 w-3" />
                        Xem hồ sơ
                      </a>
                    )}
                  </p>
                </div>
              </div>
              
              {application.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Ghi chú</h4>
                  <p className="mt-2 text-sm whitespace-pre-line">{application.notes}</p>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Thư ngỏ</h4>
              {application.coverLetter ? (
                <p className="mt-2 text-sm whitespace-pre-line">{application.coverLetter}</p>
              ) : (
                <p className="mt-2 text-sm text-gray-400 italic">Không có thư ngỏ</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="interviews" className="space-y-4 pt-4">
          <div className="flex justify-between">
            <h4 className="text-sm font-medium">Lịch phỏng vấn</h4>
            <Dialog open={isAddInterviewOpen} onOpenChange={setIsAddInterviewOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Lên lịch phỏng vấn
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Lên lịch phỏng vấn mới</DialogTitle>
                </DialogHeader>
                <InterviewForm 
                  applicationId={application.id} 
                  onSuccess={() => setIsAddInterviewOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>
          
          {interviews.length > 0 ? (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div 
                  key={interview.id}
                  className="border rounded-lg p-4 relative"
                >
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Dialog open={editingInterview === interview.id} onOpenChange={(open) => {
                      if (!open) setEditingInterview(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" onClick={() => setEditingInterview(interview.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Chỉnh sửa lịch phỏng vấn</DialogTitle>
                        </DialogHeader>
                        {editingInterviewData && (
                          <InterviewForm 
                            applicationId={application.id}
                            interview={editingInterviewData}
                            onSuccess={() => setEditingInterview(null)} 
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => deleteInterview(interview.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium">{interview.interviewType === 'phone' ? 'Phỏng vấn điện thoại' : interview.interviewType === 'online' ? 'Phỏng vấn trực tuyến' : 'Phỏng vấn trực tiếp'}</h5>
                      <StatusBadge status={interview.status} type="interview" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Ngày: {new Date(interview.interviewDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Giờ: {interview.interviewTime}</span>
                      </div>
                      
                      {interview.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{interview.location}</span>
                        </div>
                      )}
                      
                      {interview.meetingLink && (
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-gray-500" />
                          <a 
                            href={interview.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Link phỏng vấn
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="font-medium">Người phỏng vấn:</span>
                          <div className="mt-1">
                            {interview.interviewers.map((interviewer, index) => (
                              <div key={index}>{interviewer}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {interview.notes && (
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <span className="font-medium">Ghi chú:</span>
                            <p className="mt-1 text-sm whitespace-pre-line">{interview.notes}</p>
                          </div>
                        </div>
                      )}
                      
                      {interview.feedback && (
                        <div className="mt-3 pt-3 border-t">
                          <span className="font-medium">Đánh giá:</span>
                          <p className="mt-1 text-sm whitespace-pre-line">{interview.feedback}</p>
                          {interview.rating && (
                            <div className="mt-1 flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-${i < interview.rating! ? 'yellow' : 'gray'}-400`}>★</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Chưa có lịch phỏng vấn nào được lên. Hãy tạo lịch phỏng vấn mới.
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end pt-4">
        <Button variant="outline" onClick={onClose}>Đóng</Button>
      </div>
    </div>
  );
};

export default ApplicationDetails;
