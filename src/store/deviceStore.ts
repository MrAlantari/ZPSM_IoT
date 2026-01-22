import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Device {
  id: string;
  name: string;
  place: string;
  command: string;
  color: string;
}

interface DeviceStore {
  devices: Device[];
  // Teraz wymagamy też color od użytkownika
  addDevice: (device: Omit<Device, 'id'>) => void;
  removeDevice: (id: string) => void;
  updateDevice: (id: string, device: Partial<Device>) => void;
  clearDevices: () => void;
}

export const useDeviceStore = create<DeviceStore>()(
  persist(
    (set, get) => ({
      devices: [],
      addDevice: (deviceData) => {
        const newDevice: Device = {
          ...deviceData,
          id: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        
        set((state) => ({
          devices: [...state.devices, newDevice],
        }));
      },
      removeDevice: (id) => {
        set((state) => ({
          devices: state.devices.filter((device) => device.id !== id),
        }));
      },
      updateDevice: (id, updatedDevice) => {
        set((state) => ({
          devices: state.devices.map((device) =>
            device.id === id ? { ...device, ...updatedDevice } : device
          ),
        }));
      },
      clearDevices: () => {
        set({ devices: [] });
      },
    }),
    {
      name: 'device-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);