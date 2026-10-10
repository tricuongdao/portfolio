"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import {
  Project,
  ProjectCategoryFilter,
  getProjectCategoryCounts,
  getProjectCategoryFilters,
  getProjectPoster,
  getProjectsByCategory,
} from "@/lib/projects-data";
import { projectStyles as s, filterBarStyles as f } from "@/public/dummyStyles";

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] =
    useState<ProjectCategoryFilter>("All");
  const prefersReducedMotion = useReducedMotion();

  // The chip row is derived from the data, so a category appears the first time
  // a project uses it and an empty one is never rendered as a dead "0" chip.
  const categoryFilters = useMemo(() => getProjectCategoryFilters(), []);
  const allProjects = useMemo(() => getProjectsByCategory("All"), []);
  const visibleProjects = useMemo(
    () => getProjectsByCategory(activeCategory),
    [activeCategory],
  );
  const countByCategory = useMemo(() => getProjectCategoryCounts(), []);

  const cardTransition = (index: number) =>
    prefersReducedMotion
      ? { duration: 0.001 }
      : { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const, delay: index * 0.06 };

  return (
    <div className={s.pageContainer}>
      <div className={s.innerContainer}>
        {/* Header */}
        <div className={s.header}>
          <h1 className={s.pageTitle}>Projects</h1>
        </div>

        {/* Category filter */}
        <div
          className={f.section}
          role="group"
          aria-label="Filter projects by category"
        >
          <span className={f.label}>Category</span>
          {categoryFilters.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={isActive}
                className={`${f.chip} ${isActive ? f.chipActive : f.chipInactive}`}
              >
                {category}
                <span className={f.chipCount}>
                  {countByCategory.get(category) ?? 0}
                </span>
              </button>
            );
          })}
          <span className={f.resultText}>
            Showing {visibleProjects.length} of {allProjects.length}
          </span>
        </div>

        {/* Projects Grid */}
        <motion.div layout className={s.projectsGrid}>
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                layout
                className="h-full"
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 18, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -10, scale: 0.97 }
                }
                transition={cardTransition(index)}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
          {visibleProjects.length === 0 && (
            <p className={s.emptyState}>No projects in this category yet.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();

  return (
    <div
      className={s.projectCard}
      // The whole card is the click target, so the site cursor labels it rather
      // than letting the card draw a follower of its own.
      data-cursor-label="View"
      onClick={() => {
        router.push(`/projects/${project.slug}`);
      }}
    >
      {/* Image Container */}
      <div className={s.imageContainer}>
        <Image
          src={getProjectPoster(project)}
          alt={project.title}
          fill
          // Cards run one-up on phones, two-up from lg, three-up from xl.
          sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className={s.projectImage}
        />
        {/* Status Badge */}
        <div className={s.statusBadgeContainer}>
          <span
            className={`${s.statusBadge} ${
              project.status === "active" ? s.statusActive : s.statusInactive
            }`}
          >
            {project.status}
          </span>
        </div>

        {/* Film badge — tells the visitor there is a film inside the project */}
        {project.film && (
          <div className={s.filmChip}>
            <Play className={s.filmChipIcon} aria-hidden="true" />
            <span>Film</span>
            <span className={s.filmChipDuration}>{project.film.duration}</span>
          </div>
        )}

        {/* Bookmark Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={s.bookmarkButton}
        >
          <svg className={s.bookmarkIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className={s.contentSection}>
        <div className={s.titleRow}>
          <h3 className={s.projectTitle}>{project.title}</h3>
          <span className={s.categoryBadge}>{project.category}</span>
        </div>
        <p className={s.projectDescription}>{project.description}</p>

        {/* Tags */}
        <div className={s.tagsContainer}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={s.tag}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className={s.actionsContainer}>
          <div className={s.actionsLinksContainer}>
            {project.links.visit && (
              <a
                href={project.links.visit}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
                className={s.visitButton}
              >
                Visit
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
                className={s.otherButton}
              >
                GitHub
              </a>
            )}
            {project.links.pypi && (
              <a
                href={project.links.pypi}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
                className={s.otherButton}
              >
                PyPI
              </a>
            )}
            {project.links.link && (
              <a
                href={project.links.link}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
                className={s.otherButton}
              >
                Link
              </a>
            )}
          </div>

          {/* Additional Actions */}
          <div className="flex gap-1">
            {project.links.archive && <span className={s.archivedText}>Archived</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

