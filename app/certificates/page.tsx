"use client";

import React, { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CometCard } from "@/components/ui/comet-card";
import { CertificateModal } from "@/components/ui/certificate-modal";
import {
  Certificate,
  CertificateTypeFilter,
  formatCertificateDate,
  getCertificateTypeFilters,
  getCertificatesByType,
  isCertificateActive,
} from "@/lib/certificates-data";
import {
  certificatesPageStyles as s,
  certificateTypeStyles,
  certificateTypeFallbackStyle,
  filterBarStyles as f,
} from "@/public/dummyStyles";

const AwardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" aria-hidden="true">
    <circle cx="12" cy="9" r="5.5" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0l-6-6m6 6l-6 6" />
  </svg>
);

export default function CertificatesPage() {
  const [activeType, setActiveType] = useState<CertificateTypeFilter>("All");
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const typeFilters = useMemo(() => getCertificateTypeFilters(), []);
  const allCertificates = useMemo(() => getCertificatesByType("All"), []);
  const visibleCertificates = useMemo(
    () => getCertificatesByType(activeType),
    [activeType],
  );
  const countByType = useMemo(
    () => new Map(typeFilters.map((type) => [type, getCertificatesByType(type).length])),
    [typeFilters],
  );

  const closeModal = useCallback(() => setSelectedCertificate(null), []);

  const cardTransition = (index: number) =>
    prefersReducedMotion
      ? { duration: 0.001 }
      : { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const, delay: index * 0.06 };

  return (
    <div className={s.pageContainer}>
      <div className={s.contentContainer}>
        {/* Header */}
        <div className={s.headerContainer}>
          <span className={s.headerBadge}>
            <span className={s.headerBadgeDot} />
            Verified credentials
          </span>
          <h1 className={s.headerTitle}>Certificates</h1>
          <p className={s.headerSubtitle}>
            Certifications I have earned and keep current. Every card opens the original
            certificate so you can check it yourself.
          </p>
        </div>

        {/* Type filter */}
        <div
          className={f.section}
          role="group"
          aria-label="Filter certificates by type"
        >
          <span className={f.label}>Type</span>
          {typeFilters.map((type) => {
            const isActive = type === activeType;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                aria-pressed={isActive}
                className={`${f.chip} ${isActive ? f.chipActive : f.chipInactive}`}
              >
                {type}
                <span className={f.chipCount}>{countByType.get(type) ?? 0}</span>
              </button>
            );
          })}
          <span className={f.resultText}>
            Showing {visibleCertificates.length} of {allCertificates.length}
          </span>
        </div>

        {/* Certificates grid */}
        <motion.div layout className={s.certificatesGrid}>
          <AnimatePresence mode="popLayout">
            {visibleCertificates.map((certificate, index) => (
              <motion.div
                key={certificate.slug}
                layout
                className="h-full"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.97 }}
                transition={cardTransition(index)}
              >
                <CometCard className="h-full">
                  <CertificateCard
                    certificate={certificate}
                    onOpen={() => setSelectedCertificate(certificate)}
                  />
                </CometCard>
              </motion.div>
            ))}
          </AnimatePresence>
          {visibleCertificates.length === 0 && (
            <p className={s.emptyState}>No certificates in this type yet.</p>
          )}
        </motion.div>
      </div>

      <CertificateModal certificate={selectedCertificate} onClose={closeModal} />
    </div>
  );
}

function CertificateCard({
  certificate,
  onOpen,
}: {
  certificate: Certificate;
  onOpen: () => void;
}) {
  const typeStyle =
    certificateTypeStyles[certificate.type] ?? certificateTypeFallbackStyle;
  const isActive = isCertificateActive(certificate.validUntil);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={s.certificateCard}
      aria-label={`View ${certificate.title} certificate`}
      data-cursor-label="View"
      style={{ transformStyle: "preserve-3d" }}
    >
      <span className={s.certificateCardShimmer} />

      <div className={s.certificateCardTop}>
        <div className={s.certificateIconContainer}>
          <span className={s.certificateIconGlow} />
          <AwardIcon className={s.certificateIcon} />
        </div>
        <span className={`${s.certificateTypeBadge} ${typeStyle}`}>
          {certificate.type}
        </span>
      </div>

      <h3 className={s.certificateTitle}>{certificate.title}</h3>
      <p className={s.certificateIssuer}>
        {certificate.issuer} · {certificate.exam}
      </p>
      <p className={s.certificateDescription}>{certificate.description}</p>

      <div className={s.certificateMetaList}>
        <div className={s.certificateMetaRow}>
          <span className={s.certificateMetaLabel}>Level</span>
          <span className={s.certificateMetaValue}>{certificate.level}</span>
        </div>
        <div className={s.certificateMetaRow}>
          <span className={s.certificateMetaLabel}>Achieved</span>
          <span className={s.certificateMetaValue}>
            {formatCertificateDate(certificate.dateAchieved, "short")}
          </span>
        </div>
        <div className={s.certificateMetaRow}>
          <span className={s.certificateMetaLabel}>Valid until</span>
          <span className={isActive ? s.certificateStatusActive : s.certificateStatusExpired}>
            <span
              className={
                isActive ? s.certificateStatusDotActive : s.certificateStatusDotExpired
              }
            />
            {formatCertificateDate(certificate.validUntil, "short")}
          </span>
        </div>
        <div className={s.certificateMetaRow}>
          <span className={s.certificateMetaLabel}>Validation no.</span>
          <span className={s.certificateMetaValueMono}>
            {certificate.validationNumber}
          </span>
        </div>
      </div>

      <div className={s.certificateSkills}>
        {certificate.skills.map((skill) => (
          <span key={skill} className={s.certificateSkill}>
            {skill}
          </span>
        ))}
      </div>

      <div className={s.certificateCardFooter}>
        <span className={s.certificateCardFooterText}>View certificate</span>
        <ArrowRightIcon className={s.certificateCardFooterIcon} />
      </div>
    </button>
  );
}