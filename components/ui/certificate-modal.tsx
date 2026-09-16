"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  certificateModalStyles as s,
  certificateTypeStyles,
  certificateTypeFallbackStyle,
} from "@/public/dummyStyles";
import {
  Certificate,
  formatCertificateDate,
  isCertificateActive,
} from "@/lib/certificates-data";

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 8l8 8m0-8l-8 8" />
  </svg>
);

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5M19 5l-7 7M18 14v5H5V6h5" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
  </svg>
);

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  const [frameLoaded, setFrameLoaded] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Reset the loading state whenever a different certificate is opened.
  useEffect(() => {
    setFrameLoaded(false);
  }, [certificate?.slug]);

  // Escape to close, lock background scrolling and move focus into the dialog.
  useEffect(() => {
    if (!certificate) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [certificate, onClose]);

  const typeStyle = certificate
    ? certificateTypeStyles[certificate.type] ?? certificateTypeFallbackStyle
    : certificateTypeFallbackStyle;

  const isActive = certificate ? isCertificateActive(certificate.validUntil) : false;

  // The panel lifts and settles into place, matching the tilt feel of the cards.
  const panelMotion = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, scale: 0.94, y: 28, rotateX: 10 },
        animate: { opacity: 1, scale: 1, y: 0, rotateX: 0 },
        exit: { opacity: 0, scale: 0.96, y: 18, rotateX: 4 },
      };

  return (
    <AnimatePresence>
      {certificate && (
        <motion.div
          className={s.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-modal-title"
        >
          <motion.div
            className={s.panel}
            style={{ transformPerspective: 1400, transformStyle: "preserve-3d" }}
            initial={panelMotion.initial}
            animate={panelMotion.animate}
            exit={panelMotion.exit}
            transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.9 }}
            onClick={(event) => event.stopPropagation()}
          >
            <span className={s.panelGlow} />

            <div className={s.header}>
              <div className={s.headerLeft}>
                <span className={`${s.headerTypeBadge} ${typeStyle}`}>{certificate.type}</span>
                <h2 id="certificate-modal-title" className={s.title}>
                  {certificate.title}
                </h2>
                <p className={s.subtitle}>
                  {certificate.issuer} · {certificate.exam} · Issued{" "}
                  {formatCertificateDate(certificate.dateAchieved)}
                </p>
              </div>

              <div className={s.actions}>
                <a
                  href={certificate.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.actionButton}
                >
                  <ExternalLinkIcon className={s.actionIcon} />
                  Open in new tab
                </a>
                <a href={certificate.file} download className={s.actionButton}>
                  <DownloadIcon className={s.actionIcon} />
                  Download
                </a>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  className={s.closeButton}
                  aria-label="Close certificate viewer"
                >
                  <CloseIcon className={s.closeIcon} />
                </button>
              </div>
            </div>

            <div className={s.body}>
              <div className={s.frameContainer}>
                {!frameLoaded && (
                  <div className={s.loader}>
                    <span className={s.loaderSpinner} />
                    <span className={s.loaderText}>Loading certificate…</span>
                  </div>
                )}
                <iframe
                  key={certificate.slug}
                  src={`${certificate.file}#view=FitH&toolbar=0&navpanes=0`}
                  title={`${certificate.title} certificate`}
                  className={`${s.frame} ${frameLoaded ? s.frameVisible : s.frameHidden}`}
                  onLoad={() => setFrameLoaded(true)}
                />
              </div>
              <p className={s.frameHint}>
                Certificate not showing?{" "}
                <a
                  href={certificate.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.frameHintLink}
                >
                  Open the PDF in a new tab
                </a>
              </p>
            </div>

            <div className={s.footer}>
              <p className={s.footerText}>
                Validation number{" "}
                <span className="font-mono text-zinc-300">{certificate.validationNumber}</span>
                {isActive
                  ? ` · Valid until ${formatCertificateDate(certificate.validUntil)}`
                  : ` · Expired ${formatCertificateDate(certificate.validUntil)}`}
              </p>
              <a
                href={certificate.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={s.footerLink}
              >
                Verify this certification
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CertificateModal;
