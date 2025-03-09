
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EmployeeSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const EmployeeSearch = ({ searchQuery, setSearchQuery }: EmployeeSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Tìm kiếm nhân viên theo mã hoặc tên..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default EmployeeSearch;
