// In diesem kleinen Schema sammeln wir die zentralen Typdefinitionen,
// die sich rund um die Topologie drehen. Ein sauber gepflegtes Typsystem
// hilft uns später dabei, die JSON-Exports zu validieren und macht die
// übrigen Skripte deutlich lesbarer.

// Wir definieren die möglichen Protokolle so, wie sie im restlichen Code
// wirklich genannt werden. Dadurch können wir Farben, Texte und Legenden
// zuverlässig zuordnen.
export type Protocol =
  | 'WLAN'
  | 'ZigBee'
  | 'Homematic Proprietary (ZigBee)'
  | 'Bluetooth Low Energy'
  | 'DECT'
  | 'Ethernet';

export type Device = {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  room?: string | null;
  protocols: Protocol[];
  battery?: number | null;
};

export type Edge = {
  id: string;
  from: string;
  to: string;
  protocol: Protocol;
};

export type LogEvent = {
  id: string;
  ts: string;
  severity: 'info' | 'warn' | 'error';
  text: string;
  deviceId?: string;
};
