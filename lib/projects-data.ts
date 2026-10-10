/** A video piece that belongs to a project, shown on the project page. */
export interface ProjectFilm {
  /** The video file itself, served from /public. */
  src: string;
  /**
   * Still frame shown before playback. Kept separate from `Project.poster`
   * because the video poster is fetched raw by the browser, so it wants the
   * smallest usable file rather than the source artwork.
   */
  poster: string;
  /** The film's own title, as it appears on screen. */
  label: string;
  /** Runtime, formatted for display. */
  duration: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  slug: string;
  /** Screenshot of the shipped work, shown on the project page. */
  image: string;
  /**
   * Artwork for the project card. Falls back to `image` when a project has no
   * artwork of its own.
   */
  poster?: string;
  /** Optional short film about the project. */
  film?: ProjectFilm;
  tags: string[];
  status: "active" | "archived";
  links: {
    visit?: string;
    github?: string;
    pypi?: string;
    link?: string;
    youtube?: string;
    archive?: string;
    howIBuilt?: string;
  };
  author: string;
  authorAvatar: string;
  techStack: string[];
  features: string[];
  learningOutcomes: string[];
}

/**
 * Main projects array — update content here as required.
 * Ensure slug values are URL-safe and unique.
 */
export const projects: Project[] = [
  {
    id: "1",
    title: "The Web Bistro",
    slug: "the-web-bistro",
    description: "My freelance web studio, built as a restaurant: real extruded type, two 3D scenes, and a full English / Tiếng Việt switch.",
    detailedDescription:
      "The Web Bistro is the site for my freelance web development practice, and it is dressed as a restaurant. Services are a menu, the process runs as kitchen stations, and enquiries are bookings. Under the theme it is a production Next.js App Router site: two three.js scenes (the WB; crest and a cloche that lifts to reveal the little site being served), a glyph pipeline that extrudes the wordmark from real DM Serif Display outlines, scroll-driven storytelling with GSAP ScrollTrigger, Lenis smooth scrolling, and every visible string served in English and Tiếng Việt. No CSS framework, just design tokens and CSS modules, and every motion path collapses under prefers-reduced-motion. It also has its own launch film, below: twenty-five seconds staged as a 2016 seed-round pitch, delivered completely straight about a studio whose entire market opportunity is its rate card. Nothing in the film is invented - every number in it is a real service promise from the site.",
    image: "/the-web-bistro.png",
    poster: "/the-web-bistro-poster.jpg",
    film: {
      src: "/the-web-bistro-film.mp4",
      poster: "/the-web-bistro-poster.webp",
      label: "A Short Film About Lunch",
      duration: "0:25",
    },
    tags: ["Full-Stack", "Next.js", "Three.js", "TypeScript"],
    status: "active",
    techStack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "three.js",
      "React Three Fiber",
      "GSAP ScrollTrigger",
      "Lenis",
      "Motion",
      "CSS Modules",
      "Vercel",
    ],
    features: [
      "Crest: The WB; mark is extruded from real DM Serif Display outlines, not a runtime font",
      "Scenes: A hero crest turning on a brass plate, and a cloche that lifts to serve the site",
      "Motion: GSAP ScrollTrigger pins the how service runs stations; Lenis keeps the scroll smooth",
      "Language: Every rendered string has an English and a Tiếng Việt version, checked by a script",
      "Menu: Services, prices and FAQ come from one content file, so copy changes need no code",
      "Booking: The reservations form posts to Formspree, then falls back to the visitor's mail client",
      "Film: A 25 second launch film cut as a 2016 seed pitch, with every metric grounded in the real rate card",
      "Access: All motion collapses under prefers-reduced-motion, and pins become plain lists",
    ],
    learningOutcomes: [
      "Building and shipping a production Next.js App Router site",
      "Real 3D on the web with three.js and React Three Fiber",
      "Turning a font into geometry with a custom glyph pipeline (opentype.js)",
      "Scroll-driven storytelling with GSAP ScrollTrigger and Lenis",
      "Design tokens and CSS modules instead of a CSS framework",
      "Bilingual content architecture with a translation coverage check",
      "Accessibility: honouring prefers-reduced-motion across every animation",
    ],
    links: {
      visit: "https://the-web-bistro.vercel.app",
      github: "https://github.com/tricuongdao/the-web-bistro",
    },
    author: "Vinny Dao",
    authorAvatar: "/Vinny.D.jpg",
  },
];

/* -------------------------
   Helper utilities
   ------------------------- */

/** Return a project by slug or null */
export function getProjectBySlug(slug: string | undefined | null): Project | null {
  // defensive normalization: decode URI components, coerce to string, trim
  const normalized = decodeURIComponent(String(slug ?? "")).trim();
  if (!normalized) return null;
  return projects.find((p) => p.slug === normalized) ?? null;
}
/** Return all slugs (useful for generateStaticParams or getStaticPaths) */
export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

/** Compose the canonical URL for a project (useful in UIs) */
export function getProjectUrl(project: Project | { slug: string }) {
  return `/projects/${project.slug}`;
}

/** Return all projects (shallow copy) */
export function getAllProjects(): Project[] {
  return [...projects];
}

/** Card artwork for a project: its own poster when it has one, else the screenshot. */
export function getProjectPoster(project: Project): string {
  return project.poster ?? project.image;
}

/** The bare host of a project's live link, for use as a caption. */
export function getProjectHost(project: Project): string | null {
  const visit = project.links.visit;
  if (!visit) return null;
  try {
    return new URL(visit).host;
  } catch {
    return visit.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}