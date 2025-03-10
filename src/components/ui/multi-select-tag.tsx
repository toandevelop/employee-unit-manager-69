
import React, { useState, useRef, useEffect } from 'react';
import { X, Tag, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Item {
  id: string;
  name: string;
  code?: string;
}

interface MultiSelectTagProps {
  label: string;
  items: Item[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}

export const MultiSelectTag = ({
  label,
  items,
  selectedIds,
  onChange,
  placeholder = "Chọn mục...",
  searchPlaceholder = "Tìm kiếm..."
}: MultiSelectTagProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Filter items based on search query
  const filteredItems = searchQuery 
    ? items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.code?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;
    
  // Get selected items for display
  const selectedItems = items.filter(item => selectedIds.includes(item.id));
  
  // Handle selecting/deselecting an item
  const handleToggleItem = (itemId: string) => {
    if (selectedIds.includes(itemId)) {
      onChange(selectedIds.filter(id => id !== itemId));
    } else {
      onChange([...selectedIds, itemId]);
    }
  };
  
  // Handle removing a tag
  const handleRemoveTag = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedIds.filter(id => id !== itemId));
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label>{label}</Label>
      
      <div 
        className={`relative border rounded-md transition-all ${isOpen ? 'ring-2 ring-ring ring-offset-2' : 'hover:border-input'}`}
      >
        {/* Selected Tags Display */}
        <div 
          className="min-h-10 p-1 flex flex-wrap gap-1 cursor-text"
          onClick={() => setIsOpen(true)}
        >
          {selectedItems.length > 0 ? (
            selectedItems.map(item => (
              <Badge 
                key={item.id} 
                variant="secondary" 
                className="flex items-center gap-1 py-1 pl-2 pr-1 bg-secondary/80"
              >
                <Tag className="h-3 w-3 opacity-70" />
                <span>{item.name}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveTag(item.id, e)}
                  className="rounded-full hover:bg-secondary-foreground/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <div className="px-2 py-2 text-muted-foreground">{placeholder}</div>
          )}
        </div>
        
        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md animate-in fade-in-0 zoom-in-95 p-1">
            <div className="sticky top-0 bg-popover z-10 mb-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="max-h-48 overflow-y-auto">
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-1">
                  {filteredItems.map(item => (
                    <div
                      key={item.id}
                      className={`flex items-center px-2 py-1.5 rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                        selectedIds.includes(item.id) ? 'bg-accent/50' : ''
                      }`}
                      onClick={() => handleToggleItem(item.id)}
                    >
                      <div className="flex-1">
                        {item.name}
                        {item.code && <span className="text-xs text-muted-foreground ml-1">({item.code})</span>}
                      </div>
                      {selectedIds.includes(item.id) && (
                        <X className="h-4 w-4 opacity-70" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2 text-muted-foreground">
                  Không tìm thấy kết quả phù hợp
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
