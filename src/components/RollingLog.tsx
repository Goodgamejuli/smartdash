import React from 'react';

/**
 * RollingLog will display a real-time stream of events. Currently it
 * contains placeholder text.
 */
const RollingLog: React.FC = () => {
  return (
    <aside className="bg-white rounded-xl border p-2 overflow-y-auto">
      <h2 className="font-semibold mb-2">Log</h2>
      <p>Hier werden Statusmeldungen in Echtzeit angezeigt.</p>
    </aside>
  );
};

export default RollingLog;
