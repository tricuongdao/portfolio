"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence } from "motion/react";
import React, { useRef, useState, useEffect, useMemo } from "react";

export const BackgroundBeamsWithCollision = ({
  children = null,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const parentRef = useRef<HTMLDivElement>(null!);

  const beams = [
    {
      initialX: 10,
      translateX: 10,
      duration: 7,
      repeatDelay: 3,
      delay: 2,
    },
    {
      initialX: 600,
      translateX: 600,
      duration: 3,
      repeatDelay: 3,
      delay: 4,
    },
    {
      initialX: 100,
      translateX: 100,
      duration: 7,
      repeatDelay: 7,
      className: "h-6",
    },
    {
      initialX: 400,
      translateX: 400,
      duration: 5,
      repeatDelay: 14,
      delay: 4,
    },
    {
      initialX: 800,
      translateX: 800,
      duration: 11,
      repeatDelay: 2,
      className: "h-20",
    },
    {
      initialX: 1000,
      translateX: 1000,
      duration: 4,
      repeatDelay: 2,
      className: "h-12",
    },
    {
      initialX: 1200,
      translateX: 1200,
      duration: 6,
      repeatDelay: 4,
      delay: 2,
      className: "h-6",
    },
  ];

  return (
    <div
      ref={parentRef}
      className={cn(
        "h-96 md:h-[40rem] bg-gradient-to-b from-neutral-950 to-zinc-950 relative flex items-center w-full justify-center overflow-hidden",
        // h-screen if you want bigger
        className,
      )}
    >
      {beams.map((beam) => (
        <CollisionMechanism
          key={beam.initialX + "beam-idx"}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}

      {children}
      <div
        ref={containerRef}
        className="absolute bottom-0 bg-neutral-100 w-full inset-x-0 pointer-events-none"
        style={{
          boxShadow:
            "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
        }}
      ></div>
    </div>
  );
};

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement>;
    parentRef: React.RefObject<HTMLDivElement>;
    beamOptions?: {
      initialX?: number;
      translateX?: number;
      initialY?: number;
      translateY?: number;
      rotate?: number;
      className?: string;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
    };
  }
>(({ parentRef, containerRef, beamOptions = {} }, ref) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({
    detected: false,
    coordinates: null,
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    let containerRect: DOMRect | null = null;
    let parentRect: DOMRect | null = null;
    let isVisible = true;

    // The container and parent never move while the section is on screen, so
    // measure them once instead of on every tick.
    const measureStaticRects = () => {
      containerRect = containerRef.current?.getBoundingClientRect() ?? null;
      parentRect = parentRef.current?.getBoundingClientRect() ?? null;
    };
    measureStaticRects();

    const checkCollision = () => {
      if (
        !isVisible ||
        cycleCollisionDetected ||
        !beamRef.current ||
        !containerRect ||
        !parentRect
      ) {
        return;
      }

      // One geometry read per tick instead of three.
      const beamRect = beamRef.current.getBoundingClientRect();

      if (beamRect.bottom >= containerRect.top) {
        const relativeX = beamRect.left - parentRect.left + beamRect.width / 2;
        const relativeY = beamRect.bottom - parentRect.top;

        setCollision({
          detected: true,
          coordinates: { x: relativeX, y: relativeY },
        });
        setCycleCollisionDetected(true);
      }
    };

    // 100ms is plenty for a beam that takes seconds to fall, and it keeps the
    // forced layout reads away from the frame the user is scrolling on.
    const animationInterval = setInterval(checkCollision, 100);

    const observer =
      typeof IntersectionObserver !== "undefined" && parentRef.current
        ? new IntersectionObserver(
            ([entry]) => {
              isVisible = entry.isIntersecting;
              if (isVisible) measureStaticRects();
            },
            { rootMargin: "100px" },
          )
        : null;
    observer?.observe(parentRef.current!);

    const handleResize = () => measureStaticRects();
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(animationInterval);
      observer?.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [cycleCollisionDetected, containerRef, parentRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 2000);

      setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);
    }
  }, [collision]);

  /*
    The falling beam is a pure translateY. Driving it with the Web Animations
    API instead of Motion takes it off the JavaScript main thread entirely:
    previously each of the seven beams wrote an inline transform every frame.
    Motion's duration/repeatDelay pair is reproduced by holding the end
    position for the remainder of the cycle.
  */
  useEffect(() => {
    const beam = beamRef.current;
    if (!beam || typeof beam.animate !== "function") return;

    const fall = (beamOptions.duration || 8) * 1000;
    const hold = (beamOptions.repeatDelay || 0) * 1000;
    const fromY = beamOptions.initialY ?? -200;
    const toY = beamOptions.translateY ?? 1800;
    // initialX positions the beam horizontally and never changes, so it rides
    // along in every keyframe.
    const x = beamOptions.initialX ?? 0;

    const animation = beam.animate(
      [
        { transform: `translateX(${x}px) translateY(${fromY}px)`, offset: 0 },
        { transform: `translateX(${x}px) translateY(${toY}px)`, offset: fall / (fall + hold) },
        { transform: `translateX(${x}px) translateY(${toY}px)`, offset: 1 },
      ],
      {
        duration: fall + hold,
        delay: (beamOptions.delay || 0) * 1000,
        iterations: Infinity,
        easing: "linear",
        fill: "both",
      },
    );

    return () => animation.cancel();
  }, [
    beamKey,
    beamOptions.duration,
    beamOptions.repeatDelay,
    beamOptions.delay,
    beamOptions.initialX,
    beamOptions.initialY,
    beamOptions.translateY,
  ]);

  return (
    <>
      <div
        key={beamKey}
        ref={beamRef}
        className={cn(
          "absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-yellow-500 via-green-500 to-transparent",
          beamOptions.className,
        )}
        style={{
          transform: `translateX(${beamOptions.initialX ?? 0}px) translateY(${beamOptions.initialY ?? -200}px)`,
        }}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            className=""
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
});

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  /*
    The sparks used to be 20 Motion spans each animating x, y and opacity from
    JavaScript: roughly 1,900 inline-style writes per second while an explosion
    played. They are pure scatter-and-fade motion, so CSS keyframes on
    transform/opacity now drive them on the compositor with zero JS per frame.
    Values are generated once per explosion, not on every render.
  */
  const spans = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        id: index,
        directionX: Math.floor(Math.random() * 80 - 40),
        directionY: Math.floor(Math.random() * -50 - 10),
        duration: Math.random() * 1.5 + 0.5,
      })),
    [],
  );

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <div className="animate-explosion-flash absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-green-500 to-transparent blur-sm" />
      {spans.map((span) => (
        <span
          key={span.id}
          className="animate-spark-scatter absolute h-1 w-1 rounded-full bg-gradient-to-b from-green-300 to-green-500"
          style={
            {
              "--spark-x": `${span.directionX}px`,
              "--spark-y": `${span.directionY}px`,
              "--spark-duration": `${span.duration}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};
export default BackgroundBeamsWithCollision;
