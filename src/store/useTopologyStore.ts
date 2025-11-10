import { create } from 'zustand';
import { Protocol } from '../model/schema';

// Der Store bildet das Herzstück unserer kleinen Packet-Tracer-Alternative.
// Hier speichern wir Geräte, Verbindungen und ein Logbuch, das den Nutzer
// bei jedem Schritt begleitet.

export type LogEntry = { id: string; ts: number; text: string };

export type Device = {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  protocols: Protocol[];
};

export type Edge = {
  id: string;
  source: string;
  target: string;
  protocol: Protocol;
};

export type TopologySnapshot = {
  meta: {
    exportedAt: string;
    deviceCount: number;
    edgeCount: number;
  };
  devices: Device[];
  edges: Edge[];
};

let _id = 0;
const nextId = () => String(++_id);
const updateSequenceSeed = (candidate: string | undefined) => {
  if (!candidate) return;
  const parsed = Number(candidate);
  if (!Number.isFinite(parsed)) return;
  if (parsed > _id) {
    _id = parsed;
  }
};

type State = {
  devices: Device[];
  edges: Edge[];
  logs: LogEntry[];

  addDevice: (d: Omit<Device, 'id'>) => Device;
  removeDevice: (id: string) => void;
  addEdge: (e: Omit<Edge, 'id'>) => Edge;
  removeEdge: (id: string) => void;
  updateDevicePosition: (id: string, x: number, y: number) => void;

  addLog: (text: string) => void;
  clearLog: () => void;

  clearAll: () => void;
  exportTopology: () => TopologySnapshot;
  importTopology: (snapshot: Partial<TopologySnapshot>) => void;
};

export const useTopologyStore = create<State>((set, get) => ({
  devices: [],
  edges: [],
  logs: [],

  addDevice: (d) => {
    const dev: Device = { id: nextId(), ...d };
    updateSequenceSeed(dev.id);
    set((s) => ({ devices: [...s.devices, dev] }));
    return dev;
  },

  removeDevice: (id) =>
    set((s) => ({
      devices: s.devices.filter((d) => d.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
    })),

  addEdge: (e) => {
    const ed: Edge = { id: nextId(), ...e };
    updateSequenceSeed(ed.id);
    set((s) => ({ edges: [...s.edges, ed] }));
    return ed;
  },

  removeEdge: (id) =>
    set((s) => ({
      edges: s.edges.filter((e) => e.id !== id),
    })),

  updateDevicePosition: (id, x, y) =>
    set((s) => ({
      devices: s.devices.map((d) => (d.id === id ? { ...d, x, y } : d)),
    })),

  addLog: (text) =>
    set((s) => ({ logs: [...s.logs, { id: nextId(), ts: Date.now(), text }] })),

  clearLog: () => set({ logs: [] }),

  clearAll: () => set({ devices: [], edges: [] }),

  exportTopology: () => {
    const { devices, edges } = get();
    return {
      meta: {
        exportedAt: new Date().toISOString(),
        deviceCount: devices.length,
        edgeCount: edges.length,
      },
      devices,
      edges,
    };
  },

  importTopology: (snapshot) => {
    const devices = Array.isArray(snapshot?.devices)
      ? snapshot.devices.map((dev, index) => {
          const id = dev?.id?.trim() || nextId();
          updateSequenceSeed(id);
          return {
            ...dev,
            id,
            x: typeof dev?.x === 'number' ? dev.x : index * 80,
            y: typeof dev?.y === 'number' ? dev.y : 60 + index * 40,
            protocols: Array.isArray(dev?.protocols) ? (dev.protocols as Protocol[]) : [],
          } as Device;
        })
      : [];

    const edges = Array.isArray(snapshot?.edges)
      ? snapshot.edges
          .filter((ed) => ed?.source && ed?.target && ed?.protocol)
          .map((ed) => {
            const id = ed?.id?.trim() || nextId();
            updateSequenceSeed(id);
            return {
              ...ed,
              id,
            } as Edge;
          })
      : [];

    set({ devices, edges });
  },
}));
