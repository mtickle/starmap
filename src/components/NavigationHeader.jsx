import { useState } from "react";

const STAR_CLASSES = ["O", "B", "A", "F", "G", "K", "M"];
const FACTIONS = ["Independent", "United Colonies", "Crimson Fleet", "FreeStar Collective"];

const NavigationHeader = ({ setOffsetX, setOffsetY, setScale, filters, onFilterChange, onResetFilters }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleToggle = (category, value) => {
    const current = filters?.[category] || [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onFilterChange({ ...filters, [category]: updated });
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-950 border-b border-gray-800 p-3 px-6 flex flex-col z-50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">

      {/* Top Bar Row */}
      <div className="flex justify-between items-center w-full">
        {/* Left Side: Title */}
        <div className="flex items-center gap-4">
          <span className="text-white font-bold tracking-[0.3em] text-2xl uppercase">
            Starmap
          </span>
        </div>

        {/* Right Side: Controls */}
        <div className="flex items-center gap-3">
          {/* Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-5 py-2 rounded-lg border transition-all text-sm leading-none tracking-wider uppercase font-semibold font-mono ${isFilterOpen
                ? "bg-purple-950/90 text-purple-200 border-purple-600 shadow-[0_0_12px_rgba(147,51,234,0.3)]"
                : "bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border-gray-700"
              }`}
          >
            {isFilterOpen ? "Close Filters" : "Filter Sector"}
          </button>

          {/* Recenter Map Button */}
          <button
            type="button"
            onClick={() => {
              setOffsetX(0);
              setOffsetY(0);
              setScale(1);
            }}
            className="bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white px-5 py-2 rounded-lg border border-gray-700 shadow backdrop-blur-sm transition-all text-sm leading-none tracking-wider uppercase font-semibold"
          >
            Recenter Map
          </button>
        </div>
      </div>

      {/* Expandable Filter Tray */}
      {isFilterOpen && (
        <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-sm text-gray-200 pb-2 animate-fadeIn">

          {/* Star Class Filter */}
          <div className="space-y-2">
            <span className="text-xs text-purple-400 font-bold uppercase tracking-widest block">Star Class</span>
            <div className="flex flex-wrap gap-1.5">
              {STAR_CLASSES.map((cls) => {
                const active = filters?.starClass?.includes(cls);
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => handleToggle("starClass", cls)}
                    className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${active
                        ? "bg-purple-950 text-purple-200 border-purple-500 shadow-[0_0_8px_rgba(147,51,234,0.2)]"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700 hover:text-gray-200"
                      }`}
                  >
                    {cls}
                  </button>
                );
              })}
            </div>
          </div>

          {/* System Status Toggles */}
          <div className="space-y-2">
            <span className="text-xs text-purple-400 font-bold uppercase tracking-widest block">System Status</span>
            <div className="flex flex-wrap gap-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer bg-gray-900/90 px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-700">
                <input
                  type="checkbox"
                  checked={filters?.hasCiv || false}
                  onChange={(e) => onFilterChange({ ...filters, hasCiv: e.target.checked })}
                  className="rounded bg-gray-950 border-gray-700 text-purple-600 focus:ring-0 w-4 h-4"
                />
                <span className="text-gray-200 text-xs">Inhabited</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer bg-gray-900/90 px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-700">
                <input
                  type="checkbox"
                  checked={filters?.hasBiosphere || false}
                  onChange={(e) => onFilterChange({ ...filters, hasBiosphere: e.target.checked })}
                  className="rounded bg-gray-950 border-gray-700 text-purple-600 focus:ring-0 w-4 h-4"
                />
                <span className="text-gray-200 text-xs">Biosphere</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer bg-gray-900/90 px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-700">
                <input
                  type="checkbox"
                  checked={filters?.hasRare || false}
                  onChange={(e) => onFilterChange({ ...filters, hasRare: e.target.checked })}
                  className="rounded bg-gray-950 border-gray-700 text-purple-600 focus:ring-0 w-4 h-4"
                />
                <span className="text-gray-200 text-xs">Rare Deposits</span>
              </label>
            </div>
          </div>

          {/* Faction Influence & Reset */}
          <div className="space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-xs text-purple-400 font-bold uppercase tracking-widest block mb-1.5">Faction</span>
              <div className="flex flex-wrap gap-1.5">
                {FACTIONS.map((faction) => {
                  const active = filters?.faction?.includes(faction);
                  return (
                    <button
                      key={faction}
                      type="button"
                      onClick={() => handleToggle("faction", faction)}
                      className={`px-2.5 py-1 rounded text-xs border transition-colors ${active
                          ? "bg-blue-950 text-blue-200 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.2)]"
                          : "bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700 hover:text-gray-200"
                        }`}
                    >
                      {faction}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Button */}
            {onResetFilters && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="text-xs text-gray-400 hover:text-white uppercase tracking-wider transition-colors underline underline-offset-4"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default NavigationHeader;