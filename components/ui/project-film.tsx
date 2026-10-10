"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import type { ProjectFilm } from "@/lib/projects-data";
import { projectFilmStyles as s } from "@/public/dummyStyles";

/**
 * Project film player.
 *
 * Playback
 * --------
 * The film starts itself on arrival, with sound. Browsers only allow unmuted
 * playback in a document that has already been clicked, and the project card is
 * exactly that click: the visitor comes from the card, so the film is running
 * by the time the page settles. On a cold load - a shared link, a refresh, a
 * new tab - there is no activation, play() rejects, and the poster and its play
 * button simply stay up. The film is never muted behind the visitor's back.
 *
 * Once running, the browser's own controls take over, so the visitor keeps the
 * scrubber, volume and full-screen controls they already know.
 *
 * Cursor
 * ------
 * Over the poster the custom cursor becomes a "Play" pill (`data-cursor-label`).
 * While the film plays the subtree opts out (`data-cursor="none"`) so the
 * native pointer returns for the control bar, which the custom cursor cannot
 * track reliably.
 *
 * State
 * -----
 * `idle`   poster shown, native controls hidden
 * `playing` film running, native controls shown, overlay removed
 * `ended`  film finished, overlay returns as a replay button
 * A mid-film pause stays in `playing`, so the control bar does not disappear
 * from under the visitor's pointer.
 */
export function ProjectFilmPlayer({
  film,
  title,
}: {
  film: ProjectFilm;
  title: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "ended">("idle");
  const [autoplayRefused, setAutoplayRefused] = useState(false);

  const isPlaying = status === "playing";
  const isEnded = status === "ended";

  // Arriving from the project card counts as the gesture that unlocks playback,
  // so ask to start straight away. A rejection is the expected outcome on a cold
  // load (a shared link, a refresh): there is no activation to inherit, so the
  // cover below comes back with its play button rather than the film being
  // forced to start muted behind the visitor's back.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => setAutoplayRefused(true));
  }, []);

  /*
    The cover is only drawn once we know the film is not starting, so a visitor
    who came from the card never sees a play button flash under a film that is
    already running. It also covers the two states that genuinely need a button:
    refused autoplay, and the end of the film.
  */
  const showCover = isEnded || (status === "idle" && autoplayRefused);

  const start = () => {
    const video = videoRef.current;
    if (!video) return;
    // Replaying from the end has to rewind first, or play() resolves instantly
    // and the film appears not to restart.
    if (isEnded) video.currentTime = 0;
    // play() rejects if the browser refuses for any reason. The poster stays
    // up and the button stays clickable, which is the honest failure state.
    void video.play().catch(() => {
      setStatus("idle");
      setAutoplayRefused(true);
    });
  };

  return (
    <figure className={s.figure}>
      <div
        className={s.frame}
        data-cursor-label={showCover ? "Play" : undefined}
        {...(isPlaying ? { "data-cursor": "none" } : {})}
      >
        <video
          ref={videoRef}
          className={s.video}
          poster={film.poster}
          preload="metadata"
          playsInline
          controls={isPlaying}
          onPlay={() => setStatus("playing")}
          onEnded={() => setStatus("ended")}
          aria-label={`${film.label}: a short film about ${title}`}
        >
          <source src={film.src} type="video/mp4" />
          Your browser cannot play this film.{" "}
          <a href={film.src}>Download it instead</a>.
        </video>

        {showCover && (
          // The whole poster is the hit target, not just the circle, and the
          // button inside keeps it reachable from the keyboard.
          <div className={s.overlay} onClick={start}>
            <button
              type="button"
              onClick={start}
              className={s.playButton}
              aria-label={isEnded ? `Watch ${film.label} again` : `Play ${film.label}`}
            >
              {isEnded ? (
                <RotateCcw className={s.replayIcon} />
              ) : (
                <Play className={`${s.playIcon} ${s.playIconOffset}`} />
              )}
            </button>
            {/* The poster already carries the film's title, so the only label
                here is the one that says the replay is a replay. */}
            {isEnded && <span className={s.overlayLabel}>Watch again</span>}
          </div>
        )}
      </div>
    </figure>
  );
}

export default ProjectFilmPlayer;
