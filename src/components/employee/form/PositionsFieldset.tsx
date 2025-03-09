
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { EmployeeFormValues } from './types';

interface PositionsFieldsetProps {
  formData: EmployeeFormValues;
  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormValues>>;
}

export const PositionsFieldset = ({ formData, setFormData }: PositionsFieldsetProps) => {
  const { positions } = useAppStore();
  const [filteredPositions, setFilteredPositions] = useState(positions);
  
  // Update filtered positions when the source data changes
  useEffect(() => {
    setFilteredPositions(positions);
  }, [positions]);
  
  // Handle position search
  const handlePositionSearch = (query: string) => {
    if (!query) {
      setFilteredPositions(positions);
      return;
    }
    const filtered = positions.filter(pos => 
      pos.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPositions(filtered);
  };
  
  // Handle position checkbox change
  const handlePositionChange = (positionId: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return { ...prev, positionIds: [...prev.positionIds, positionId] };
      } else {
        return { ...prev, positionIds: prev.positionIds.filter(id => id !== positionId) };
      }
    });
  };

  return (
    <div className="space-y-2">
      <Label>Chức vụ</Label>
      <div className="grid grid-cols-2 gap-2 p-2 border rounded-md max-h-48 overflow-y-auto">
        <div className="col-span-2 mb-2">
          <Input
            placeholder="Tìm kiếm chức vụ..."
            onChange={(e) => handlePositionSearch(e.target.value)}
            className="w-full"
          />
        </div>
        {filteredPositions.map((position) => (
          <div className="flex items-center space-x-2" key={position.id}>
            <Checkbox
              id={`position-${position.id}`}
              checked={formData.positionIds.includes(position.id)}
              onCheckedChange={(checked) => 
                handlePositionChange(position.id, checked as boolean)
              }
            />
            <Label htmlFor={`position-${position.id}`} className="font-normal">
              {position.name}
            </Label>
          </div>
        ))}
        {filteredPositions.length === 0 && (
          <div className="col-span-2 text-center text-muted-foreground py-2">
            Không tìm thấy chức vụ phù hợp
          </div>
        )}
      </div>
    </div>
  );
};
