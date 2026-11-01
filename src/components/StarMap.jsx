import StarSystemViewer from '@components/StarSystemViewer';
import { useDeterministicStarField } from '@hooks/useDeterministicStarField.js';
import { useMapHandlers } from '@utils/mouseUtils.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import NavigationFooter from './NavigationFooter.jsx';
import NavigationHeader from './NavigationHeader.jsx';
import WelcomeModal from './WelcomeModal.jsx';

// Cubic easing function for the slow-fast-slow cinematic pan
const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const getStarTooltip = (star) => {
    if (!star) return null;

    const totalMoons = star.fullData?.planets?.reduce(
        (sum, planet) => sum + (planet.moons?.length || 0),
        0
    ) || 0;

    return {
        name: star.name,
        type: star.type,
        color: star.color,
        faction: star.faction?.name || 'Uncharted',
        coordinates: star.id,
        planetCount: star.fullData?.planets?.length || 0,
        moonCount: totalMoons,
        stationCount: star.fullData?.stations?.length || 0,
    };
};

const StarMap = () => {
    // --- STATE MANAGEMENT ---
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [scale, setScale] = useState(1);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    // --- FILTER STATE ---
    const [filters, setFilters] = useState({
        starClass: [],
        faction: [],
        hasCiv: false,
        hasBiosphere: false,
        hasRare: false,
    });

    const handleResetFilters = () => {
        setFilters({
            starClass: [],
            faction: [],
            hasCiv: false,
            hasBiosphere: false,
            hasRare: false,
        });
    };

    const rawStars = useDeterministicStarField({
        offsetX,
        offsetY,
        canvasWidth: canvasSize.width,
        canvasHeight: canvasSize.height,
        scale,
    });

    // --- FILTER PREDICATE LOGIC ---
    const stars = rawStars.filter((star) => {
        const fullData = star.fullData || {};
        const planets = fullData.planets || [];

        // Star Class filter (e.g. O, B, A, F, G, K, M)
        if (filters.starClass.length > 0 && !filters.starClass.includes(star.type)) {
            return false;
        }

        // Faction filter
        const starFactionName = star.faction?.name || 'Independent';
        if (filters.faction.length > 0 && !filters.faction.includes(starFactionName)) {
            return false;
        }

        // Civilization filter (Inhabited)
        if (filters.hasCiv) {
            const hasSettlementsOrCiv = planets.some(p => (p.settlements?.length > 0) || p.inhabitants || p.economy);
            if (!hasSettlementsOrCiv) return false;
        }

        // Biosphere filter
        if (filters.hasBiosphere) {
            const hasBio = planets.some(p => (p.floraList?.length > 0) || (p.faunaList?.length > 0));
            if (!hasBio) return false;
        }

        // Rare Deposits filter
        if (filters.hasRare) {
            const hasRareRes = planets.some(p => p.resourceList?.some(r => r.rarity?.toLowerCase() === 'rare'));
            if (!hasRareRes) return false;
        }

        return true;
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
    const panAnimationRef = useRef(null);
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

        return () => {
            resizeObserver.unobserve(container);
            if (panAnimationRef.current) cancelAnimationFrame(panAnimationRef.current);
        };
    }, []);

    // --- MOUSE HANDLERS ---
    const mapHandlers = useMapHandlers({
        canvasRef, stars, isDragging, setIsDragging,
        dragStart, setDragStart, offsetX, setOffsetX,
        offsetY, setOffsetY, scale, setScale, setHoveredStar
    });

    const handleClick = useCallback((e) => {
        if (isDragging) return;

        const dragDistance = Math.sqrt(
            Math.pow(e.clientX - dragStart.rawX, 2) +
            Math.pow(e.clientY - dragStart.rawY, 2)
        );

        if (dragDistance > 5) {
            return; // Abort the click, the user was dragging the map
        }

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

        setActiveSystem(clickedStar.fullData);
        setShowSystemMap(true);

        const visited = JSON.parse(localStorage.getItem('visitedStars') || '[]');
        if (!visited.includes(clickedStar.id)) {
            visited.push(clickedStar.id);
            localStorage.setItem('visitedStars', JSON.stringify(visited));
        }
    }, [isDragging, offsetX, offsetY, scale, stars]);

    // --- NAVIGATION LOGIC ---
    const animatePanTo = (targetX, targetY, duration = 1800) => {
        if (panAnimationRef.current) cancelAnimationFrame(panAnimationRef.current);

        const startTime = performance.now();
        const startX = offsetX;
        const startY = offsetY;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);

            setOffsetX(startX + (targetX - startX) * easedProgress);
            setOffsetY(startY + (targetY - startY) * easedProgress);

            if (progress < 1) {
                panAnimationRef.current = requestAnimationFrame(animate);
            }
        };

        panAnimationRef.current = requestAnimationFrame(animate);
    };

    const handleJumpToSystem = (systemId) => {
        const coordRegex = /X:(-?\d+)_Y:(-?\d+)/;
        const match = String(systemId).match(coordRegex);

        if (match) {
            const GRID_SPACING = 100;
            const targetOffsetX = parseInt(match[1], 10) * -GRID_SPACING;
            const targetOffsetY = parseInt(match[2], 10) * -GRID_SPACING;

            animatePanTo(targetOffsetX, targetOffsetY, 1800);

            setShowSystemMap(false);
            setActiveSystem(null);
        }
    };

    // --- DRAWING LOGIC ---
    const drawScene = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        ctx.clearRect(0, 0, width, height);
        const backgroundGradient = ctx.createLinearGradient(0, 0, width, height);
        backgroundGradient.addColorStop(0, '#0a0a14');
        backgroundGradient.addColorStop(0.5, '#1a1a2e');
        backgroundGradient.addColorStop(1, '#0a0a14');
        ctx.fillStyle = backgroundGradient;
        ctx.fillRect(0, 0, width, height);

        backgroundStars.current.forEach((star, idx) => {
            const depthSpeed = idx % 2 === 0 ? 0.05 : 0.15;
            const px = ((star.x + offsetX * depthSpeed) % width + width) % width;
            const py = ((star.y + offsetY * depthSpeed) % height + height) % height;

            ctx.beginPath();
            ctx.arc(px, py, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });

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

        stars.forEach((star) => {
            const minX = (-width / 2 - offsetX) / scale - 30;
            const maxX = (width / 2 - offsetX) / scale + 30;
            const minY = (-height / 2 - offsetY) / scale - 30;
            const maxY = (height / 2 - offsetY) / scale + 30;

            if (star.x < minX || star.x > maxX || star.y < minY || star.y > maxY) {
                return;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = star.color;

            if (scale > 0.5) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = star.color;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fill();
            ctx.shadowBlur = 0;

            if (scale > 0.5) {
                ctx.fillStyle = '#FFFFFF';
                ctx.font = `${14 / scale}px Courier New, monospace`;
                ctx.textAlign = 'center';
                ctx.fillText(star.name, star.x, star.y - star.size - 6 / scale);

                if (home.id === star.id) {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size + 4 / scale, 0, Math.PI * 2);
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 1 / scale;
                    ctx.stroke();
                }
            }

            if (scale > 0.2 && visited.includes(star.id)) {
                ctx.beginPath();
                ctx.arc(star.x, star.y + star.size + 5 / scale, 2 / scale, 0, Math.PI * 2);
                ctx.fillStyle = '#00FF00';
                ctx.fill();
            }
        });
        ctx.restore();

    }, [stars, offsetX, offsetY, scale, hoveredStar]);

    // --- STABLE ANIMATION LOOP REF ---
    const drawSceneRef = useRef(drawScene);
    useEffect(() => {
        drawSceneRef.current = drawScene;
    }, [drawScene]);

    useEffect(() => {
        const animate = () => {
            if (drawSceneRef.current) {
                drawSceneRef.current();
            }
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, []); // Runs once on mount, avoiding teardown/restart loops

    // --- RENDER ---
    return (
        <div className="w-screen h-screen bg-black overflow-hidden relative font-mono text-white">

            <WelcomeModal />

            <canvas
                ref={canvasRef}
                className="w-full h-full block cursor-crosshair touch-none"
                {...mapHandlers}
                onClick={handleClick}
            />

            <NavigationHeader
                setOffsetX={setOffsetX}
                setOffsetY={setOffsetY}
                setScale={setScale}
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={handleResetFilters}
            />
            <NavigationFooter visibleStars={stars} currentFocusId={activeSystem?.id} onJumpToSystem={handleJumpToSystem} />

            {/* --- TOOLTIP & SYSTEM VIEWER --- */}
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

                    <ul className="text-sm space-y-1 text-gray-300 font-sans">
                        <li className="flex gap-2">
                            <span className="text-gray-500 w-20 shrink-0">Class:</span>
                            <span className="font-mono text-gray-200">{hoveredStar.type}</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-gray-500 w-20 shrink-0">Sector:</span>
                            <span className="font-mono text-gray-400">{hoveredStar.id.replace(/_/g, ' ')}</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-gray-500 w-20 shrink-0">Planets:</span>
                            <span className="font-mono text-blue-400 font-semibold">{getStarTooltip(hoveredStar).planetCount}</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-gray-500 w-20 shrink-0">Moons:</span>
                            <span className="font-mono text-blue-400 font-semibold">{getStarTooltip(hoveredStar).moonCount}</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-gray-500 w-20 shrink-0">Stations:</span>
                            <span className="font-mono text-blue-400 font-semibold">{getStarTooltip(hoveredStar).stationCount}</span>
                        </li>
                        <li className="flex gap-2 pt-1 border-t border-gray-800 mt-1">
                            <span className="text-gray-500 w-20 shrink-0">Control:</span>
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