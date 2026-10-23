import { useCallback } from 'react';

export const useMapHandlers = ({
    canvasRef, stars, isDragging, setIsDragging,
    dragStart, setDragStart, offsetX, setOffsetX,
    offsetY, setOffsetY, scale, setScale, setHoveredStar
}) => {

    const onMouseDown = useCallback((e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
    }, [offsetX, offsetY, setIsDragging, setDragStart]);

    const onMouseMove = useCallback((e) => {
        if (isDragging) {
            setOffsetX(e.clientX - dragStart.x);
            setOffsetY(e.clientY - dragStart.y);
            setHoveredStar(null);
            return;
        }

        if (!canvasRef.current || !stars) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - canvas.width / 2 - offsetX) / scale;
        const mouseY = (e.clientY - rect.top - canvas.height / 2 - offsetY) / scale;

        const foundStar = stars.find(star => {
            const dx = mouseX - star.x;
            const dy = mouseY - star.y;
            return Math.sqrt(dx * dx + dy * dy) < star.size + 4 / scale;
        });

        if (foundStar) {
            setHoveredStar({ ...foundStar, clientX: e.clientX, clientY: e.clientY });
        } else {
            setHoveredStar(null);
        }
    }, [isDragging, dragStart, offsetX, offsetY, scale, stars, canvasRef, setOffsetX, setOffsetY, setHoveredStar]);

    const onMouseUp = useCallback(() => setIsDragging(false), [setIsDragging]);

    const onWheel = useCallback((e) => {
        setScale(prev => Math.max(0.1, Math.min(prev - e.deltaY * 0.001, 5)));
    }, [setScale]);

    const onTouchStart = useCallback((e) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            setDragStart({ x: e.touches[0].clientX - offsetX, y: e.touches[0].clientY - offsetY });
        }
    }, [offsetX, offsetY, setIsDragging, setDragStart]);

    const onTouchMove = useCallback((e) => {
        if (isDragging && e.touches.length === 1) {
            setOffsetX(e.touches[0].clientX - dragStart.x);
            setOffsetY(e.touches[0].clientY - dragStart.y);
        }
    }, [isDragging, dragStart, setOffsetX, setOffsetY]);

    const onTouchEnd = useCallback(() => setIsDragging(false), [setIsDragging]);

    const onContextMenu = useCallback((e) => e.preventDefault(), []);

    return {
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onMouseLeave: onMouseUp,
        onWheel,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        onTouchCancel: onTouchEnd,
        onContextMenu
    };
};