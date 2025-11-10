import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { Protocol } from '../../model/schema';
import { PROTOCOL_META } from '../../model/protocols';

// Dieser Node-Komponent kümmert sich um die Darstellung eines Geräts direkt
// auf der Zeichenfläche. Er zeigt Icon, Name sowie die unterstützten
// Protokolle und spendiert an vier Seiten Verbindungspunkte – fast wie in
// Packet Tracer.

type NodeData = {
  label: string;
  protocols: Protocol[];
  icon?: string;
  categoryLabel?: string;
};

const SmartDeviceNode: React.FC<NodeProps<NodeData>> = ({ data, selected }) => {
  const { label, protocols, icon, categoryLabel } = data;

  return (
    <div
      className={`min-w-[140px] rounded-lg border bg-white p-3 shadow transition ${
        selected ? 'border-blue-500 shadow-lg' : 'border-gray-300'
      }`}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} />

      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          {icon ?? '📦'}
        </span>
        <div>
          <div className="text-sm font-semibold leading-tight text-gray-800">{label}</div>
          {categoryLabel && (
            <div className="text-[11px] uppercase tracking-wide text-gray-400">{categoryLabel}</div>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {protocols.map((protocol) => (
          <span
            key={protocol}
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
            style={{ backgroundColor: PROTOCOL_META[protocol]?.color ?? '#4b5563' }}
          >
            {PROTOCOL_META[protocol]?.label ?? protocol}
          </span>
        ))}
        {protocols.length === 0 && (
          <span className="text-[10px] text-gray-400">keine Funk-/Netzwerkverbindung</span>
        )}
      </div>
    </div>
  );
};

export default React.memo(SmartDeviceNode);
