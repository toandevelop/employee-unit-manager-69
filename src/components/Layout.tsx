
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Users, Building2, Briefcase, FileText, FileType, Menu, X, ChevronDown, ChevronRight, LayoutDashboard, GraduationCap, BookOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface NavigationCategory {
  label: string;
  icon: React.ReactNode;
  items: NavigationItem[];
}

const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['dash']);
  const location = useLocation();
  
  // Close mobile menu on location change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleCategory = (categoryLabel: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryLabel)
        ? prev.filter(item => item !== categoryLabel)
        : [...prev, categoryLabel]
    );
  };

  const mainItems: NavigationItem[] = [
    { path: '/', label: 'Tổng quan', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/employees', label: 'Quản lý nhân viên', icon: <Users className="h-5 w-5" /> },
    { path: '/contracts', label: 'Quản lý hợp đồng', icon: <FileText className="h-5 w-5" /> },
  ];
  
  const categories: NavigationCategory[] = [
    {
      label: 'Danh mục',
      icon: <LayoutDashboard className="h-5 w-5" />,
      items: [
        { path: '/departments', label: 'Quản lý đơn vị', icon: <Building2 className="h-5 w-5" /> },
        { path: '/positions', label: 'Quản lý chức vụ', icon: <Briefcase className="h-5 w-5" /> },
        { path: '/contract-types', label: 'Quản lý loại hợp đồng', icon: <FileType className="h-5 w-5" /> },
        { path: '/academic-degrees', label: 'Quản lý học vị', icon: <GraduationCap className="h-5 w-5" /> },
        { path: '/academic-titles', label: 'Quản lý học hàm', icon: <BookOpen className="h-5 w-5" /> },
      ]
    }
  ];
  
  const isCategoryActive = (category: NavigationCategory) => {
    return category.items.some(item => location.pathname === item.path);
  };
  
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-64 flex-col bg-white border-r shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary">Quản lý nhân sự</h1>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-4">
            {/* Main navigation items */}
            {mainItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-secondary transition-all-200",
                    location.pathname === item.path ? "bg-primary text-white hover:bg-primary/90" : ""
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            
            {/* Categories with sub-items */}
            {categories.map((category) => (
              <li key={category.label} className="mt-6">
                <button
                  onClick={() => toggleCategory(category.label)}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-2 text-left rounded-lg",
                    isCategoryActive(category) ? "text-primary font-medium" : "text-gray-700",
                    "hover:bg-gray-100 transition-colors"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {category.icon}
                    <span className="font-medium">{category.label}</span>
                  </div>
                  {expandedCategories.includes(category.label) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {expandedCategories.includes(category.label) && (
                  <ul className="mt-2 ml-4 space-y-1">
                    {category.items.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center gap-3 pl-6 pr-4 py-2 rounded-lg text-gray-700 hover:bg-secondary transition-all-200",
                            location.pathname === item.path ? "bg-primary text-white hover:bg-primary/90" : ""
                          )}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold text-primary">Quản lý nhân sự</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="absolute top-16 left-0 right-0 bg-white h-auto shadow-lg"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="py-2">
                {/* Main navigation items */}
                {mainItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-gray-100 transition-all-200",
                        location.pathname === item.path ? "bg-primary/10 text-primary" : ""
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
                
                {/* Categories with sub-items */}
                {categories.map((category) => (
                  <li key={category.label} className="mt-2">
                    <button
                      onClick={() => toggleCategory(category.label)}
                      className={cn(
                        "flex items-center justify-between w-full px-6 py-3 text-left",
                        isCategoryActive(category) ? "text-primary font-medium" : "text-gray-700",
                        "hover:bg-gray-100 transition-colors"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {category.icon}
                        <span className="font-medium">{category.label}</span>
                      </div>
                      {expandedCategories.includes(category.label) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {expandedCategories.includes(category.label) && (
                      <ul className="border-l-2 border-gray-100 ml-10 pl-2">
                        {category.items.map((item) => (
                          <li key={item.path}>
                            <Link
                              to={item.path}
                              className={cn(
                                "flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-all-200",
                                location.pathname === item.path ? "bg-primary/10 text-primary" : ""
                              )}
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 pt-16 md:pt-0">
        <div className="container mx-auto py-6 px-4 md:px-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
