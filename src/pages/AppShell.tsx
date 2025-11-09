import React from 'react';
import TopBar from '../components/TopBar';
import DevicePalette from '../components/DevicePalette';
import TopologyCanvas from '../components/TopologyCanvas';
import RollingLog from '../components/RollingLog';

/**
 * AppShell lays out the three main sections of the UI: the device palette,
 * the topology canvas, and the rolling log. It also includes a top bar.
 */
const AppShell: React.FC = () => {
  return (
    <div className="h-screen w-screen grid grid-rows-[auto_1fr] bg-slate-50">
      <TopBar />
      <div className="grid grid-cols-[320px_1fr_360px] gap-2 p-2">
        <DevicePalette />
        <TopologyCanvas />
        <RollingLog />
      </div>
    </div>
  );
};

export default AppShell;
