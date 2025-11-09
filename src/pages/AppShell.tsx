import React from 'react';
import TopBar from '../components/TopBar';
import TopologyCanvas from '../components/TopologyCanvas';
import DevicePalette from '../components/DevicePalette';
import RollingLog from '../components/RollingLog';

const AppShell: React.FC = () => {
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Top Bar (assuming it exists based on summary) */}
            <header className="flex-shrink-0">
                <TopBar />
            </header>

            {/* Main Content Area: Palette + Canvas */}
            <main className="flex flex-grow overflow-hidden">
                {/* Left Sidebar: Device Palette */}
                <aside className="w-64 flex-shrink-0">
                    <DevicePalette />
                </aside>

                {/* Canvas Area */}
                <div className="flex-grow relative">
                    <TopologyCanvas />

                    {/* Rolling Log in the bottom right corner */}
                    <div className="absolute bottom-4 right-4 w-96 h-64 z-10">
                        <RollingLog />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AppShell;
