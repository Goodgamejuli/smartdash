import { create } from 'zustand';
import { Device, Edge, LogEvent, Protocol } from '../model/schema';

/**
 * useTopologyStore uses Zustand to manage the application state. It keeps
 * track of devices, edges and log events, and provides functions for
 * modifying them. The store is intentionally simple and does not persist
 * data between sessions.
 */
type State = {
  devices: Device[];
  edges: Edge[];
  selectedId?: string;
  log: LogEvent[];
  addDevice: (d: Omit<Device, 'id'>) => void;
  moveDevice: (id: string, x: number, y: number) => void;
  addEdge: (from: string, to: string, protocol: Protocol) => void;
  addLog: (e: Omit<LogEvent, 'id' | 'ts'> & { ts?: string }) => void;
  saveLayout: () => string;
  loadLayout: (json: string) => void;
};

export const useTopologyStore = create<State>((set, get) => ({
  devices: [],
  edges: [],
  log: [],
  addDevice: (d) =>
    set((state) => ({ devices: [...state.devices, { ...d, id: crypto.randomUUID() }] })),
  moveDevice: (id, x, y) =>
    set((state) => ({
      devices: state.devices.map((v) => (v.id === id ? { ...v, x, y } : v)),
    })),
  addEdge: (from, to, protocol) =>
    set((state) => ({
      edges: [...state.edges, { id: crypto.randomUUID(), from, to, protocol }],
    })),
  addLog: (e) =>
    set((state) => ({
      log: [
        { id: crypto.randomUUID(), ts: e.ts ?? new Date().toISOString(), ...e },
        ...state.log,
      ].slice(0, 500),
    })),
  saveLayout: () => {
    const { devices, edges } = get();
    return JSON.stringify({ devices, edges });
  },
  loadLayout: (json) => {
    const { devices, edges } = JSON.parse(json);
    set({ devices, edges });
  },
}));
