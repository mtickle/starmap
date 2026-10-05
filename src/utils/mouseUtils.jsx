let lastTouchDistance = null;

// ==========================================
// MOUSE HANDLERS (Desktop)
// ==========================================

export const createHandleMouseDown = (setIsDragging, setDragStart) => (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
};

export const createHandleMouseMove = ({
    canvasRef, offsetX, offsetY, scale, isDragging,
    setOffsetX, setOffsetY, dragStart, setDragStart,
    stars, setHoveredStar
}) => (e) => {
    if (isDragging) {
        // Panning map - removed the "/ scale" division
        const dx = (e.clientX - dragStart.x);
        const dy = (e.clientY - dragStart.y);
        setOffsetX(offsetX + dx);
        setOffsetY(offsetY + dy);
        setDragStart({ x: e.clientX, y: e.clientY });
    } else {
        // Hover detection
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - canvas.width / 2 - offsetX) / scale;
        const mouseY = (e.clientY - rect.top - canvas.height / 2 - offsetY) / scale;

        const hovered = stars.find(star => {
            const dx = mouseX - star.x;
            const dy = mouseY - star.y;
            return Math.sqrt(dx * dx + dy * dy) < star.size + 4 / scale;
        });

        if (hovered) {
            setHoveredStar({ ...hovered, clientX: e.clientX, clientY: e.clientY });
        } else {
            setHoveredStar(null);
        }
    }
};

export const createHandleMouseUp = (setIsDragging) => () => {
    setIsDragging(false);
};

export const createHandleWheel = (scale, setScale) => (e) => {
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    // Constrain zoom between 0.1x (zoomed out) and 5x (zoomed in)
    const newScale = Math.min(Math.max(0.1, scale + delta), 5);
    setScale(newScale);
};

export const createHandleContextMenu = () => (e) => {
    e.preventDefault();
};


// ==========================================
// TOUCH HANDLERS (Mobile)
// ==========================================

export const createHandleTouchStart = (setIsDragging, setDragStart) => (e) => {
    if (e.touches.length === 1) {
        // Single finger: Start panning
        setIsDragging(true);
        setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
        // Two fingers: Start pinch-to-zoom
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
    }
};

export const createHandleTouchMove = ({
    offsetX, offsetY, scale, isDragging,
    setOffsetX, setOffsetY, dragStart, setDragStart,
    setScale
}) => (e) => {
    if (e.touches.length === 1 && isDragging) {
        // Single finger: Pan the map - removed the "/ scale" division
        const dx = (e.touches[0].clientX - dragStart.x);
        const dy = (e.touches[0].clientY - dragStart.y);
        setOffsetX(offsetX + dx);
        setOffsetY(offsetY + dy);
        setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
        // Two fingers: Zoom the map
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        if (lastTouchDistance) {
            const zoomSensitivity = 0.005; // Slightly faster than mouse wheel
            const delta = (currentDistance - lastTouchDistance) * zoomSensitivity;
            const newScale = Math.min(Math.max(0.1, scale + delta), 5);
            setScale(newScale);
        }
        lastTouchDistance = currentDistance;
    }
};

export const createHandleTouchEnd = (setIsDragging) => (e) => {
    if (e.touches.length < 2) {
        // Reset pinch tracker if a finger lifts
        lastTouchDistance = null;
    }
    if (e.touches.length === 0) {
        // Stop panning when all fingers lift
        setIsDragging(false);
    }
};