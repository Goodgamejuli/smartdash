import React from 'react';

/**
 * TopBar displays the title of the dashboard and will eventually hold
 * buttons for actions such as saving/loading the layout or showing the
 * protocol legend.
 */
const TopBar: React.FC = () => {
  return (
    <header className="h-12 flex items-center justify-between px-4 border-b bg-white">
      <div className="font-semibold">Smart-Home Topologie (Demo-UI)</div>
      <div className="flex items-center gap-2">
        {/* Buttons for save/load can be added here in the future */}
      </div>
    </header>
  );
};

export default TopBar;
