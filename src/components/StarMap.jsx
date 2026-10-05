import StarSystemViewer from '@components/StarSystemViewer';
import { useDeterministicStarField } from '@hooks/useDeterministicStarField.js';
import {
    createHandleContextMenu,
    createHandleMouseDown,
    createHandleMouseMove,
    createHandleMouseUp,
    createHandleWheel,
    createHandleTouchStart,
    createHandleTouchMove,
    createHandleTouchEnd
} from '@utils/mouseUtils.jsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import NavigationFooter from './NavigationFooter.jsx';

const getStarTooltip = (star) => {
    if (!star) return null;
    return {
        name: star.name,
        type: star.type,
        color: star.color, // Grab the hex code for styling
        faction: star.faction?.name || 'Uncharted',
        coordinates: star.id,
        planetCount: star.fullData?.planets?.length || 0
    };
};

const StarMap = () => {
    // --- STATE MANAGEMENT ---
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [scale, setScale] = useState(1);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    // FUSED: Procedural on-the-fly generation replaces API fetch
    const stars = useDeterministicStarField({
        offsetX,
        offsetY,
        canvasWidth: canvasSize.width,
        canvasHeight: canvasSize.height,
        scale,
    });

    // --- UI & INTERACTION STATE ---
    const [activeSystem, setActiveSystem] = useState(null);
    const [hoveredStar, setHoveredStar] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [showSystemMap, setShowSystemMap] = useState(false);

    // --- REFS ---
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const backgroundStars = useRef([]);
    const NEBULA_CLOUDS = useRef([]);

    // --- EFFECT HOOKS ---
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = canvas?.parentElement;
        if (!canvas || !container) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                canvas.width = width;
                canvas.height = height;
                setCanvasSize({ width, height });

                const numBgStars = 200;
                const starsArray = Array.from({ length: numBgStars }, () => ({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.5,
                    opacity: 0.1 + Math.random() * 0.2
                }));
                backgroundStars.current = starsArray;

                NEBULA_CLOUDS.current = [
                    { x: width * 0.2, y: height * 0.3, radius: 150, color: 'rgba(100, 100, 255, 0.03)' },
                    { x: width * 0.7, y: height * 0.8, radius: 180, color: 'rgba(255, 100, 100, 0.03)' }
                ];
            }
        });
        resizeObserver.observe(container);
        return () => resizeObserver.unobserve(container);
    }, []);

    // --- MOUSE HANDLERS ---
    const handleMouseDown = createHandleMouseDown(setIsDragging, setDragStart);

    const handleMouseMove = useCallback((e) => {
        createHandleMouseMove({
            canvasRef, offsetX, offsetY, scale, isDragging,
            setOffsetX, setOffsetY, dragStart, setDragStart,
            stars, setHoveredStar
        })(e);
    }, [offsetX, offsetY, scale, isDragging, dragStart, stars]);

    const handleMouseUp = createHandleMouseUp(setIsDragging);

    const handleWheel = useCallback((e) => {
        createHandleWheel(scale, setScale)(e);
    }, [scale]);

    const handleClick = useCallback((e) => {
        if (isDragging) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - canvas.width / 2 - offsetX) / scale;
        const mouseY = (e.clientY - rect.top - canvas.height / 2 - offsetY) / scale;

        const clickedStar = stars.find(star => {
            const dx = mouseX - star.x;
            const dy = mouseY - star.y;
            return Math.sqrt(dx * dx + dy * dy) < star.size + 4 / scale;
        });

        if (!clickedStar) return;

        // Pass the deterministically generated payload directly to the viewer
        setActiveSystem(clickedStar.fullData);
        setShowSystemMap(true);

        // Visited Systems Logging
        const visited = JSON.parse(localStorage.getItem('visitedStars') || '[]');
        if (!visited.includes(clickedStar.id)) {
            visited.push(clickedStar.id);
            localStorage.setItem('visitedStars', JSON.stringify(visited));
        }
    }, [isDragging, offsetX, offsetY, scale, stars]);

    const handleContextMenu = createHandleContextMenu({
        canvasRef, offsetX, offsetY, scale, stars
    });

    const handleTouchStart = createHandleTouchStart(setIsDragging, setDragStart);

    const handleTouchMove = useCallback((e) => {
        createHandleTouchMove({
            offsetX, offsetY, scale, isDragging,
            setOffsetX, setOffsetY, dragStart, setDragStart,
            setScale
        })(e);
    }, [offsetX, offsetY, scale, isDragging, dragStart]);

    const handleTouchEnd = createHandleTouchEnd(setIsDragging);

    // --- DRAWING LOGIC ---
    const drawScene = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        // 1. Background Gradient (Static Space)
        ctx.clearRect(0, 0, width, height);
        const backgroundGradient = ctx.createLinearGradient(0, 0, width, height);
        backgroundGradient.addColorStop(0, '#0a0a14');
        backgroundGradient.addColorStop(0.5, '#1a1a2e');
        backgroundGradient.addColorStop(1, '#0a0a14');
        ctx.fillStyle = backgroundGradient;
        ctx.fillRect(0, 0, width, height);

        // 2. Deep Background Stars (Moves at 10% speed)
        backgroundStars.current.forEach((star, idx) => {
            // Split the background stars into two depth layers based on odd/even index
            const depthSpeed = idx % 2 === 0 ? 0.05 : 0.15;

            // Apply parallax offset and use modulo to seamlessly wrap around screen edges
            const px = ((star.x + offsetX * depthSpeed) % width + width) % width;
            const py = ((star.y + offsetY * depthSpeed) % height + height) % height;

            ctx.beginPath();
            ctx.arc(px, py, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });

        // 3. Midground Nebula Clouds (Moves at 30% speed)
        NEBULA_CLOUDS.current.forEach(cloud => {
            const px = ((cloud.x + offsetX * 0.3) % width + width) % width;
            const py = ((cloud.y + offsetY * 0.3) % height + height) % height;

            ctx.beginPath();
            ctx.arc(px, py, cloud.radius, 0, Math.PI * 2);
            ctx.fillStyle = cloud.color;
            ctx.fill();
        });

        ctx.save();
        ctx.translate(width / 2 + offsetX, height / 2 + offsetY);
        ctx.scale(scale, scale);

        const visited = JSON.parse(localStorage.getItem('visitedStars') || '[]');
        const home = JSON.parse(localStorage.getItem('homeSystem') || '{}');

        // Draw Interactive Foreground Stars

        // Draw Interactive Foreground Stars
        // Draw Interactive Foreground Stars
        stars.forEach((star) => {
            // Calculate exact universe bounds based on camera offset and zoom
            const minX = (-width / 2 - offsetX) / scale - 30;
            const maxX = (width / 2 - offsetX) / scale + 30;
            const minY = (-height / 2 - offsetY) / scale - 30;
            const maxY = (height / 2 - offsetY) / scale + 30;

            // Cull stars that are outside the calculated camera view
            if (star.x < minX || star.x > maxX || star.y < minY || star.y > maxY) {
                return;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = star.color;

            // Only apply expensive shadow physics when zoomed in
            if (scale > 0.5) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = star.color;
            } else {
                ctx.shadowBlur = 0; // Performance mode
            }

            ctx.fill();
            ctx.shadowBlur = 0; // Always reset

            // Level of Detail: Text and Rings
            if (scale > 0.5) {
                ctx.fillStyle = '#FFFFFF';
                ctx.font = `${12 / scale}px Courier New, monospace`;
                ctx.textAlign = 'center';
                ctx.fillText(star.name, star.x, star.y - star.size - 6 / scale);

                // Home System Ring
                if (home.id === star.id) {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size + 4 / scale, 0, Math.PI * 2);
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 1 / scale;
                    ctx.stroke();
                }
            }

            // Visited System Indicator (Only draw if zoomed in enough to see it)
            if (scale > 0.2 && visited.includes(star.id)) {
                ctx.beginPath();
                ctx.arc(star.x, star.y + star.size + 5 / scale, 2 / scale, 0, Math.PI * 2);
                ctx.fillStyle = '#00FF00';
                ctx.fill();
            }
        });
        ctx.restore();

    }, [stars, offsetX, offsetY, scale, hoveredStar]);

    // --- ANIMATION LOOP ---
    useEffect(() => {
        const animate = () => {
            drawScene();
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [drawScene]);

    // --- RENDER ---
    return (
        <div className="w-screen h-screen bg-black overflow-hidden relative font-mono text-white">
            <canvas
                ref={canvasRef}
                className="w-full h-full block cursor-crosshair touch-none" // <-- touch-none added
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                onClick={handleClick}
                onContextMenu={handleContextMenu}

                /* New Mobile Listeners */
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            />
            <button
                onClick={() => {
                    setOffsetX(0);
                    setOffsetY(0);
                    setScale(1);
                }}
                className="absolute top-6 right-6 z-40 bg-gray-950/80 hover:bg-gray-800 text-gray-400 hover:text-white px-4 py-2 rounded border border-gray-800 shadow-lg backdrop-blur-sm transition-all text-xs tracking-wider uppercase font-semibold"
            >
                Recenter HUD
            </button>
            <NavigationFooter visibleStars={stars} />
            {/* DOM-based Hover Tooltip */}
            {/* DOM-based Hover Tooltip */}
            {hoveredStar && (
                <div
                    className="absolute z-40 pointer-events-none bg-gray-900/95 border border-gray-700 p-3 rounded-lg shadow-xl shadow-black/80 backdrop-blur-md transition-opacity duration-150"
                    style={{
                        left: hoveredStar.clientX + 15,
                        top: hoveredStar.clientY + 15
                    }}
                >
                    <div className="border-b border-gray-700 pb-2 mb-2 flex items-center gap-2">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: hoveredStar.color, boxShadow: `0 0 8px ${hoveredStar.color}` }}
                        ></span>
                        <h3 className="text-white font-bold text-lg leading-none tracking-wide">{hoveredStar.name}</h3>
                    </div>

                    <ul className="text-xs space-y-1.5 text-gray-300 font-sans">
                        <li className="flex gap-2">
                            <span className="text-gray-500 w-28 shrink-0">Class:</span>
                            <span className="font-mono text-gray-200">{hoveredStar.type}</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-gray-500 w-28 shrink-0">Sector:</span>
                            <span className="font-mono text-gray-400">{hoveredStar.id.replace(/_/g, ' ')}</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-gray-500 w-28 shrink-0">Planetary Bodies:</span>
                            <span className="font-mono text-blue-400 font-semibold">{getStarTooltip(hoveredStar).planetCount}</span>
                        </li>
                        <li className="flex gap-2 pt-1 border-t border-gray-800 mt-1">
                            <span className="text-gray-500 w-28 shrink-0">Control:</span>
                            <span className="text-purple-400 truncate max-w-[140px]" title={getStarTooltip(hoveredStar).faction}>
                                {getStarTooltip(hoveredStar).faction}
                            </span>
                        </li>
                    </ul>
                </div>
            )}
            {showSystemMap && activeSystem && (
                <div className="absolute inset-0 z-50 bg-gray-900/95 backdrop-blur-sm overflow-hidden">
                    <StarSystemViewer
                        activeSystem={activeSystem}
                        onClose={() => setShowSystemMap(false)}
                    />
                </div>
            )}

        </div>
    );
};

export default StarMap;