
import { useState } from "react";
import { useAppStore } from "@/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format, parseISO } from "date-fns";

export function RawDataTable() {
  const { rawTimeData, markDataProcessed } = useAppStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Sort by timestamp in descending order
  const sortedData = [...rawTimeData].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Show only first 100 records for performance
  const displayData = sortedData.slice(0, 100);
  
  const handleSelectAll = () => {
    if (selectedIds.length === displayData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayData.map(item => item.id));
    }
  };
  
  const handleSelectItem = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };
  
  const handleProcessSelected = () => {
    if (selectedIds.length > 0) {
      markDataProcessed(selectedIds);
      setSelectedIds([]);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Hiển thị {displayData.length} trên tổng số {rawTimeData.length} bản ghi
        </p>
        <Button 
          onClick={handleProcessSelected}
          disabled={selectedIds.length === 0}
          variant="outline"
          size="sm"
        >
          Xử lý {selectedIds.length} bản ghi đã chọn
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox 
                  checked={selectedIds.length === displayData.length && displayData.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Mã nhân viên</TableHead>
              <TableHead>Thiết bị</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Hướng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Đồng bộ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => handleSelectItem(item.id)}
                  />
                </TableCell>
                <TableCell>{item.employeeCode}</TableCell>
                <TableCell>{item.deviceId.substring(0, 8)}...</TableCell>
                <TableCell>
                  {format(parseISO(item.timestamp), 'dd/MM/yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  {item.direction === 'in' ? 'Vào' : 'Ra'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.processed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.processed ? 'Đã xử lý' : 'Chưa xử lý'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.synced
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.synced ? 'Đã đồng bộ' : 'Chưa đồng bộ'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
