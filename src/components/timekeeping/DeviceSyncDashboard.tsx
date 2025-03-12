
import React, { useState } from "react";
import { useAppStore } from "@/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, RefreshCw, Server } from "lucide-react";
import { toast } from "sonner";

export interface DeviceSyncDashboardProps {
  onSync: (deviceId: string) => void;
}

export function DeviceSyncDashboard({ onSync }: DeviceSyncDashboardProps) {
  const { timekeepingDevices } = useAppStore();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (selectedDeviceId) {
      setIsSyncing(true);
      try {
        onSync(selectedDeviceId);
        toast.success("Đồng bộ dữ liệu thành công!");
      } catch (error) {
        toast.error("Đồng bộ dữ liệu thất bại!");
        console.error("Sync failed", error);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="flex flex-col gap-4 p-6">
        <div className="flex items-center space-x-2">
          <Server className="h-4 w-4" />
          <h2 className="text-sm font-semibold tracking-tight">
            Đồng bộ dữ liệu chấm công
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Chọn thiết bị và đồng bộ dữ liệu chấm công mới nhất.
        </p>
        
        <div className="grid gap-2">
          <Select onValueChange={setSelectedDeviceId}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn thiết bị" />
            </SelectTrigger>
            <SelectContent>
              {timekeepingDevices.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name} ({device.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleSync} 
            disabled={isSyncing || !selectedDeviceId}
          >
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang đồng bộ...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Đồng bộ ngay
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
