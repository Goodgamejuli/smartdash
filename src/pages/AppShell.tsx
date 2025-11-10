import React from 'react';
import TopBar from '../components/TopBar';
import TopologyCanvas from '../components/TopologyCanvas';
import DevicePalette from '../components/DevicePalette';
import RollingLog from '../components/RollingLog';

// Das App-Shell ordnet die Bausteine: Links wie im Packet Tracer die Palette,
// rechts die Arbeitsfläche und darunter das Live-Log.
const AppShell: React.FC = () => {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="flex-shrink-0">
        <TopBar />
      </header>

      <main className="flex flex-grow overflow-hidden">
        <aside className="w-72 flex-shrink-0">
          <DevicePalette />
        </aside>

        <div className="relative flex-grow">
          <TopologyCanvas />

          <div className="absolute bottom-4 right-4 z-10 h-64 w-96">
            <RollingLog />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppShell;
