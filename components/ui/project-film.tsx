"use client";

import React, { useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import type { ProjectFilm } from "@/lib/projects-data";
import { projectFilmStyles as s } from "@/public/dummyStyles";

/**
 * Project film player.
 *
 * Design
 * ------
 * A poster frame with one obvious play button, then the browser's own controls
 * once the film is running. Nothing autoplays and nothing is muted for you: the
 * film has a soundtrack, so it starts on a real click, at full volume, and the
 * visitor keeps the native scrubber, volume and full-screen controls they
 * already know.
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

  const isPlaying = status === "playing";
  const isEnded = status === "ended";

  const start = () => {
    const video = videoRef.current;
    if (!video) return;
    // Replaying from the end has to rewind first, or play() resolves instantly
    // and the film appears not to restart.
    if (isEnded) video.currentTime = 0;
    // play() rejects if the browser refuses for any reason. The poster stays
    // up and the button stays clickable, which is the honest failure state.
    void video.play().catch(() => setStatus("idle"));
  };

  return (
    <figure className={s.figure}>
      <div
        className={s.frame}
        data-cursor-label={isPlaying ? undefined : "Play"}
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

        {!isPlaying && (
          <div className={s.overlay}>
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

      <figcaption className={s.caption}>
        <span className={s.captionTitle}>{film.label}</span>
        <span className={s.captionMeta}>
          {film.duration} &middot; with sound
        </span>
      </figcaption>
    </figure>
  );
}

export default ProjectFilmPlayer;
