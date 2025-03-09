
import { useAppStore } from '@/store';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormValues } from './types';
import { BookOpen, Award } from 'lucide-react';

interface AcademicInfoFieldsetProps {
  formData: EmployeeFormValues;
  handleInputChange: (field: string, value: string) => void;
}

export const AcademicInfoFieldset = ({ formData, handleInputChange }: AcademicInfoFieldsetProps) => {
  const { academicDegrees, academicTitles } = useAppStore();

  return (
    <div className="space-y-6 p-2 mt-6">
      <h3 className="text-lg font-medium border-b pb-2 mb-4">Thông tin học thuật</h3>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="academicDegree" className="text-sm font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>Học vị</span>
          </Label>
          <Select
            value={formData.academicDegreeId || ""}
            onValueChange={(value) => handleInputChange('academicDegreeId', value)}
          >
            <SelectTrigger id="academicDegree" className="border-input/60 focus:border-primary">
              <SelectValue placeholder="Chọn học vị" />
            </SelectTrigger>
            <SelectContent searchable items={academicDegrees}>
              {academicDegrees.map((degree) => (
                <SelectItem key={degree.id} value={degree.id}>
                  {degree.shortName} - {degree.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="academicTitle" className="text-sm font-medium flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span>Học hàm</span>
          </Label>
          <Select
            value={formData.academicTitleId || "none"}
            onValueChange={(value) => handleInputChange('academicTitleId', value === "none" ? undefined : value)}
          >
            <SelectTrigger id="academicTitle" className="border-input/60 focus:border-primary">
              <SelectValue placeholder="Chọn học hàm (nếu có)" />
            </SelectTrigger>
            <SelectContent searchable items={academicTitles}>
              <SelectItem value="none">Không có học hàm</SelectItem>
              {academicTitles.map((title) => (
                <SelectItem key={title.id} value={title.id}>
                  {title.shortName} - {title.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
