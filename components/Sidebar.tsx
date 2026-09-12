"use client";

import React, { useState, useEffect, JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { TypingAnimation } from "./ui/typing-animation";
import { usePathname } from "next/navigation";
import { sidebarStyles as s } from "@/public/dummyStyles";

type IconProps = React.SVGProps<SVGSVGElement> & { className?: string };

const HomeIcon = ({ className, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" aria-hidden="true" className={className} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 11L12 4l9 7v9a1 1 0 0 1-1 1h-5v-5H9v5H4a1 1 0 0 1-1-1v-9z" />
  </svg>
);

const ProjectsIcon = ({ className, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" aria-hidden="true" className={className} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h10v8H4zM10 14h10v6H10zM14 4h6v6h-6z" />
  </svg>
);

const UserIcon = ({ className, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" aria-hidden="true" className={className} {...props}>
    <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 20a8 8 0 0 1 16 0" />
  </svg>
);

const MailIcon = ({ className, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" aria-hidden="true" className={className} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v12H3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 7 9-7" />
  </svg>
);

const MenuIcon = ({ className, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" aria-hidden="true" className={className} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

const CloseIcon = ({ className, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" aria-hidden="true" className={className} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 8l8 8m0-8l-8 8" />
  </svg>
);

const ExperienceIcon = ({ className, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" aria-hidden="true" className={className} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10l3 4v14H4V7z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v4h4M8 13h8M8 17h8" />
  </svg>
);

const ToolsIcon = ({ className, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" aria-hidden="true" className={className} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 7a4 4 0 0 1 0 8l6 6-2 2-6-6a4 4 0 1 1 2-10z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 8l3 3" />
  </svg>
);

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest(".mobile-sidebar") && !target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isMobileMenuOpen]);

  const navItems: { href: string; label: string; Icon: React.ComponentType<IconProps> }[] = [
    { href: "/", label: "Home", Icon: HomeIcon },
    { href: "/projects", label: "Projects", Icon: ProjectsIcon },
    { href: "/experience", label: "Experience", Icon: ExperienceIcon },
    { href: "/tools", label: "Tools", Icon: ToolsIcon },
    { href: "/about", label: "About", Icon: UserIcon },
    { href: "/contact", label: "Contact", Icon: MailIcon },
  ];

  const socials = [
    {
      label: "GitHub",
      href: "https://github.com/tricuongdao",
      svgPath: "M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/tri-cuong-dao",
      svgPath: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    },
    {
      label: "Email",
      href: "mailto:tricuongdao75@gmail.com",
      svgPath: "M3 7h18v12H3z M3 7l9 7 9-7",
    },
  ];

  return (
    <>
      {/* Mobile Top Navbar - Fixed at top on mobile screens */}
      <div className={s.mobileTopNav}>
        <div className={s.mobileTopNavInner}>
          <div className={s.mobileAvatarContainer}>
            <div className={s.mobileAvatar}>
              <Image src="/Vinny.D.jpg" alt="Vinny avatar" width={40} height={40} className={s.mobileAvatarImage} priority />
            </div>
            <div>
              <div className={s.mobileName}>Vinny Dao</div>
              <TypingAnimation className={s.mobileTyping} words={["Full-Stack Developer", "Freelance", "QUT Student", "Brisbane"]} loop startOnView={false} />
            </div>
          </div>
        </div>
      </div>

      <div className={s.mobileSpacer} />

      <aside className={s.desktopSidebar} aria-labelledby="desktop-sidebar">
        <div className={s.desktopAvatarContainer}>
          <div className={s.desktopAvatar}>
            <Image src="/Vinny.D.jpg" alt="Vinny avatar" width={48} height={48} className={s.desktopAvatarImage} priority />
          </div>

          <div>
            <div className={s.desktopName}>Vinny Dao</div>
            <TypingAnimation className={s.desktopTyping} words={["Full-Stack Developer", "Freelance", "QUT Student", "Brisbane"]} loop startOnView={false} />
          </div>
        </div>

        <nav id="desktop-sidebar" className={s.navContainer} aria-label="Primary">
          <ul className={s.navList}>
            {navItems.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link href={href} className={`${s.navItem} ${pathname === href ? s.navItemActive : s.navItemInactive}`} aria-current={pathname === href ? "page" : undefined}>
                  <Icon className={s.navIcon} />
                  <span className={s.navLabel}>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.footerText}>Made by Vinny | © 2026</div>
      </aside>

      <div className={`${s.mobileOverlay} ${isMobileMenuOpen ? s.mobileOverlayVisible : s.mobileOverlayHidden}`}>
        <div className={`${s.mobileOverlayBg} ${isMobileMenuOpen ? s.mobileOverlayBgVisible : s.mobileOverlayBgHidden}`} onClick={() => setIsMobileMenuOpen(false)} />

        <div className={`${s.mobileSidebar} ${isMobileMenuOpen ? s.mobileSidebarVisible : s.mobileSidebarHidden}`}>
          <div className={s.mobileSidebarHeader}>
            <div className={s.mobileHeaderInner}>
              <div className={s.mobileHeaderAvatarContainer}>
                <div className={s.mobileAvatar}>
                  <Image src="/Vinny.D.jpg" alt="Vinny" width={40} height={40} className={s.mobileAvatarImage} priority />
                </div>
                <div>
                  <div className={s.mobileName}>Vinny</div>
                  <TypingAnimation className={s.mobileTyping} words={["AI Engineer", "FullStack", "Problem Solver", "Dev Stallion"]} loop />
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className={s.mobileCloseButton} aria-label="Close menu">
                <CloseIcon className={s.mobileCloseIcon} />
              </button>
            </div>
          </div>

          <div className={s.mobileContent}>
            <nav className="mb-8">
              <div className={s.mobileSectionLabel}>Home</div>
              <ul className={s.mobileNavList}>
                {navItems.map(({ href, label, Icon }) => (
                  <li key={href}>
                    <Link href={href} onClick={() => setIsMobileMenuOpen(false)} className={`${s.mobileNavItem} ${pathname === href ? s.navItemActive : s.navItemInactive}`} aria-current={pathname === href ? "page" : undefined}>
                      <Icon className={s.mobileNavIcon} />
                      <span className={s.mobileNavLabel}>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={s.mobileSocialSection}>
              <div className={s.mobileSectionLabel}>Connect</div>
              <div className={s.mobileSocialList}>
                {socials.map((soc) => (
                  <a key={soc.label} href={soc.href} className={s.mobileSocialItem} rel="noopener noreferrer" target="_blank">
                    <svg className={s.mobileSocialIcon} viewBox="0 0 24 24" fill="currentColor">
                      <path d={soc.svgPath} />
                    </svg>
                    <span className={s.mobileSocialText}>{soc.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className={s.mobileFooter}>
            <div className={s.mobileFooterLabel}>Reach out →</div>
            <div className={s.mobileFooterText}>
              <div>Made by Vinny | © 2026</div>
            </div>
          </div>
        </div>
      </div>

      <div className={s.bottomNav}>
        <div className={s.bottomNavContainer}>
          <div className={s.bottomNavInner}>
            <div className={s.bottomNavBar}>
              {/* Nav items - using grid for perfect equal distribution */}
              <div className={s.bottomNavGrid}>
                {navItems.map(({ href, label, Icon }) => (
                  <Link 
                    key={href} 
                    href={href} 
                    className={`${s.bottomNavLink} ${pathname === href ? s.bottomNavLinkActive : s.bottomNavLinkInactive}`} 
                    aria-label={label}
                  >
                    <Icon className={s.bottomNavIcon} />
                  </Link>
                ))}
              </div>

              <div className={s.bottomNavDivider}></div>

              <button 
                onClick={() => setIsMobileMenuOpen(true)} 
                className={s.bottomMenuButton} 
                aria-label="Open menu"
              >
                <MenuIcon className={s.bottomMenuIcon} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}