export const createHandleMouseDown = (setIsDragging, setDragStart) => (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
};

export const createHandleMouseMove = ({
    canvasRef,
    offsetX,
    offsetY,
    scale,
    isDragging,
    setOffsetX,
    setOffsetY,
    dragStart,
    setDragStart,
    stars,
    setHoveredStar
}) => (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - canvas.width / 2 - offsetX) / scale;
    const mouseY = (e.clientY - rect.top - canvas.height / 2 - offsetY) / scale;

    if (isDragging) {
        setOffsetX(offsetX + (e.clientX - dragStart.x) / scale);
        setOffsetY(offsetY + (e.clientY - dragStart.y) / scale);
        setDragStart({ x: e.clientX, y: e.clientY });
    } else {
        const hovered = stars.find(star => {
            const dx = mouseX - star.x;
            const dy = mouseY - star.y;
            return Math.sqrt(dx * dx + dy * dy) < star.size + 4;
        });

        // Uncommented and updated to pass the exact mouse coordinates for the tooltip
        setHoveredStar(hovered ? { ...hovered, clientX: e.clientX, clientY: e.clientY } : null);
    }
};

export const createHandleMouseUp = (setIsDragging) => () => setIsDragging(false);

export const createHandleWheel = (scale, setScale) => (e) => {
    const zoomSpeed = 0.1;
    const newScale = Math.min(Math.max(scale - e.deltaY * zoomSpeed * 0.001, 0.5), 2);
    setScale(newScale);
};

export const createHandleClick = ({
    isDragging,
    canvasRef,
    offsetX,
    offsetY,
    scale,
    stars,
    setActiveSystem,
    setShowSystemMap
}) => (e) => {
    if (isDragging) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - canvas.width / 2 - offsetX) / scale;
    const mouseY = (e.clientY - rect.top - canvas.height / 2 - offsetY) / scale;

    const clickedStar = stars.find(star => {
        const dx = mouseX - star.x;
        const dy = mouseY - star.y;
        return Math.sqrt(dx * dx + dy * dy) < star.size + 4;
    });

    if (!clickedStar) return;

    try {
        // Retrieve the deterministic payload directly from the star object
        const fullSystem = clickedStar.fullData;

        setActiveSystem(fullSystem);
        setShowSystemMap(true);

        const visited = JSON.parse(localStorage.getItem('visitedStars') || '[]');
        // Updated to use fullSystem.id instead of starId
        if (!visited.includes(fullSystem.id)) {
            visited.push(fullSystem.id);
            localStorage.setItem('visitedStars', JSON.stringify(visited));
        }

    } catch (error) {
        console.error("Failed to load system details from memory:", error);
    }
};

export const createHandleContextMenu = ({
    canvasRef,
    offsetX,
    offsetY,
    scale,
    stars
}) => (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - canvas.width / 2 - offsetX) / scale;
    const mouseY = (e.clientY - rect.top - canvas.height / 2 - offsetY) / scale;

    const clickedStar = stars.find(star => {
        const dx = mouseX - star.x;
        const dy = mouseY - star.y;
        return Math.sqrt(dx * dx + dy * dy) < star.size + 4;
    });

    if (clickedStar) {
        localStorage.setItem('homeSystem', JSON.stringify({
            id: clickedStar.id,
            name: clickedStar.name,
            x: clickedStar.x,
            y: clickedStar.y
        }));
        alert(`${clickedStar.name} is now your home system.`);
    }
};