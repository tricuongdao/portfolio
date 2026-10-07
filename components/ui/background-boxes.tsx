"use client";
import React, { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The contact page backdrop used to be 150 x 100 = 15,000 motion.div cells,
 * 3,750 of them containing an inline SVG. That produced a 2.2 MB HTML document
 * and 15,000 components to hydrate, all for a decorative grid.
 *
 * The grid lines and the "+" marks are now painted by CSS on a single element
 * (see .boxes-grid in globals.css) and the hover highlight is one div that
 * moves between cells. Same look, a handful of nodes instead of 15,000.
 */

const CELL_WIDTH = 64;
const CELL_HEIGHT = 32;

const COLORS = [
  "#93c5fd",
  "#f9a8d4",
  "#86efac",
  "#fde047",
  "#fca5a5",
  "#d8b4fe",
  "#93c5fd",
  "#a5b4fc",
  "#c4b5fd",
];

// The old cell grid was 150 cells across and 100 down, so it spilled well past
// the container. The CSS layer covers exactly the same area.
const GRID_WIDTH = 150 * CELL_WIDTH; // 9600px
const GRID_HEIGHT = 100 * CELL_HEIGHT; // 3200px

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const highlightRef = useRef<HTMLDivElement>(null);
  const lastCell = useRef<string>("");

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const highlight = highlightRef.current;
    if (!highlight) return;

    // offsetX/offsetY are already in this element's local space, so the skew
    // and scale are handled by the browser.
    const col = Math.floor(event.nativeEvent.offsetX / CELL_WIDTH);
    const row = Math.floor(event.nativeEvent.offsetY / CELL_HEIGHT);
    const cellKey = `${col}:${row}`;
    if (cellKey === lastCell.current) return;
    lastCell.current = cellKey;

    highlight.style.transform = `translate(${col * CELL_WIDTH}px, ${row * CELL_HEIGHT}px)`;
    highlight.style.backgroundColor =
      COLORS[Math.floor(Math.random() * COLORS.length)];
    highlight.style.opacity = "1";
  }, []);

  const handlePointerLeave = useCallback(() => {
    lastCell.current = "";
    if (highlightRef.current) highlightRef.current.style.opacity = "0";
  }, []);

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        className,
      )}
      {...rest}
    >
      {/* The painted grid, sized to the area the old cells covered. */}
      <div
        className="boxes-grid absolute left-4 top-4"
        style={{ width: GRID_WIDTH, height: GRID_HEIGHT }}
      >
        <div
          ref={highlightRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-8 w-16 opacity-0 transition-opacity duration-200"
        />
      </div>
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
