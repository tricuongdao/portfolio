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
    title: "Flow Mate",
    slug: "flow-mate",
    description: "A task manager I built on both sides of the wire, from the Mongoose schema to the React view.",
    detailedDescription:
      "A full-stack task manager application built with the MERN stack. Flow Mate allows users to create, organize, and track tasks with features including status toggling, filtering by date range, and pagination. The application demonstrates end-to-end development from database schema design to deployed frontend.",
    image: "/flowmate.png",
    tags: ["Full-Stack", "MERN", "React", "Node.js"],
    status: "active",
    techStack: ["React", "Vite", "Tailwind", "Node.js", "Express", "MongoDB", "Mongoose"],
    features: [
      "Model: Task documents in MongoDB, shaped by Mongoose schemas",
      "API: Express routes for create, read, update and delete",
      "Status: Every task toggles between active and complete",
      "Filters: Narrow the list to today, this week, this month, or everything",
      "Paging: Long lists page instead of running off the bottom of the screen",
      "Layout: Tailwind, holding its shape from a phone up to a desktop",
    ],
    learningOutcomes: [
      "Full-stack application development with MERN stack",
      "MongoDB schema design with Mongoose",
      "RESTful API development with Express.js",
      "React frontend with Vite build tool",
      "Responsive design with Tailwind CSS",
      "State management and data flow",
    ],
    links: {
      visit: "https://flowmate-6x0c.onrender.com/",
      github: "https://github.com/tricuongdao/FlowMate",
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