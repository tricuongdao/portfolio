"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CometCard } from "@/components/ui/comet-card";
// Adjust import path based on where you placed dummyStyles.js
import { toolsPageStyles } from "@/public/dummyStyles";

interface Tool {
  name: string;
  category: string;
  icon: string;
  href: string;
}

const tools: Tool[] = [
  {
    name: "VS Code",
    category: "Editor",
    icon: "/vscode.webp",
    href: "https://code.visualstudio.com",
  },
];

export default function ToolsPage() {
  return (
    <div className={toolsPageStyles.pageContainer}>
      <div className={toolsPageStyles.contentContainer}>
        {/* Header */}
        <div className={toolsPageStyles.headerContainer}>
          <h1 className={toolsPageStyles.headerTitle}>
            Shovels
          </h1>
          <p className={toolsPageStyles.headerSubtitle}>
            Tools I frequently use to make life easier
          </p>
        </div>

        {/* Tools Grid */}
        <div className={toolsPageStyles.toolsGrid}>
          {tools.map((tool) => (
            <CometCard key={tool.name}>
              <Link
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className={toolsPageStyles.toolCardLink}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Icon */}
                <div className={toolsPageStyles.toolIconContainer}>
                  <Image
                    src={tool.icon}
                    alt={`${tool.name} logo`}
                    width={56}
                    height={56}
                    className={toolsPageStyles.toolIcon}
                  />
                </div>

                {/* Name & Category */}
                <div className={toolsPageStyles.toolTextContainer}>
                  <h3 className={toolsPageStyles.toolName}>
                    {tool.name}
                  </h3>
                  <p className={toolsPageStyles.toolCategory}>
                    {tool.category}
                  </p>
                </div>
              </Link>
            </CometCard>
          ))}
        </div>
      </div>
    </div>
  );
}