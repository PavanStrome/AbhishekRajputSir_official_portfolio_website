import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  designation: z.string().min(1, "Designation is required"),
  department: z.string().min(1, "Department is required"),
  institution: z.string().min(1, "Institution is required"),
  location: z.string().min(1, "Location is required"),
  shortBio: z.string().min(1, "Short bio is required"),
  bio: z.string().min(1, "Full biography is required"),
  avatarUrl: z.string().nullable().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().nullable().optional(),
  office: z.string().nullable().optional(),
  officeHours: z.string().nullable().optional(),
  researchInterests: z.string().nullable().optional(),
  googleScholarUrl: z.string().nullable().optional(),
  orcidUrl: z.string().nullable().optional(),
  researchGateUrl: z.string().nullable().optional(),
  linkedinUrl: z.string().nullable().optional(),
  githubUrl: z.string().nullable().optional(),
  personalWebsiteUrl: z.string().nullable().optional(),
  scopusUrl: z.string().nullable().optional(),
  cvUrl: z.string().nullable().optional(),
});

export const researchAreaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().nullable().optional(),
  keywords: z.string().nullable().optional(),
  order: z.number().default(0),
  isPublished: z.boolean().default(true),
});

export const publicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authors: z.string().min(1, "Authors are required"),
  publicationType: z.enum(["JOURNAL", "CONFERENCE", "BOOK_CHAPTER", "BOOK", "OTHER"]).default("JOURNAL"),
  venue: z.string().min(1, "Journal / Conference venue is required"),
  year: z.coerce.number().int().min(1950).max(2050),
  month: z.string().nullable().optional(),
  volume: z.string().nullable().optional(),
  issue: z.string().nullable().optional(),
  pages: z.string().nullable().optional(),
  doi: z.string().nullable().optional(),
  paperUrl: z.string().nullable().optional(),
  pdfUrl: z.string().nullable().optional(),
  scholarUrl: z.string().nullable().optional(),
  abstract: z.string().nullable().optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  order: z.number().default(0),
  researchAreaId: z.string().nullable().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  detailedDescription: z.string().min(1, "Detailed description is required"),
  status: z.enum(["ONGOING", "COMPLETED"]).default("ONGOING"),
  role: z.string().default("Principal Investigator"),
  fundingAgency: z.string().nullable().optional(),
  grantAmount: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  projectUrl: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  order: z.number().default(0),
});

export const courseSchema = z.object({
  code: z.string().min(1, "Course code is required"),
  title: z.string().min(1, "Course title is required"),
  semester: z.string().min(1, "Semester is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  level: z.string().default("Undergraduate / Postgraduate"),
  description: z.string().min(1, "Description is required"),
  syllabusUrl: z.string().nullable().optional(),
  courseUrl: z.string().nullable().optional(),
  isPublished: z.boolean().default(true),
  order: z.number().default(0),
});

export const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["PHD", "MASTERS", "UNDERGRAD", "ALUMNI", "STAFF"]).default("PHD"),
  researchArea: z.string().nullable().optional(),
  degree: z.string().nullable().optional(),
  joiningYear: z.string().nullable().optional(),
  graduationYear: z.string().nullable().optional(),
  status: z.enum(["CURRENT", "GRADUATED"]).default("CURRENT"),
  photoUrl: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  websiteUrl: z.string().nullable().optional(),
  linkedinUrl: z.string().nullable().optional(),
  scholarUrl: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  order: z.number().default(0),
  isPublished: z.boolean().default(true),
});

export const awardSchema = z.object({
  title: z.string().min(1, "Award title is required"),
  organization: z.string().min(1, "Organization is required"),
  year: z.string().min(1, "Year is required"),
  description: z.string().nullable().optional(),
  certificateUrl: z.string().nullable().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  order: z.number().default(0),
});

export const newsSchema = z.object({
  title: z.string().min(1, "News title is required"),
  slug: z.string().min(1, "Slug is required"),
  date: z.string().or(z.date()).transform((v) => new Date(v)),
  content: z.string().min(1, "Content is required"),
  category: z.string().default("ANNOUNCEMENT"),
  imageUrl: z.string().nullable().optional(),
  externalUrl: z.string().nullable().optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  order: z.number().default(0),
});

export const siteSettingsSchema = z.object({
  siteTitle: z.string().min(1, "Site title is required"),
  siteDescription: z.string().min(1, "Site description is required"),
  contactEmail: z.string().email("Invalid contact email"),
  footerText: z.string().nullable().optional(),
  theme: z.string().optional().default("cream-terracotta"),
  enableNews: z.boolean().default(true),
  enableStudents: z.boolean().default(true),
});
