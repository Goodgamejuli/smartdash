import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import TopologyCanvas from '../components/TopologyCanvas';
import DevicePalette from '../components/DevicePalette';
import RollingLog from '../components/RollingLog';
import TutorialOverlay from '../components/TutorialOverlay';

// Das App-Shell ordnet die Bausteine: Links wie im Packet Tracer die Palette,
// rechts die Arbeitsfläche und darunter das Live-Log.
const AppShell: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="relative flex h-screen flex-col bg-gray-50">
      <header className="flex-shrink-0">
        <TopBar onShowTutorial={() => setShowTutorial(true)} />
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

      {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}
    </div>
  );
};

export default AppShell;
