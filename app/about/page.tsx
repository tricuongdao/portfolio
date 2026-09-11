// app/about/page.tsx
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Link from "next/link";
import { aboutPageStyles } from "@/public/dummyStyles";

export default function AboutPage() {
  const interests = [
    "FULL-STACK DEV",
    "JAVASCRIPT",
    "PYTHON",
    "REACT",
    "TRAVEL",
    "MUSIC",
    "READING"
  ];

  const techStack = [
    "React",
    "Node.js",
    "Python",
    "JavaScript",
    "PostgreSQL",
    "MongoDB",
    "Express"
  ];

  // change this to whatever email you want the button to compose to
  const email = "tricuongdao75@gmail.com";
  // Gmail compose URL (will open Gmail's compose in a new tab if user is signed in)
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

  return (
    <div className={aboutPageStyles.pageContainer}>
      <div className={aboutPageStyles.contentContainer}>
        {/* Background Container - Contains the animation behind content */}
        <div className={aboutPageStyles.backgroundContainer}>
          {/* Background Effect - Positioned behind with negative z-index */}
          <div className={aboutPageStyles.backgroundEffect}>
            <BackgroundBeamsWithCollision />
          </div>
          
          {/* Content - Stays above the background naturally */}
          <div className={aboutPageStyles.contentWrapper}>
            {/* Main Heading */}
            <h1 className={aboutPageStyles.mainHeading}>
              Vinny Dao
            </h1>

            {/* Interests/Tags Line */}
            <div className={aboutPageStyles.interestsContainer}>
              {interests.map((interest, index) => (
                <span key={interest} className={aboutPageStyles.interestItem}>
                  {interest}
                  {index < interests.length - 1 && (
                    <span className={aboutPageStyles.interestSeparator}>•</span>
                  )}
                </span>
              ))}
            </div>

            {/* Tech Stack Pills */}
            <div className={aboutPageStyles.techStackContainer}>
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className={aboutPageStyles.techPill}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Content Sections */}
            <div className={aboutPageStyles.sectionsContainer}>
              {/* Who I Am */}
              <section>
                <h2 className={aboutPageStyles.sectionHeading}>Who I Am</h2>
                <p className={aboutPageStyles.paragraph}>
                  Hello! I'm Vinny, a Brisbane-based developer passionate about building tools that simplify people's lives. 
                  I study Information Technology at QUT and build full-stack web apps in JavaScript and Python.
                </p>
              </section>

              {/* What I Do */}
              <section>
                <h2 className={aboutPageStyles.sectionHeading}>What I Do</h2>
                <p className={aboutPageStyles.paragraph}>
                  Since August 2026 I have been working as a freelance web developer, building full-stack web apps for clients. 
                  I focus on building practical, user-facing products — from database schema to deployed front end.
                </p>
              </section>

              {/* My Journey */}
              <section>
                <h2 className={aboutPageStyles.sectionHeading}>My Journey</h2>
                <p className={aboutPageStyles.paragraph}>
                  On weekdays I draft legal documents and keep a Brisbane law firm's deadlines and billing straight. 
                  Working in a law firm taught me that a missed deadline is not a bug report. 
                  I write code the way I keep those files: checked before it goes out.
                </p>
              </section>

              {/* Vision */}
              <section>
                <h2 className={aboutPageStyles.sectionHeading}>Vision</h2>
                <p className={aboutPageStyles.paragraph}>
                  I believe in building software that is reliable, well-tested, and delivered on time. 
                  Whether it's a task manager or a client's web app, I bring the same attention to detail 
                  that keeps a law firm running smoothly.
                </p>
              </section>

              {/* Beyond Code */}
              <section>
                <h2 className={aboutPageStyles.sectionHeading}>Beyond Code</h2>
                <p className={aboutPageStyles.paragraph}>
                  I speak English and Vietnamese. Based in Brisbane, QLD. Graduating 2027. 
                  When I'm not coding, I enjoy travel, music, and reading.
                </p>
              </section>
            </div>

            {/* CTA Buttons */}
            <div className={aboutPageStyles.ctaContainer}>
              {/* Link to contact page */}
              <Link
                href="/contact"
                className={aboutPageStyles.primaryButton}
                aria-label="Get in touch — open contact page"
              >
                Get in Touch
              </Link>

              {/* Open Gmail compose in new tab */}
              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={aboutPageStyles.secondaryButton}
                aria-label={`Compose email to ${email} in Gmail`}
              >
                <svg className={aboutPageStyles.emailIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                E-Mail
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}