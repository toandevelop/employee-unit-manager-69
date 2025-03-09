
import { useAppStore } from '@/store';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeFormValues } from './types';

interface AcademicInfoFieldsetProps {
  formData: EmployeeFormValues;
  handleInputChange: (field: string, value: string) => void;
}

export const AcademicInfoFieldset = ({ formData, handleInputChange }: AcademicInfoFieldsetProps) => {
  const { academicDegrees, academicTitles } = useAppStore();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="academicDegree">Học vị</Label>
        <Select
          value={formData.academicDegreeId || ""}
          onValueChange={(value) => handleInputChange('academicDegreeId', value)}
        >
          <SelectTrigger id="academicDegree">
            <SelectValue placeholder="Chọn học vị" />
          </SelectTrigger>
          <SelectContent>
            {academicDegrees.map((degree) => (
              <SelectItem key={degree.id} value={degree.id}>
                {degree.shortName} - {degree.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="academicTitle">Học hàm</Label>
        <Select
          value={formData.academicTitleId || "none"}
          onValueChange={(value) => handleInputChange('academicTitleId', value === "none" ? undefined : value)}
        >
          <SelectTrigger id="academicTitle">
            <SelectValue placeholder="Chọn học hàm (nếu có)" />
          </SelectTrigger>
          <SelectContent>
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
  );
};
