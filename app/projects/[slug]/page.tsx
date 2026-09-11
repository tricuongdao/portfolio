import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {BackgroundBeams} from "@/components/ui/background-beams";
import { ArrowLeft, ExternalLink, Github, Youtube, Package } from "lucide-react";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/projects-data";
import { projectDetailStyles as s } from "@/public/dummyStyles";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className={s.pageContainer}>
      <div className={s.innerContainer}>
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/projects" className={s.backButton}>
            <ArrowLeft className={s.backIcon} />
            Back to Projects
          </Link>
        </div>

        {/* Project Header */}
        <div className={s.projectHeader}>
          <div className={s.headerFlex}>
            <div className={s.headerLeft}>
              <div className={s.titleContainer}>
                <h1 className={s.projectTitle}>{project.title}</h1>
                <span className={`${s.statusBadge} ${
                  project.status === "active" ? s.statusActive : s.statusInactive
                }`}>
                  {project.status}
                </span>
              </div>
              <p className={s.projectDescription}>{project.description}</p>

              {/* Tags */}
              <div className={s.tagsContainer}>
                {project.tags.map((tag) => (
                  <span key={tag} className={s.tag}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={s.actionButtonsContainer}>
              {project.links.visit && (
                <Link href={project.links.visit} target="_blank" rel="noopener noreferrer" className={s.visitButton}>
                  <ExternalLink className={s.buttonIcon} />
                  Visit Live
                </Link>
              )}
              {project.links.howIBuilt && (
                <Link href={project.links.howIBuilt} target="_blank" rel="noopener noreferrer" className={s.secondaryButton}>
                  <Youtube className={s.buttonIcon} />
                  How I Built
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Project Image */}
        <div className={s.imageContainer}>
          <Image
            src={project.image}
            alt={project.title}
            width={1200}
            height={675}
            priority
            className={s.projectImage}
          />
        </div>

        <div className={s.gridContainer}>
          {/* Main Content */}
          <div className={s.mainContent}>
            {/* Project Description */}
            <section>
              <h2 className={s.sectionTitle}>Project Overview</h2>
              <div className={s.prose}>
                <p className={s.proseText}>{project.detailedDescription}</p>
              </div>
            </section>

            {/* Features */}
            <section>
              <h2 className={s.sectionTitle}>Key Features</h2>
              <div className={s.featuresGrid}>
                {project.features.map((feature, i) => (
                  <div key={i} className={s.featureCard}>
                    <div className={s.featureCardInner}>
                      <div className={s.featureIconContainer}>
                        <div className={s.featureIcon} />
                      </div>
                      <span className={s.featureText}>{feature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Learning Outcomes */}
            <section>
              <h2 className={s.sectionTitle}>Learning Outcomes</h2>
              <div className={s.learningOutcomesGrid}>
                {project.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className={s.learningOutcomeCard}>
                    <div className={s.learningOutcomeNumber}>
                      <span className={s.learningOutcomeNumberText}>{idx + 1}</span>
                    </div>
                    <span className={s.learningOutcomeText}>{outcome}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className={s.sidebar}>
            {/* Tech Stack */}
            <section className={s.sidebarSection}>
              <h3 className={s.sidebarSectionTitle}>Tech Stack</h3>
              <div className={s.techStackContainer}>
                {project.techStack.map((tech) => (
                  <span key={tech} className={s.techStackItem}>{tech}</span>
                ))}
              </div>
            </section>

            {/* Links */}
            <section className={s.sidebarSection}>
              <h3 className={s.sidebarSectionTitle}>Project Links</h3>
              <div className={s.linksContainer}>
                {project.links.github && (
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer" className={s.linkCard}>
                    <Github className={s.linkIcon} />
                    <span className={s.linkText}>View Source Code</span>
                  </a>
                )}
                {project.links.visit && (
                  <a href={project.links.visit} target="_blank" rel="noopener noreferrer" className={s.linkCard}>
                    <ExternalLink className={s.linkIcon} />
                    <span className={s.linkText}>Live Demo</span>
                  </a>
                )}
                {project.links.pypi && (
                  <a href={project.links.pypi} target="_blank" rel="noopener noreferrer" className={s.linkCard}>
                    <Package className={s.linkIcon} />
                    <span className={s.linkText}>PyPI Package</span>
                  </a>
                )}
                {project.links.youtube && (
                  <a href={project.links.youtube} target="_blank" rel="noopener noreferrer" className={s.linkCard}>
                    <Youtube className={s.linkIcon} />
                    <span className={s.linkText}>Video Tutorial</span>
                  </a>
                )}
              </div>
            </section>

            {/* Project Info */}
            <section className={s.sidebarSection}>
              <h3 className={s.sidebarSectionTitle}>Project Info</h3>
              <div className={s.projectInfoContainer}>
                <div>
                  <p className={s.projectInfoLabel}>Author</p>
                  <div className={s.authorContainer}>
                    <Image src={project.authorAvatar} alt={project.author} width={32} height={32} className={s.authorAvatar} />
                    <p className={s.authorName}>{project.author}</p>
                  </div>
                </div>
                <div>
                  <p className={s.projectInfoLabel}>Status</p>
                  <p className={s.projectInfoText}>{project.status}</p>
                </div>
                <div>
                  <p className={s.projectInfoLabel}>Category</p>
                  <p className={s.projectInfoText}>{project.tags[0]}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}

// Generate static params for SSG
export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

// Generate page metadata (recommended for SEO)
export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: `${project.title} — Vinny Dao`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [
        {
          url: project.image,
          alt: project.title,
        },
      ],
    },
  };
}