export type Division = {
  slug: string;
  name: string;
  short: string;
  description: string;
  capabilities: string[];
  icon: string;
};

export type Service = {
  slug: string;
  title: string;
  division: string;
  summary: string;
  problem: string;
  scope: string[];
  deliverables: string[];
  industries: string[];
  technologies: string[];
  published: boolean;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  classification: string;
  description: string;
  features: string[];
  status: "Live" | "Beta" | "In Development";
  stack: string[];
  url: string;
  screenshots?: string[];
  accent: string;
  logo_url?: string;
};

export type Project = {
  slug: string;
  name: string;
  client: string;
  category: string;
  description: string;
  problem: string;
  objectives: string[];
  scope: string[];
  solution: string;
  features: string[];
  technologies: string[];
  url: string;
  screenshots?: string[];
  featured: boolean;
  ownership: "CGS-owned" | "Client-commissioned" | "Partnership";
};

export type Industry = {
  slug: string;
  name: string;
  description: string;
  offerings: string[];
};

export type Publication = {
  slug: string;
  title: string;
  type: "News" | "Article" | "Research Report" | "Insight";
  category: string;
  date: string;
  excerpt: string;
  body: string[];
  tags: string[];
  featured: boolean;
  downloadable?: boolean;
  document_url?: string;
};

export type Vacancy = {
  slug: string;
  title: string;
  type:
    | "Full-time"
    | "Internship"
    | "Graduate"
    | "Research"
    | "Volunteer"
    | "Collaboration";
  location: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  published: boolean;
};

export type Inquiry = {
  id: string;
  kind: "general" | "quotation" | "consultation" | "partnership" | "service";
  name: string;
  email: string;
  organisation?: string;
  subject: string;
  message: string;
  status: "New" | "In Review" | "Responded" | "Closed";
  createdAt: string;
};
