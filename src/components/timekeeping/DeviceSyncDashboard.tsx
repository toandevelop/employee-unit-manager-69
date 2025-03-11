
import { useState } from 'react';
import { useAppStore } from '@/store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { CheckCircle, RefreshCw, AlertTriangle, Clock, Wifi } from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import RawDataTable from './RawDataTable';
import { toast } from 'sonner';

const DeviceSyncDashboard = () => {
  const { 
    timekeepingDevices, 
    rawTimeData, 
    syncDeviceData, 
    markDataProcessed, 
    bulkAddTimeEntries 
  } = useAppStore();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSyncing, setIsSyncing] = useState<{[key: string]: boolean}>({});
  
  // Filter raw data based on selected device or show all
  const filteredRawData = selectedDevice 
    ? rawTimeData.filter(data => data.deviceId === selectedDevice)
    : rawTimeData;
    
  // Get unprocessed data count for each device
  const getUnprocessedCount = (deviceId: string) => 
    rawTimeData.filter(data => data.deviceId === deviceId && !data.processed).length;
    
  // Get total unprocessed data count
  const totalUnprocessed = rawTimeData.filter(data => !data.processed).length;
  
  // Handle device sync
  const handleSync = async (deviceId: string) => {
    setIsSyncing(prev => ({ ...prev, [deviceId]: true }));
    
    // Simulate API call to device
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    syncDeviceData(deviceId);
    toast.success('Đồng bộ dữ liệu từ máy chấm công thành công');
    
    setIsSyncing(prev => ({ ...prev, [deviceId]: false }));
  };
  
  // Process raw time data
  const processRawData = () => {
    setIsProcessing(true);
    
    // Get unprocessed data
    const dataToProcess = rawTimeData.filter(data => !data.processed);
    if (dataToProcess.length === 0) {
      toast.info('Không có dữ liệu mới cần xử lý');
      setIsProcessing(false);
      return;
    }
    
    // Simulate processing
    setTimeout(() => {
      // Mark data as processed
      markDataProcessed(dataToProcess.map(d => d.id));
      
      toast.success(`Đã xử lý ${dataToProcess.length} bản ghi thành công`);
      setIsProcessing(false);
    }, 2000);
  };
  
  // Format status badge
  const getStatusBadge = (status: 'active' | 'inactive' | 'maintenance') => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Hoạt động</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Không hoạt động</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Bảo trì</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="devices">
        <TabsList>
          <TabsTrigger value="devices">Máy chấm công</TabsTrigger>
          <TabsTrigger value="raw-data">Dữ liệu thô</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Danh sách máy chấm công</h2>
              <p className="text-muted-foreground">Quản lý và đồng bộ dữ liệu từ các máy chấm công</p>
            </div>
            <Button 
              onClick={processRawData} 
              disabled={isProcessing || totalUnprocessed === 0}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Xử lý dữ liệu ({totalUnprocessed})
                </>
              )}
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {timekeepingDevices.map((device) => (
              <Card key={device.id} className={device.status === 'active' ? 'border-green-200' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                    {getStatusBadge(device.status)}
                  </div>
                  <CardDescription>
                    Mã thiết bị: {device.code}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-slate-400" />
                      <span>IP: {device.ipAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>
                        Đồng bộ lần cuối: {device.lastSyncDate ? 
                          formatDistanceToNow(parseISO(device.lastSyncDate), { 
                            addSuffix: true, 
                            locale: vi 
                          }) : 'Chưa đồng bộ'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle 
                        className={`h-4 w-4 ${getUnprocessedCount(device.id) > 0 ? 'text-amber-500' : 'text-slate-400'}`} 
                      />
                      <span>
                        {getUnprocessedCount(device.id)} bản ghi chưa xử lý
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    onClick={() => handleSync(device.id)}
                    disabled={isSyncing[device.id] || device.status !== 'active'}
                    variant="secondary"
                    className="w-full"
                  >
                    {isSyncing[device.id] ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Đang đồng bộ...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Đồng bộ dữ liệu
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="raw-data">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Dữ liệu chấm công thô</h2>
                <p className="text-muted-foreground">Dữ liệu chấm công chưa được xử lý từ các máy chấm công</p>
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedDevice || ''}
                  onValueChange={(value) => setSelectedDevice(value || null)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Chọn máy chấm công" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả thiết bị</SelectItem>
                    {timekeepingDevices.map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={processRawData} 
                  disabled={isProcessing || totalUnprocessed === 0}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Xử lý dữ liệu ({totalUnprocessed})
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <RawDataTable rawTimeData={filteredRawData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceSyncDashboard;
