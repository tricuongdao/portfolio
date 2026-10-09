"use client";

import React, { useEffect, useRef, useState } from "react";
import { customCursorStyles as s } from "@/public/dummyStyles";

/**
 * Site-wide custom cursor.
 *
 * Design
 * ------
 * A precise dot that tracks the pointer 1:1, plus a ring that trails slightly
 * behind it and stretches along its direction of travel. The ring reacts to
 * whatever is underneath: it grows over links and buttons, collapses into a
 * text caret over form fields, and becomes a labelled pill over targets marked
 * with `data-cursor-label`.
 *
 * Opting out
 * ----------
 * `data-cursor-label="View"`  labelled state (e.g. the certificate cards)
 * `data-cursor="text"`        force the caret state
 * `data-cursor="pointer"`     force the interactive state
 * `data-cursor="none"`        hide the custom cursor for a subtree, for places
 *                             that draw their own follower (project cards)
 *
 * Responsiveness
 * --------------
 * Only mounted for `(hover: hover) and (pointer: fine)`. Touch and hybrid
 * devices keep their native behaviour and download none of this markup's
 * behaviour. Under `prefers-reduced-motion` the trail and the stretch are
 * dropped: the ring tracks 1:1 and stays a circle, but the states still work.
 *
 * Performance
 * -----------
 * Nothing here re-renders React on pointer movement. The position of both
 * nodes is written straight to `style.transform` — the dot inside the
 * `pointermove` handler, the ring from a rAF loop that stops itself once the
 * ring has settled. React state changes only when the *state* changes, which
 * happens on element boundaries.
 */

/** Visual state, derived from the element under the pointer. */
type CursorState = "default" | "interactive" | "text" | "label" | "hidden";

/** Ring diameter in px — mirrors `ringWrapper` (h-8 w-8) in dummyStyles. */
const RING_SIZE = 32;
/** Dot diameter in px — mirrors `dot` (h-1.5 w-1.5) in dummyStyles. */
const DOT_SIZE = 6;

/** How much of the remaining distance the ring closes per frame (1 = no trail). */
const TRAIL = 0.25;
/** Pointer speed in px/frame that produces the maximum stretch. */
const STRETCH_AT = 70;
/** Maximum elongation of the ring while moving fast. */
const STRETCH_MAX = 0.4;
/** Below this the ring is considered settled: snap it and stop the loop. */
const SETTLED = 0.1;
/** Hit-test sampling used to detect that the pointer went inside an iframe. */
const PROBE_STEP = 8;
/** Last-move distance below which the pointer cannot have jumped far. */
const PROBE_MIN_TRAVEL = 8;
/** How much further the pointer could plausibly have carried on unseen. */
const PROBE_REACH_FACTOR = 2.5;
/** Upper bound on the probe distance. */
const PROBE_MAX_REACH = 120;

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button",
  "summary",
  "select",
  "[role='button']",
  "[role='link']",
  "[role='tab']",
  "[data-cursor='pointer']",
].join(",");

const TEXT_SELECTOR = [
  "textarea",
  "[contenteditable='true']",
  "[data-cursor='text']",
  "input:not([type='checkbox']):not([type='radio']):not([type='submit']):not([type='button']):not([type='range']):not([type='file'])",
].join(",");

