const NavigationHeader = ({ setOffsetX, setOffsetY, setScale }) => {

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-950 border-b border-gray-800 p-2 px-6 flex justify-between items-center z-50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">

      {/* Left Side: Title */}
      <div className="flex items-center">
        <span className="text-white font-bold tracking-[0.3em] text-xl uppercase">
          Starmap
        </span>
      </div>

      {/* Right Side: Controls */}
      <div className="flex items-center">
        <button
          onClick={() => {
            setOffsetX(0);
            setOffsetY(0);
            setScale(1);
          }}
          className="bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white px-4 py-1.5 rounded border border-gray-700 shadow backdrop-blur-sm transition-all text-sm leading-none tracking-wider uppercase font-semibold"
        >
          Recenter Map
        </button>
      </div>

    </div>
  );
};

export default NavigationHeader;