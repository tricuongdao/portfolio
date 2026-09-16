/** Filter groups shown on the certificates page. New groups go in this list. */
export const certificateTypeFilters = ["All", "Cyber Security"] as const;

export type CertificateTypeFilter = (typeof certificateTypeFilters)[number];
export type CertificateType = Exclude<CertificateTypeFilter, "All">;

export interface Certificate {
  id: string;
  slug: string;
  /** Full title exactly as it appears on the certificate */
  title: string;
  /** Fortinet certification level or credential code */
  level: string;
  issuer: string;
  /** Filter group shown on the certificates page */
  type: CertificateType;
  /** Exam that was passed to earn the credential */
  exam: string;
  description: string;
  /** ISO date (YYYY-MM-DD) the credential was awarded */
  dateAchieved: string;
  /** ISO date (YYYY-MM-DD) the credential expires */
  validUntil: string;
  validationNumber: string;
  /** PDF stored in /public/certificates */
  file: string;
  verifyUrl: string;
  skills: string[];
}

/**
 * Certificates earned so far. Every one of them is a Cyber Security type
 * credential. Dates and validation numbers are taken off the issued PDFs.
 */
export const certificates: Certificate[] = [
  {
    id: "1",
    slug: "fortinet-nse-1-certified-in-cybersecurity",
    title: "Fortinet NSE 1 Certified in Cybersecurity",
    level: "NSE 1",
    issuer: "Fortinet Training Institute",
    type: "Cyber Security",
    exam: "Cybersecurity and Cloud Fundamentals",
    description:
      "Entry-level certification covering today's threat landscape and the fundamentals of cybersecurity and cloud.",
    dateAchieved: "2026-09-13",
    validUntil: "2028-09-13",
    validationNumber: "1711096276TC",
    file: "/certificates/fortinet-nse-1-certified-in-cybersecurity.pdf",
    verifyUrl: "https://training.fortinet.com/admin/tool/certificate/index.php",
    skills: ["Threat landscape", "Cybersecurity fundamentals", "Cloud fundamentals"],
  },
  {
    id: "2",
    slug: "fortinet-nse-2-certified-in-cybersecurity",
    title: "Fortinet NSE 2 Certified in Cybersecurity",
    level: "NSE 2",
    issuer: "Fortinet Training Institute",
    type: "Cyber Security",
    exam: "Introduction to the Next Generation Firewall",
    description:
      "Validates the ability to identify and describe the core features of Fortinet Next Generation Firewalls.",
    dateAchieved: "2026-09-13",
    validUntil: "2028-09-13",
    validationNumber: "3618061439TC",
    file: "/certificates/fortinet-nse-2-certified-in-cybersecurity.pdf",
    verifyUrl: "https://training.fortinet.com/admin/tool/certificate/index.php",
    skills: ["Next Generation Firewall", "Firewall core features", "Network security concepts"],
  },
  {
    id: "3",
    slug: "fortinet-nse-3-certified-in-cybersecurity",
    title: "Fortinet NSE 3 Certified in Cybersecurity",
    level: "NSE 3",
    issuer: "Fortinet Training Institute",
    type: "Cyber Security",
    exam: "FortiGate Operator",
    description:
      "Covers high-level operations on a FortiGate device, including configuration and monitoring of the most common features.",
    dateAchieved: "2026-09-14",
    validUntil: "2028-09-14",
    validationNumber: "4047421317TC",
    file: "/certificates/fortinet-nse-3-certified-in-cybersecurity.pdf",
    verifyUrl: "https://training.fortinet.com/admin/tool/certificate/index.php",
    skills: ["FortiGate operations", "Configuration & monitoring", "Firewall policies"],
  },
];

/* -------------------------
   Helper utilities
   ------------------------- */

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_SHORT = MONTHS_LONG.map((month) => month.slice(0, 3));

/**
 * Formats an ISO date (YYYY-MM-DD) without going through Date, so the shown
 * day can never drift because of a timezone offset.
 */
export function formatCertificateDate(
  iso: string,
  style: "long" | "short" = "long",
): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;

  const monthLabel = (style === "long" ? MONTHS_LONG : MONTHS_SHORT)[month - 1];
  if (!monthLabel) return iso;

  return `${day} ${monthLabel} ${year}`;
}

/** True while the credential has not passed its validity date. */
export function isCertificateActive(validUntil: string): boolean {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  const todayIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return validUntil >= todayIso;
}

/** Every certificate, newest award first. */
export function getAllCertificates(): Certificate[] {
  return [...certificates].sort((a, b) => b.dateAchieved.localeCompare(a.dateAchieved));
}

/** Filter certificates by the type chips on the certificates page. */
export function getCertificatesByType(type: CertificateTypeFilter): Certificate[] {
  const all = getAllCertificates();
  if (type === "All") return all;
  return all.filter((certificate) => certificate.type === type);
}

/** Every filter chip that should be rendered, in display order. */
export function getCertificateTypeFilters(): CertificateTypeFilter[] {
  return [...certificateTypeFilters];
}

/** Return a certificate by slug or null. */
export function getCertificateBySlug(slug: string | undefined | null): Certificate | null {
  const normalized = decodeURIComponent(String(slug ?? "")).trim();
  if (!normalized) return null;
  return certificates.find((certificate) => certificate.slug === normalized) ?? null;
}