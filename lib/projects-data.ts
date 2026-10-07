export interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  slug: string;
  image: string;
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
      "The Web Bistro is the site for my freelance web development practice, and it is dressed as a restaurant. Services are a menu, the process runs as kitchen stations, and enquiries are bookings. Under the theme it is a production Next.js App Router site: two three.js scenes (the WB; crest and a cloche that lifts to reveal the little site being served), a glyph pipeline that extrudes the wordmark from real DM Serif Display outlines, scroll-driven storytelling with GSAP ScrollTrigger, Lenis smooth scrolling, and every visible string served in English and Tiếng Việt. No CSS framework, just design tokens and CSS modules, and every motion path collapses under prefers-reduced-motion.",
    image: "/the-web-bistro.png",
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