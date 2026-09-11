// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { Cover } from "@/components/ui/cover";
import { homePageStyles, spotlightStyles } from "@/public/dummyStyles";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Content */}
      <div className={homePageStyles.container}>
        {/* Background elements */}
        <div
          className={cn(
            homePageStyles.backgroundGrid.wrapper,
            homePageStyles.backgroundGrid.pattern,
          )}
        />

        <Spotlight className={spotlightStyles.position} fill="#0FFF50" />

        {/* Gradient overlay for better text readability */}
        <div className={homePageStyles.gradientOverlay} />

        {/* HERO */}
        <section className={homePageStyles.heroSection}>
          {/* Hero content */}
          <div className="relative ">
            <h1 className={homePageStyles.h1}>
              Hey, I'm{" "}
              <span className={homePageStyles.spanWithMargin}>
                <Cover>Vinny</Cover>
              </span>
            </h1>

            <h2 className={homePageStyles.h2}>
              Full-Stack{" "}
              <span className={homePageStyles.spanInline}>
                <PointerHighlight>Developer</PointerHighlight>
              </span>
            </h2>

            <div className="mb-6">
              <div className={homePageStyles.calloutCard.wrapper}>
                <div className={homePageStyles.calloutCard.innerContainer}>
                  <div className={homePageStyles.calloutCard.textContainer}>
                    <svg
                      className={homePageStyles.calloutCard.icon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path d="M3 12l9-9 9 9" strokeWidth="1.2" />
                    </svg>

                    {/* text container uses truncate so long text won't overflow */}
                    <div className={homePageStyles.calloutCard.text}>
                      Open to graduate & internship roles
                    </div>
                  </div>

                  <a href="mailto:tricuongdao75@gmail.com"
                  target="_blank"
                    type="button"
                    className={homePageStyles.calloutCard.button}
                  >
                    Contact Me
                  </a>
                </div>
              </div>
            </div>

            <p className={homePageStyles.paragraph}>
              I study Information Technology at QUT and build full-stack web apps in JavaScript and Python. Since August 2026 I have been working as a freelance web developer, and on weekdays I draft legal documents and keep a Brisbane law firm's deadlines and billing straight.{" "}
              <em>I write code the way I keep those files: checked before it goes out.</em>
            </p>

            <p className={homePageStyles.paragraph}>
              I speak <strong>English</strong> and <strong>Vietnamese</strong>. Based in <strong>Brisbane, QLD</strong>. Graduating 2027.
            </p>

            <article className={homePageStyles.article.wrapper}>
              <div className={homePageStyles.article.content}>
                <div className={homePageStyles.article.header}>
                  <svg
                    className={homePageStyles.article.headerIcon}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>Featured Work</span>
                </div>
                <h3 className={homePageStyles.article.title}>
                  Flow Mate — Full-stack Task Manager
                </h3>
                <p className={homePageStyles.article.description}>
                  A task manager I built on both sides of the wire, from the Mongoose schema to the React view.
                </p>

                <div className={homePageStyles.article.linkContainer}>
                  <a
                    href="https://flowmate-6x0c.onrender.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={homePageStyles.article.link}
                  >
                    <span>Visit Live</span>
                    <svg
                      className={homePageStyles.article.linkIcon}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                  <a
                    href="https://github.com/tricuongdao/FlowMate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={homePageStyles.article.link}
                  >
                    <span>View Code</span>
                    <svg
                      className={homePageStyles.article.linkIcon}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </>
  );
}
