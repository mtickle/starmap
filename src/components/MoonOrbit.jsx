const MoonOrbit = ({ moon, mIdx, planetSize, tiltAngle }) => {
    const moonRingSize = planetSize + 16 + (mIdx * 14);
    const moonAngle = (mIdx * 105) % 360;
    const moonDuration = 8 + (mIdx * 6);
    const moonSize = Math.max(3, Math.min(6, planetSize * 0.35));

    const isString = typeof moon === "string";
    const moonName = isString ? moon : (moon.name || `Moon ${mIdx + 1}`);
    const moonColor = isString ? "#888" : (moon.color || "#a1a1aa");

    return (
        <div
            className="absolute inset-0 m-auto aspect-square pointer-events-none"
            style={{ width: `${moonRingSize}px`, transform: `rotate(${moonAngle}deg)`, transformStyle: "preserve-3d" }}
        >
            <div
                className="w-full h-full rounded-full border border-gray-500/30 border-dotted"
                style={{ animation: `orbit-spin ${moonDuration}s linear infinite`, transformStyle: "preserve-3d" }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30" style={{ transformStyle: "preserve-3d" }}>
                    <div style={{ animation: `orbit-spin ${moonDuration}s linear infinite reverse`, transformStyle: "preserve-3d" }}>
                        <div style={{ transform: `rotate(-${moonAngle}deg)`, transformStyle: "preserve-3d" }}>
                            <div style={{ transform: `rotateX(-${tiltAngle}deg)` }}>
                                {/* MOON VISUAL */}
                                <div
                                    className="rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.9)] border border-black/80 pointer-events-auto cursor-help hover:scale-150 transition-transform"
                                    style={{
                                        width: `${moonSize}px`,
                                        height: `${moonSize}px`,
                                        backgroundColor: moonColor,
                                        backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.85) 85%)`
                                    }}
                                    title={moonName}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoonOrbit;