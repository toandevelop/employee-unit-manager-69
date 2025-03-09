
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store';
import { Users, Building2, Briefcase, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { 
    employees, 
    departments, 
    positions,
    contracts 
  } = useAppStore();
  
  const cards = [
    {
      title: 'Nhân viên',
      count: employees.length,
      icon: <Users className="h-8 w-8 text-primary" />,
      link: '/employees'
    },
    {
      title: 'Đơn vị',
      count: departments.length,
      icon: <Building2 className="h-8 w-8 text-primary" />,
      link: '/departments'
    },
    {
      title: 'Chức vụ',
      count: positions.length,
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      link: '/positions'
    },
    {
      title: 'Hợp đồng',
      count: contracts.length,
      icon: <FileText className="h-8 w-8 text-primary" />,
      link: '/contracts'
    }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Tổng quan</h1>
        <p className="text-muted-foreground mt-1">Thông tin tổng quan hệ thống quản lý nhân sự</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link to={card.link} key={card.title}>
            <Card className="hover:shadow-md transition-shadow duration-200 hover:border-primary/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{card.count}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default Dashboard;
