import React from 'react';
import { useTopologyStore } from '../store/useTopologyStore';

const RollingLog: React.FC = () => {
  const logs = useTopologyStore((s) => s.logs);

  const safe = Array.isArray(logs) ? logs : [];

  return (
    <div
      className="h-40 w-full overflow-auto rounded-md border border-gray-300 bg-white/80 p-2 text-sm"
      role="log"
      aria-live="polite"
    >
      {safe.length === 0 ? (
        <div className="italic opacity-60">no messages yet</div>
      ) : (
        safe.slice(-200).map((l) => (
          <div key={l.id} className="whitespace-pre-wrap">
            <span className="opacity-50">[{new Date(l.ts).toLocaleTimeString()}]</span>{' '}
            {l.text}
          </div>
        ))
      )}
    </div>
  );
};

export default RollingLog;
