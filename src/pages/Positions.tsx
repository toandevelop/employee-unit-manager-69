
import { useState } from 'react';
import { useAppStore } from '@/store';
import { Position } from '@/types';
import { motion } from 'framer-motion';
import { Briefcase, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const PositionsPage = () => {
  const { positions, addPosition, updatePosition, deletePosition } = useAppStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [newPositionName, setNewPositionName] = useState('');

  // Handle add position
  const handleAddPosition = () => {
    if (newPositionName.trim()) {
      addPosition({ name: newPositionName.trim() });
      setNewPositionName('');
      setIsAddDialogOpen(false);
    }
  };

  // Handle edit position
  const handleEditPosition = () => {
    if (currentPosition && newPositionName.trim()) {
      updatePosition(currentPosition.id, { name: newPositionName.trim() });
      setNewPositionName('');
      setIsEditDialogOpen(false);
    }
  };

  // Handle delete position
  const handleDeletePosition = () => {
    if (currentPosition) {
      deletePosition(currentPosition.id);
      setIsDeleteDialogOpen(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (position: Position) => {
    setCurrentPosition(position);
    setNewPositionName(position.name);
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (position: Position) => {
    setCurrentPosition(position);
    setIsDeleteDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quản lý chức vụ</h1>
        <Button onClick={() => {
          setNewPositionName('');
          setIsAddDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Thêm chức vụ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            <span>Danh sách chức vụ</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Chưa có chức vụ nào. Bấm "Thêm chức vụ" để bắt đầu.
            </div>
          ) : (
            <div className="divide-y">
              {positions.map((position) => (
                <div key={position.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{position.name}</span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                      {position.positionEmployees.length} nhân viên
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(position)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(position)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Position Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm chức vụ mới</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="positionName">Tên chức vụ</Label>
            <Input
              id="positionName"
              value={newPositionName}
              onChange={(e) => setNewPositionName(e.target.value)}
              placeholder="Nhập tên chức vụ"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddPosition}>
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Position Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa chức vụ</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="editPositionName">Tên chức vụ</Label>
            <Input
              id="editPositionName"
              value={newPositionName}
              onChange={(e) => setNewPositionName(e.target.value)}
              placeholder="Nhập tên chức vụ"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditPosition}>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Position Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa chức vụ</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn có chắc chắn muốn xóa chức vụ <strong>{currentPosition?.name}</strong>?</p>
            {currentPosition && currentPosition.positionEmployees.length > 0 && (
              <p className="mt-2 text-destructive">
                Lưu ý: Chức vụ này đang có {currentPosition.positionEmployees.length} nhân viên. 
                Xóa chức vụ sẽ ảnh hưởng đến các nhân viên này.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeletePosition}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PositionsPage;