/** Subtrees that draw their own follower and want the custom cursor out of the way. */
const OPT_OUT_SELECTOR = "[data-cursor='none']";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState("");
  const [pressed, setPressed] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const stretchRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);

  // Enable only where a cursor replacement makes sense.
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setMounted(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Hide the native cursor only once we are actually drawing our own.
  useEffect(() => {
    if (!mounted || !active) return;
    const body = document.body;
    body.classList.add("has-custom-cursor");
    return () => body.classList.remove("has-custom-cursor");
  }, [mounted, active]);

  useEffect(() => {
    if (!mounted) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const stretch = stretchRef.current;
    if (!dot || !ring || !stretch) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const trail = reduceMotion ? 1 : TRAIL;

    let pointerX = -100;
    let pointerY = -100;
    let ringX = pointerX;
    let ringY = pointerY;
    let prevX = ringX;
    let prevY = ringY;
    let stretchAmount = 0;
    let angle = 0;
    let frame = 0;
    let animating = false;
    let started = false;
    // Last pointer delta, used to work out where a pointer that stopped
    // sending events was heading.
    let lastDeltaX = 0;
    let lastDeltaY = 0;

    // Mirror of the React state inside the effect, so handlers can react to a
    // transition without reading (or writing) state during a render.
    let lastState: CursorState = "default";

    const applyState = (next: CursorState) => {
      // Coming back from hidden, re-centre the ring instead of animating it
      // across the screen from wherever it was left.
      if (lastState === "hidden" && next !== "hidden" && started) snapRing();
      lastState = next;
      setState(next);
    };

    const evaluate = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        applyState("default");
        return;
      }
      // Crossed into an iframe: we stop receiving events, so step aside.
      if (target.closest(OPT_OUT_SELECTOR) || target.closest("iframe")) {
        applyState("hidden");
        return;
      }

      const labelled = target.closest<HTMLElement>("[data-cursor-label]");
      const interactive = target.closest(INTERACTIVE_SELECTOR);

      // A control nested inside a labelled card — the "Visit" button on a
      // project card, say — keeps its own pointer state. The label belongs to
      // the card body, which is the click target; a control that *is* the
      // labelled element (the certificate cards are single buttons) keeps the
      // label.
      if (interactive && interactive !== labelled) {
        applyState("interactive");
        return;
      }
      if (labelled) {
        setLabel(labelled.dataset.cursorLabel ?? "");
        applyState("label");
        return;
      }
      if (target.closest(TEXT_SELECTOR)) {
        applyState("text");
        return;
      }
      applyState("default");
    };

    const drawDot = () => {
      dot.style.transform = `translate3d(${pointerX - DOT_SIZE / 2}px, ${pointerY - DOT_SIZE / 2}px, 0)`;
    };

    const drawRing = () => {
      ring.style.transform = `translate3d(${ringX - RING_SIZE / 2}px, ${ringY - RING_SIZE / 2}px, 0)`;
    };

    // Jump the ring under the pointer instead of letting it fly in from
    // wherever it was left when the cursor was last hidden.
    const snapRing = () => {
      ringX = pointerX;
      ringY = pointerY;
      prevX = ringX;
      prevY = ringY;
      stretchAmount = 0;
      stretch.style.transform = "";
      drawRing();
    };

    /**
     * Cross-origin iframes swallow every pointer event, so once the pointer is
     * inside the certificate viewer's PDF frame the parent document hears
     * nothing at all — no move, no over, no hover, not even from the frame's own
     * (same-origin) document, because the PDF plugin eats the events first. The
     * only remaining signal is that events stopped, so when the ring settles,
     * walk forwards along the last direction of travel and see whether the
     * pointer carried on into a frame.
     *
     * The walk is capped at a multiple of the last move's length: a pointer that
     * was doing 10px per event cannot be 80px away, so a user who simply stopped
     * moving near a frame is not mistaken for one who went inside it. Runs once
     * per stop, never while the pointer is moving.
     */
    const probeForIframe = () => {
      if (lastState === "hidden") return;
      const distance = Math.hypot(lastDeltaX, lastDeltaY);
      // A deliberate stop decelerates first; only movement cut off mid-flight
      // can have disappeared into a frame.
      if (distance < PROBE_MIN_TRAVEL) return;
      const reach = Math.min(distance * PROBE_REACH_FACTOR, PROBE_MAX_REACH);
      const unitX = lastDeltaX / distance;
      const unitY = lastDeltaY / distance;
      for (let travelled = PROBE_STEP; travelled <= reach; travelled += PROBE_STEP) {
        const point = document.elementFromPoint(
          pointerX + unitX * travelled,
          pointerY + unitY * travelled,
        );
        if (point && point.tagName === "IFRAME") {
          applyState("hidden");
          return;
        }
      }
    };

    const tick = () => {
      const dx = pointerX - ringX;
      const dy = pointerY - ringY;
      const settled = Math.abs(dx) < SETTLED && Math.abs(dy) < SETTLED;

      if (settled) {
        ringX = pointerX;
        ringY = pointerY;
      } else {
        ringX += dx * trail;
        ringY += dy * trail;
      }
      drawRing();

      // Elongate along the direction of travel so quick movement reads as a
      // comet rather than a jump. Decays back to a circle at rest.
      const vx = ringX - prevX;
      const vy = ringY - prevY;
      const speed = Math.hypot(vx, vy);
      if (speed > 0.01) angle = (Math.atan2(vy, vx) * 180) / Math.PI;

      const target = reduceMotion ? 0 : Math.min(speed / STRETCH_AT, STRETCH_MAX);
      stretchAmount += (target - stretchAmount) * 0.5;

      if (stretchAmount > 0.002) {
        stretch.style.transform = `rotate(${angle}deg) scale(${1 + stretchAmount}, ${
          1 - stretchAmount * 0.55
        })`;
      } else {
        stretch.style.transform = "";
      }

      prevX = ringX;
      prevY = ringY;

      if (settled && stretchAmount <= 0.002) {
        animating = false;
        probeForIframe();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      lastDeltaX = started ? event.clientX - pointerX : 0;
      lastDeltaY = started ? event.clientY - pointerY : 0;
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!activeRef.current) {
        activeRef.current = true;
        setActive(true);
      }
      if (!started) {
        started = true;
        snapRing();
      }

      // Hidden states can go stale while no boundary events arrive — coming
      // back out of an iframe, or content changing under a still pointer — so
      // re-derive the state from the point itself.
      if (lastState === "hidden") {
        evaluate(document.elementFromPoint(pointerX, pointerY));
      }

      // Drawn straight from the event so the dot never lags the pointer.
      drawDot();

      if (!animating) {
        animating = true;
        frame = requestAnimationFrame(tick);
      }
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      evaluate(event.target);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      setPressed(true);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      setPressed(false);
    };

    const onLeave = () => applyState("hidden");

    // relatedTarget is null when the pointer leaves the window or crosses into
    // an iframe — both cases where the custom cursor must step aside.
    const onPointerOut = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.relatedTarget !== null) return;
      onLeave();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") onLeave();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      cancelAnimationFrame(frame);
    };
  }, [mounted]);

  if (!mounted) return null;

  const isVisible = active && state !== "hidden";
  const showDot = isVisible && state !== "text" && state !== "label";
  const ringScale = pressed ? 0.82 : 1;
  const shapeScale =
    state === "interactive" ? 1.5 * ringScale : state === "default" ? ringScale : 0.3;
  const shapeOpacity = state === "text" || state === "label" ? 0 : 1;
  const isLabel = state === "label";
  const isText = state === "text";

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        data-custom-cursor="dot"
        data-cursor-state={state}
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
        className={`${s.dot} transition-opacity duration-200 ${
          showDot ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={ringRef}
        aria-hidden="true"
        data-custom-cursor="ring"
        data-cursor-state={state}
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
        className={`${s.ringWrapper} transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={s.ringShape}
          style={{ transform: `scale(${shapeScale})`, opacity: shapeOpacity }}
        >
          <div
            ref={stretchRef}
            data-custom-cursor="stretch"
            className={`${s.ringBody} ${state === "interactive" ? s.ringBodyActive : ""}`}
          />
        </div>

        <div
          className={s.pill}
          style={{
            transform: `translate(-50%, -50%) scale(${isLabel ? 1 : 0.7})`,
            opacity: isLabel ? 1 : 0,
          }}
        >
          {label}
        </div>

        <div
          className={s.caret}
          style={{
            transform: `translate(-50%, -50%) scaleY(${isText ? 1 : 0.2})`,
            opacity: isText ? 1 : 0,
          }}
        />
      </div>
    </>
  );
}

export default CustomCursor;
