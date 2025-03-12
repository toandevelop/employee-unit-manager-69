import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { TimekeepingDevice, RawTimeData } from '@/types';

// Sample data for timekeeping devices and raw time data
const initialTimekeepingDevices: TimekeepingDevice[] = [
  {
    id: "device-001",
    code: "TK-MAIN",
    name: "Máy chấm công chính",
    ipAddress: "192.168.1.100",
    location: "Sảnh chính",
    status: 'active',
    lastSyncDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Yesterday
  },
  {
    id: "device-002",
    code: "TK-SIDE",
    name: "Máy chấm công phụ",
    ipAddress: "192.168.1.101",
    location: "Cổng phụ",
    status: 'active',
    lastSyncDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: "device-003",
    code: "TK-WAREHOUSE",
    name: "Máy chấm công kho",
    ipAddress: "192.168.1.102",
    location: "Kho hàng",
    status: 'maintenance',
    lastSyncDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  }
];

// Generate sample raw time data
const generateRawTimeData = (): RawTimeData[] => {
  const rawData: RawTimeData[] = [];
  const employeeCodes = ["NV-001", "NV-002", "NV-003", "NV-004", "NV-005"];
  const deviceIds = ["device-001", "device-002"];
  
  // Generate entries for the past 5 days
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Generate 30-50 entries per day
    const entriesCount = Math.floor(Math.random() * 20) + 30;
    
    for (let j = 0; j < entriesCount; j++) {
      const employeeCode = employeeCodes[Math.floor(Math.random() * employeeCodes.length)];
      const deviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)];
      const direction = Math.random() > 0.5 ? 'in' : 'out';
      
      // Random time between 7:00 and 18:00
      const hour = Math.floor(Math.random() * 11) + 7;
      const minute = Math.floor(Math.random() * 60);
      date.setHours(hour, minute);
      
      // 80% processed, 20% not processed
      const processed = Math.random() > 0.2;
      // 90% synced, 10% not synced
      const synced = Math.random() > 0.1;
      
      rawData.push({
        id: uuidv4(),
        deviceId,
        employeeCode,
        timestamp: date.toISOString(),
        direction,
        synced,
        syncDate: synced ? new Date(date.getTime() + Math.floor(Math.random() * 60 * 60 * 1000)).toISOString() : undefined,
        processed
      });
    }
  }
  
  return rawData;
};

const initialRawTimeData = generateRawTimeData();

export interface TimekeepingDeviceSlice {
  timekeepingDevices: TimekeepingDevice[];
  rawTimeData: RawTimeData[];
  
  // Device actions
  addDevice: (device: Omit<TimekeepingDevice, 'id'>) => void;
  updateDevice: (id: string, data: Partial<Omit<TimekeepingDevice, 'id'>>) => void;
  deleteDevice: (id: string) => void;
  
  // Raw time data actions
  addRawTimeData: (data: Omit<RawTimeData, 'id'>) => void;
  updateRawTimeData: (id: string, data: Partial<Omit<RawTimeData, 'id'>>) => void;
  deleteRawTimeData: (id: string) => void;
  bulkAddRawTimeData: (data: Omit<RawTimeData, 'id'>[]) => void;
  markDataProcessed: (ids: string[]) => void;
  markDataSynced: (ids: string[]) => void;
  syncDeviceData: (deviceId: string) => void;
}

export const createTimekeepingDeviceSlice: StateCreator<TimekeepingDeviceSlice, [], [], TimekeepingDeviceSlice> = 
  (set, get, api) => ({
    timekeepingDevices: initialTimekeepingDevices,
    rawTimeData: initialRawTimeData,
    
    // Device actions
    addDevice: (device) => {
      const newDevice: TimekeepingDevice = {
        id: uuidv4(),
        ...device
      };
      
      set((state) => ({
        timekeepingDevices: [...state.timekeepingDevices, newDevice]
      }));
    },
    
    updateDevice: (id, data) => {
      set((state) => ({
        timekeepingDevices: state.timekeepingDevices.map((device) => 
          device.id === id ? { ...device, ...data } : device
        )
      }));
    },
    
    deleteDevice: (id) => {
      set((state) => ({
        timekeepingDevices: state.timekeepingDevices.filter((device) => device.id !== id)
      }));
    },
    
    // Raw time data actions
    addRawTimeData: (data) => {
      const newData: RawTimeData = {
        id: uuidv4(),
        ...data
      };
      
      set((state) => ({
        rawTimeData: [...state.rawTimeData, newData]
      }));
    },
    
    updateRawTimeData: (id, data) => {
      set((state) => ({
        rawTimeData: state.rawTimeData.map((item) => 
          item.id === id ? { ...item, ...data } : item
        )
      }));
    },
    
    deleteRawTimeData: (id) => {
      set((state) => ({
        rawTimeData: state.rawTimeData.filter((item) => item.id !== id)
      }));
    },
    
    bulkAddRawTimeData: (data) => {
      const newItems = data.map(item => ({
        id: uuidv4(),
        ...item
      }));
      
      set((state) => ({
        rawTimeData: [...state.rawTimeData, ...newItems]
      }));
    },
    
    markDataProcessed: (ids) => {
      set((state) => ({
        rawTimeData: state.rawTimeData.map((item) => 
          ids.includes(item.id) ? { ...item, processed: true } : item
        )
      }));
    },
    
    markDataSynced: (ids) => {
      const now = new Date().toISOString();
      
      set((state) => ({
        rawTimeData: state.rawTimeData.map((item) => 
          ids.includes(item.id) ? { ...item, synced: true, syncDate: now } : item
        )
      }));
    },
    
    syncDeviceData: (deviceId) => {
      const now = new Date().toISOString();
      
      // Update device last sync date
      set((state) => ({
        timekeepingDevices: state.timekeepingDevices.map((device) => 
          device.id === deviceId ? { ...device, lastSyncDate: now } : device
        )
      }));
      
      // Generate random new raw time data
      const newRawData: Omit<RawTimeData, 'id'>[] = [];
      const employeeCodes = ["NV-001", "NV-002", "NV-003", "NV-004", "NV-005"];
      
      // Generate 10-20 new entries
      const entriesCount = Math.floor(Math.random() * 10) + 10;
      const date = new Date();
      
      for (let j = 0; j < entriesCount; j++) {
        const employeeCode = employeeCodes[Math.floor(Math.random() * employeeCodes.length)];
        const direction = Math.random() > 0.5 ? 'in' : 'out';
        
        // Random time in the last 24 hours
        const hour = Math.floor(Math.random() * 24);
        const minute = Math.floor(Math.random() * 60);
        date.setHours(hour, minute);
        
        newRawData.push({
          deviceId,
          employeeCode,
          timestamp: date.toISOString(),
          direction,
          synced: true,
          syncDate: now,
          processed: false
        });
      }
      
      // Add new raw data
      set((state) => ({
        rawTimeData: [
          ...state.rawTimeData,
          ...newRawData.map(item => ({ id: uuidv4(), ...item }))
        ]
      }));
    }
  });
