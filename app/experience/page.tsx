"use client";

import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { Award, Briefcase, Code2, GraduationCap, Rocket, Users } from "lucide-react";
import { timelineStyles as s } from "@/public/dummyStyles";

export default function TimelineDemo() {
  const data = [
    {
      title: "Aug 2026 - Present",
      content: (
        <div className={s.itemContainer}>
          <div className={s.itemFlexContainer}>
            <div className={s.iconContainerBlue}>
              <Rocket className={s.iconBlue} />
            </div>
            <div>
              <h3 className={s.contentTitle}>Freelance Web Developer</h3>
              <p className={s.contentSubtitle}>Self-employed · Brisbane QLD</p>
              <p className={s.contentText}>Building and shipping web apps for clients</p>
            </div>
          </div>
          <ul className={s.list}>
            <li className={s.listItem}>
              <span className={s.bulletBlue}></span>
              Full-stack Web apps built end to end, from database schema to deployed front end
            </li>
            <li className={s.listItem}>
              <span className={s.bulletBlue}></span>
              Clients: Scoping, quoting and delivering directly with clients, kept to brief
            </li>
            <li className={s.listItem}>
              <span className={s.bulletBlue}></span>
              Stacks: JavaScript and Python, with React, Node, Express and MongoDB
            </li>
            <li className={s.listItem}>
              <span className={s.bulletBlue}></span>
              Deployment: Apps shipped to the cloud and handed over, live and documented
            </li>
            <li className={s.listItem}>
              <span className={s.bulletBlue}></span>
              Quality: Responsive layouts, tested features and code checked before it goes out
            </li>
            <li className={s.listItem}>
              <span className={s.bulletBlue}></span>
              Comms: Clear timelines, regular updates and no surprises at invoicing
            </li>
          </ul>
          <div className={s.techBadgesContainer}>
            <span className={s.techBadge}>React</span>
            <span className={s.techBadge}>Node.js</span>
            <span className={s.techBadge}>Express</span>
            <span className={s.techBadge}>MongoDB</span>
            <span className={s.techBadge}>JavaScript</span>
            <span className={s.techBadge}>Python</span>
          </div>
        </div>
      ),
    },
    {
      title: "Feb 2025 - Present",
      content: (
        <div className={s.itemContainer}>
          <div className={s.itemFlexContainer}>
            <div className={s.iconContainerPurple}>
              <Briefcase className={s.iconPurple} />
            </div>
            <div>
              <h3 className={s.contentTitle}>Legal Secretary</h3>
              <p className={s.contentSubtitle}>T Lawyers, Inala · Brisbane QLD</p>
              <p className={s.contentText}>Supporting Lawyers, Consultants and Senior Paralegals</p>
            </div>
          </div>
          <ul className={s.list}>
            <li className={s.listItem}>
              <span className={s.bulletPurple}></span>
              Assist lawyers across Commercial Law, Conveyancing, Family, Personal Injuries, Wills & Estate, and Migration Law
            </li>
            <li className={s.listItem}>
              <span className={s.bulletPurple}></span>
              Draft legal correspondence, contracts, and conveyancing packages
            </li>
            <li className={s.listItem}>
              <span className={s.bulletPurple}></span>
              Complete forms (stamp duty, superannuation, migration, wills, etc.) and undertake client searches
            </li>
            <li className={s.listItem}>
              <span className={s.bulletPurple}></span>
              Client service, file organisation, and time costing
            </li>
            <li className={s.listItem}>
              <span className={s.bulletPurple}></span>
              Files: File organisation, diarising and matter deadlines across concurrent cases
            </li>
            <li className={s.listItem}>
              <span className={s.bulletPurple}></span>
              Liaison: Clients, counsel and courts, kept moving to timetable
            </li>
            <li className={s.listItem}>
              <span className={s.bulletPurple}></span>
              Billing: Costing and billing prepared against accurate financial records
            </li>
            <li className={s.listItem}>
              <span className={s.bulletPurple}></span>
              Records: Document conversion and record-keeping to legal compliance standards
            </li>
            <li className={s.listItem}>
              <span className={s.bulletPurple}></span>
              Settlements: Property settlement documentation coordinated to meet every deadline
            </li>
          </ul>
          <div className={s.techBadgesContainer}>
            <span className={s.techBadge}>Legal Writing</span>
            <span className={s.techBadge}>Document Management</span>
            <span className={s.techBadge}>Compliance</span>
            <span className={s.techBadge}>Client Relations</span>
          </div>
        </div>
      ),
    },
    {
      title: "Education",
      content: (
        <div className={s.itemContainer}>
          <div className={s.itemFlexContainer}>
            <div className={s.iconContainerGreen}>
              <GraduationCap className={s.iconGreen} />
            </div>
            <div>
              <h3 className={s.contentTitle}>Queensland University of Technology (QUT)</h3>
              <p className={s.contentSubtitle}>Bachelor of Information Technology</p>
              <p className={s.contentText}>Graduating 2027 · Brisbane QLD</p>
            </div>
          </div>
          <ul className={s.list}>
            <li className={s.listItem}>
              <span className={s.bulletGreen}></span>
              Studying Information Technology with focus on full-stack development
            </li>
            <li className={s.listItem}>
              <span className={s.bulletGreen}></span>
              Building practical skills in JavaScript, Python, React, and databases
            </li>
            <li className={s.listItem}>
              <span className={s.bulletGreen}></span>
              Balancing study with freelance work and legal secretary role
            </li>
          </ul>
          <div className={s.techBadgesContainer}>
            <span className={s.techBadge}>Information Technology</span>
            <span className={s.techBadge}>Full-Stack Development</span>
            <span className={s.techBadge}>Problem Solving</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={s.container}>
      <div className={s.innerContainer}>
        <div className="mb-8">
          <div className={s.timelineBadge}>
            <span className={s.timelineBadgeText}>Career Timeline</span>
          </div>
          <h1 className={s.mainTitle}>My journey so far</h1>
          <p className={s.mainParagraph}>
            From legal secretary to freelance web developer, with a degree in IT along the way.
            <br />
            Here's a timeline of my journey so far.
          </p>
          <div className={s.legendContainer}>
            <div className={s.legendItem}>
              <div className={`${s.legendDot} bg-blue-500`}></div>
              <span className={s.legendText}>Freelance</span>
            </div>
            <div className={s.legendItem}>
              <div className={`${s.legendDot} bg-purple-500`}></div>
              <span className={s.legendText}>Legal Secretary</span>
            </div>
            <div className={s.legendItem}>
              <div className={`${s.legendDot} bg-green-500`}></div>
              <span className={s.legendText}>Education</span>
            </div>
          </div>
        </div>
        <Timeline data={data} />
        <div className={s.techSectionContainer}>
          <div className={s.techSectionHeader}>
            <div className={s.techSectionIconContainer}>
              <Code2 className={s.techSectionIcon} />
            </div>
            <div>
              <h3 className={s.techSectionTitle}>Technologies & Skills</h3>
              <p className={s.techSectionSubtitle}>Full-stack expertise and professional skills</p>
            </div>
          </div>
          <div className={s.techGrid}>
            <div className={s.techCard}>
              <div className={`${s.techCardTitle} ${s.textBlue}`}>Languages</div>
              <div className={s.techCardContent}>JavaScript, Python</div>
            </div>
            <div className={s.techCard}>
              <div className={`${s.techCardTitle} ${s.textEmerald}`}>Web & Data</div>
              <div className={s.techCardContent}>React, Node.js, PostgreSQL, MongoDB, REST, GraphQL</div>
            </div>
            <div className={s.techCard}>
              <div className={`${s.techCardTitle} ${s.textPurple}`}>Tooling & Cloud</div>
              <div className={s.techCardContent}>Git, AWS, CI/CD, Vite, Express, Tailwind</div>
            </div>
            <div className={s.techCard}>
              <div className={`${s.techCardTitle} ${s.textAmber}`}>Professional</div>
              <div className={s.techCardContent}>Legal Writing, Document Management, Client Relations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}