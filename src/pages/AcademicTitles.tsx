
import { useState } from "react";
import { useAppStore } from "@/store";
import { AcademicTitle } from "@/types";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus, X, Check, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AcademicTitlesPage = () => {
  const { academicTitles, addAcademicTitle, updateAcademicTitle, deleteAcademicTitle } = useAppStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAcademicTitle, setSelectedAcademicTitle] = useState<AcademicTitle | null>(null);
  
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newShortName, setNewShortName] = useState("");
  
  const [editCode, setEditCode] = useState("");
  const [editName, setEditName] = useState("");
  const [editShortName, setEditShortName] = useState("");
  
  const handleAdd = () => {
    if (newCode.trim() === "" || newName.trim() === "" || newShortName.trim() === "") {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    
    addAcademicTitle({
      code: newCode,
      name: newName,
      shortName: newShortName
    });
    
    setNewCode("");
    setNewName("");
    setNewShortName("");
    setIsAddDialogOpen(false);
  };
  
  const openEditDialog = (academicTitle: AcademicTitle) => {
    setSelectedAcademicTitle(academicTitle);
    setEditCode(academicTitle.code);
    setEditName(academicTitle.name);
    setEditShortName(academicTitle.shortName);
    setIsEditDialogOpen(true);
  };
  
  const handleEdit = () => {
    if (!selectedAcademicTitle) return;
    
    if (editCode.trim() === "" || editName.trim() === "" || editShortName.trim() === "") {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    
    updateAcademicTitle(selectedAcademicTitle.id, {
      code: editCode,
      name: editName,
      shortName: editShortName
    });
    
    setIsEditDialogOpen(false);
  };
  
  const openDeleteDialog = (academicTitle: AcademicTitle) => {
    setSelectedAcademicTitle(academicTitle);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    if (!selectedAcademicTitle) return;
    deleteAcademicTitle(selectedAcademicTitle.id);
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý học hàm</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" /> Thêm mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm học hàm</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mã học hàm</label>
                <Input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Nhập mã học hàm..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên học hàm</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nhập tên học hàm..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên viết tắt</label>
                <Input
                  value={newShortName}
                  onChange={(e) => setNewShortName(e.target.value)}
                  placeholder="Nhập tên viết tắt..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
              <Button onClick={handleAdd}>
                <Check className="h-4 w-4 mr-2" /> Lưu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left font-medium">STT</th>
              <th className="p-3 text-left font-medium">Mã học hàm</th>
              <th className="p-3 text-left font-medium">Tên học hàm</th>
              <th className="p-3 text-left font-medium">Tên viết tắt</th>
              <th className="p-3 text-center font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {academicTitles.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-3 text-center text-muted-foreground">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              academicTitles.map((academicTitle, index) => (
                <tr key={academicTitle.id} className={cn("border-t", index % 2 === 1 ? "bg-muted/30" : "")}>
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{academicTitle.code}</td>
                  <td className="p-3">{academicTitle.name}</td>
                  <td className="p-3">{academicTitle.shortName}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(academicTitle)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(academicTitle)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa học hàm</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mã học hàm</label>
              <Input
                value={editCode}
                onChange={(e) => setEditCode(e.target.value)}
                placeholder="Nhập mã học hàm..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên học hàm</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nhập tên học hàm..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên viết tắt</label>
              <Input
                value={editShortName}
                onChange={(e) => setEditShortName(e.target.value)}
                placeholder="Nhập tên viết tắt..."
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button onClick={handleEdit}>
              <Check className="h-4 w-4 mr-2" /> Lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Bạn có chắc chắn muốn xóa học hàm này không?</p>
            <p className="font-medium mt-2">
              {selectedAcademicTitle && selectedAcademicTitle.name}
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AcademicTitlesPage;
