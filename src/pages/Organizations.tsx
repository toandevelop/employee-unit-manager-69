
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Calendar,
  Building2, 
  Briefcase,
  Pencil, 
  Trash2,
  Building,
  FolderTree
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store';
import { Department, Organization } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';

const OrganizationsPage = () => {
  const navigate = useNavigate();
  const { 
    organizations,
    departments,
    addOrganization, 
    updateOrganization, 
    deleteOrganization,
    addDepartment,
  } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOrgDialogOpen, setIsAddOrgDialogOpen] = useState(false);
  const [isEditOrgDialogOpen, setIsEditOrgDialogOpen] = useState(false);
  const [isAddDeptDialogOpen, setIsAddDeptDialogOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  
  const [orgFormData, setOrgFormData] = useState<{
    code: string;
    name: string;
    foundingDate: string;
    description: string;
  }>({
    code: '',
    name: '',
    foundingDate: '',
    description: '',
  });
  
  const [deptFormData, setDeptFormData] = useState<{
    code: string;
    name: string;
    foundingDate: string;
    organizationId: string;
  }>({
    code: '',
    name: '',
    foundingDate: '',
    organizationId: '',
  });
  
  const resetOrgForm = () => {
    setOrgFormData({
      code: '',
      name: '',
      foundingDate: '',
      description: '',
    });
  };
  
  const resetDeptForm = () => {
    setDeptFormData({
      code: '',
      name: '',
      foundingDate: '',
      organizationId: '',
    });
  };
  
  const filteredOrganizations = organizations.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddOrganization = () => {
    addOrganization(orgFormData);
    setIsAddOrgDialogOpen(false);
    resetOrgForm();
  };
  
  const handleEditOrganization = () => {
    if (selectedOrgId) {
      updateOrganization(selectedOrgId, orgFormData);
      setIsEditOrgDialogOpen(false);
      setSelectedOrgId(null);
      resetOrgForm();
    }
  };
  
  const handleAddDepartment = () => {
    addDepartment(deptFormData);
    setIsAddDeptDialogOpen(false);
    resetDeptForm();
  };
  
  const handleEditClick = (org: Organization) => {
    setOrgFormData({
      code: org.code,
      name: org.name,
      foundingDate: org.foundingDate,
      description: org.description || '',
    });
    setSelectedOrgId(org.id);
    setIsEditOrgDialogOpen(true);
  };
  
  const handleAddDeptClick = (orgId: string) => {
    setDeptFormData({
      code: '',
      name: '',
      foundingDate: '',
      organizationId: orgId,
    });
    setIsAddDeptDialogOpen(true);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  // Get departments for a specific organization
  const getOrganizationDepartments = (orgId: string) => {
    return departments.filter(dept => dept.organizationId === orgId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý tổ chức</h1>
          <p className="text-muted-foreground mt-1">Quản lý thông tin các tổ chức và phòng ban trực thuộc</p>
        </div>
        
        <Dialog open={isAddOrgDialogOpen} onOpenChange={setIsAddOrgDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2 shadow-md hover:shadow-lg transition-all">
              <Plus className="h-4 w-4" />
              <span>Thêm tổ chức</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm tổ chức mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin tổ chức mới vào biểu mẫu dưới đây
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã tổ chức</Label>
                <Input
                  id="code"
                  value={orgFormData.code}
                  onChange={(e) => setOrgFormData({ ...orgFormData, code: e.target.value })}
                  placeholder="VD: NCTU"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Tên tổ chức</Label>
                <Input
                  id="name"
                  value={orgFormData.name}
                  onChange={(e) => setOrgFormData({ ...orgFormData, name: e.target.value })}
                  placeholder="VD: Trường đại học Nam Cần Thơ"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="foundingDate">Ngày thành lập</Label>
                <Input
                  id="foundingDate"
                  type="date"
                  value={orgFormData.foundingDate}
                  onChange={(e) => setOrgFormData({ ...orgFormData, foundingDate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={orgFormData.description}
                  onChange={(e) => setOrgFormData({ ...orgFormData, description: e.target.value })}
                  placeholder="Mô tả về tổ chức"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddOrgDialogOpen(false);
                resetOrgForm();
              }}>
                Hủy
              </Button>
              <Button onClick={handleAddOrganization}>Thêm tổ chức</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm tổ chức theo mã hoặc tên..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <motion.div 
        className="grid grid-cols-1 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredOrganizations.length > 0 ? filteredOrganizations.map((organization) => {
          const orgDepartments = getOrganizationDepartments(organization.id);
          
          return (
            <motion.div key={organization.id} variants={cardVariants}>
              <Card className="overflow-hidden hover:shadow-md transition-all-300">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-8 w-8 text-primary" />
                      <div>
                        <CardTitle className="font-bold text-xl">{organization.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Mã: {organization.code}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-primary"
                        onClick={() => handleEditClick(organization)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa tổ chức</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa tổ chức "{organization.name}"? Hành động này không thể hoàn tác.
                              {orgDepartments.length > 0 && (
                                <div className="mt-2 text-destructive font-medium">
                                  Lưu ý: Không thể xóa tổ chức đang có phòng ban trực thuộc.
                                </div>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deleteOrganization(organization.id)}
                              disabled={orgDepartments.length > 0}
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Ngày thành lập: {format(new Date(organization.foundingDate), 'dd/MM/yyyy')}</span>
                    </div>
                    
                    {organization.description && (
                      <div className="text-sm">
                        <span className="font-medium">Mô tả:</span>
                        <p className="mt-1 text-muted-foreground">{organization.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <FolderTree className="h-5 w-5 text-primary" />
                        <span>Phòng ban trực thuộc ({orgDepartments.length})</span>
                      </h3>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleAddDeptClick(organization.id)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Thêm phòng ban</span>
                      </Button>
                    </div>
                    
                    {orgDepartments.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mã phòng ban</TableHead>
                            <TableHead>Tên phòng ban</TableHead>
                            <TableHead>Ngày thành lập</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orgDepartments.map((dept) => (
                            <TableRow key={dept.id}>
                              <TableCell className="font-medium">{dept.code}</TableCell>
                              <TableCell>{dept.name}</TableCell>
                              <TableCell>{format(new Date(dept.foundingDate), 'dd/MM/yyyy')}</TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => navigate('/departments')} 
                                  title="Xem chi tiết"
                                >
                                  <Briefcase className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        Chưa có phòng ban nào thuộc tổ chức này
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        }) : (
          <div className="col-span-3 flex justify-center py-12">
            <div className="text-center">
              <Building className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <p className="mt-4 text-lg text-muted-foreground">Không tìm thấy tổ chức nào</p>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Edit Organization Dialog */}
      <Dialog open={isEditOrgDialogOpen} onOpenChange={setIsEditOrgDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin tổ chức</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin tổ chức trong biểu mẫu dưới đây
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Mã tổ chức</Label>
              <Input
                id="edit-code"
                value={orgFormData.code}
                onChange={(e) => setOrgFormData({ ...orgFormData, code: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên tổ chức</Label>
              <Input
                id="edit-name"
                value={orgFormData.name}
                onChange={(e) => setOrgFormData({ ...orgFormData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-foundingDate">Ngày thành lập</Label>
              <Input
                id="edit-foundingDate"
                type="date"
                value={orgFormData.foundingDate}
                onChange={(e) => setOrgFormData({ ...orgFormData, foundingDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                value={orgFormData.description}
                onChange={(e) => setOrgFormData({ ...orgFormData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditOrgDialogOpen(false);
              setSelectedOrgId(null);
              resetOrgForm();
            }}>
              Hủy
            </Button>
            <Button onClick={handleEditOrganization}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Department Dialog */}
      <Dialog open={isAddDeptDialogOpen} onOpenChange={setIsAddDeptDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm phòng ban mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin phòng ban mới vào biểu mẫu dưới đây
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dept-code">Mã phòng ban</Label>
              <Input
                id="dept-code"
                value={deptFormData.code}
                onChange={(e) => setDeptFormData({ ...deptFormData, code: e.target.value })}
                placeholder="VD: CNTT"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dept-name">Tên phòng ban</Label>
              <Input
                id="dept-name"
                value={deptFormData.name}
                onChange={(e) => setDeptFormData({ ...deptFormData, name: e.target.value })}
                placeholder="VD: Phòng Công nghệ thông tin"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dept-foundingDate">Ngày thành lập</Label>
              <Input
                id="dept-foundingDate"
                type="date"
                value={deptFormData.foundingDate}
                onChange={(e) => setDeptFormData({ ...deptFormData, foundingDate: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDeptDialogOpen(false);
              resetDeptForm();
            }}>
              Hủy
            </Button>
            <Button onClick={handleAddDepartment}>Thêm phòng ban</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationsPage;
