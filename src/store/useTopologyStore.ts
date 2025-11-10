import { create } from 'zustand';

export type LogEntry = { id: string; ts: number; text: string };

export type Device = {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  protocols: string[];
};

export type Edge = { id: string; source: string; target: string; protocol?: string };

let _id = 0;
const nextId = () => String(++_id);

type State = {
  devices: Device[];
  edges: Edge[];
  logs: LogEntry[];

  addDevice: (d: Omit<Device, 'id'>) => Device;
  addEdge: (e: Omit<Edge, 'id'>) => Edge;
  addLog: (text: string) => void;
  clearLog: () => void;

  updateDevicePosition: (id: string, x: number, y: number) => void;
};

export const useTopologyStore = create<State>((set) => ({
  devices: [],
  edges: [],
  logs: [],

  addDevice: (d) => {
    const dev: Device = { id: nextId(), ...d };
    set((s) => ({ devices: [...s.devices, dev] }));
    return dev;
  },

  addEdge: (e) => {
    const ed: Edge = { id: nextId(), ...e };
    set((s) => ({ edges: [...s.edges, ed] }));
    return ed;
  },

  addLog: (text) =>
    set((s) => ({ logs: [...s.logs, { id: nextId(), ts: Date.now(), text }] })),

  clearLog: () => set({ logs: [] }),

  // NEW
  updateDevicePosition: (id, x, y) =>
    set((s) => ({
      devices: s.devices.map((d) => (d.id === id ? { ...d, x, y } : d)),
    })),
}));
