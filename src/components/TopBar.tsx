import React from 'react';

type TopBarProps = {
  onShowTutorial: () => void;
};

/**
 * TopBar displays the title of the dashboard and will eventually hold
 * buttons for actions such as saving/loading the layout or showing the
 * protocol legend.
 */
const TopBar: React.FC<TopBarProps> = ({ onShowTutorial }) => {
  return (
    <header className="h-12 flex items-center justify-between px-4 border-b bg-white">
      <div className="font-semibold">Smart-Home Topologie (Demo-UI)</div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onShowTutorial}
          className="rounded-md border border-sky-500 px-3 py-1 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-50 focus:outline-none focus-visible:ring focus-visible:ring-sky-400"
        >
          Technische Hintergründe
        </button>
      </div>
    </header>
  );
};

export default TopBar;
