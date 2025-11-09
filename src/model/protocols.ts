import { Protocol } from './schema';

/**
 * Each protocol is associated with a color. These colors are used to
 * distinguish different connection types in the topology view.
 */
export const PROTOCOL_COLOR: Record<Protocol, string> = {
  WLAN: '#3b82f6',
  ZigBee: '#f97316',
  Homematic: '#f59e0b',
  BLE: '#8b5cf6',
  DECT: '#22c55e',
  Ethernet: '#6b7280',
};
