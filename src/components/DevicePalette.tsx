import React from 'react';

/**
 * DevicePalette will display a list of device types that the user can
 * drag into the topology canvas. For now it shows a placeholder.
 */
const DevicePalette: React.FC = () => {
  return (
    <aside className="bg-white rounded-xl border p-2 overflow-y-auto">
      <h2 className="font-semibold mb-2">Gerätepalette</h2>
      {/* Device tiles will go here */}
      <p>
        Hier werden Gerätetypen angezeigt und können per Drag &amp; Drop in die
        Topologie gezogen werden.
      </p>
    </aside>
  );
};

export default DevicePalette;
