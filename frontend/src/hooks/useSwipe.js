import { useState, useRef } from "react";

/**
 * Returns drag state + event handlers for swipe gesture.
 * position: { x, y }
 * isDragging: bool
 * reset(): set position back to 0,0
 * handlers: spread onto the draggable element
 */
export default function useSwipe() {
  const [position, setPosition]     = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startRef   = useRef({ x: 0, y: 0 });
  const baseRef    = useRef({ x: 0, y: 0 });

  const getXY = (e) => {
    if (e.touches && e.touches.length) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const onStart = (e) => {
    setIsDragging(true);
    startRef.current = getXY(e);
    baseRef.current  = position;
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const { x, y } = getXY(e);
    setPosition({
      x: baseRef.current.x + (x - startRef.current.x),
      y: baseRef.current.y + (y - startRef.current.y),
    });
  };

  const onEnd = () => setIsDragging(false);

  const reset = () => setPosition({ x: 0, y: 0 });

  return {
    position,
    isDragging,
    reset,
    handlers: {
      onMouseDown:  onStart,
      onMouseMove:  onMove,
      onMouseUp:    onEnd,
      onMouseLeave: onEnd,
      onTouchStart: onStart,
      onTouchMove:  onMove,
      onTouchEnd:   onEnd,
    },
  };
}
