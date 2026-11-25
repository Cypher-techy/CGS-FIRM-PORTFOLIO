import type {
  Division,
  Service,
  Product,
  Project,
  Industry,
  Publication,
  Vacancy,
} from "./types";

/* ── Business divisions ─────────────────────────────────────────── */
export const DIVISIONS: Division[] = [
  {
    slug: "environmental-sustainability",
    name: "Environmental & Sustainability Solutions",
    short:
      "Practical environmental assessment, monitoring and sustainability planning for organisations that need evidence-based decisions.",
    description:
      "This division helps organisations understand their environmental footprint and act on it. We combine field-informed assessment with data-driven analysis to support compliance, planning and measurable sustainability outcomes.",
    capabilities: [
      "Environmental assessments",
      "Environmental monitoring",
      "Environmental management",
      "Sustainability planning",
      "Waste management solutions",
      "Natural resource management",
    ],
    icon: "Leaf",
  },
  {
    slug: "gis-geospatial-intelligence",
    name: "GIS & Geospatial Intelligence",
    short:
      "Spatial data, mapping and remote-sensing analysis that turns location into decision-ready intelligence.",
    description:
      "From GIS mapping and geospatial databases to land-use analysis and spatial decision-support systems, this division converts spatial data into insight for planning, conservation and development.",
    capabilities: [
      "GIS mapping",
      "Remote sensing",
      "Spatial analysis",
      "Geospatial databases",
      "Land-use & land-cover analysis",
      "Environmental mapping",
      "Spatial decision-support systems",
    ],
    icon: "Globe",
  },
  {
    slug: "software-digital-systems",
    name: "Software & Digital Systems",
    short:
      "Custom web applications, enterprise systems and digital platforms engineered for reliability and scale.",
    description:
      "We design and build custom web applications, enterprise management systems and information platforms — from learning management systems to API integrations and full digital transformation programmes.",
    capabilities: [
      "Custom web application development",
      "Enterprise management systems",
      "Information management systems",
      "Learning management systems",
      "Database solutions",
      "API integration",
      "Digital transformation",
    ],
    icon: "Code2",
  },
  {
    slug: "data-science-analytics",
    name: "Data Science & Analytics",
    short:
      "Environmental data analysis, statistical modelling and decision-support dashboards built on Python and modern tooling.",
    description:
      "This division turns raw data into decisions: environmental data analysis, statistical analysis, data visualisation, Python-based solutions, Excel automation and executive dashboards.",
    capabilities: [
      "Environmental data analysis",
      "Statistical analysis",
      "Data visualisation",
      "Python-based solutions",
      "Excel automation",
      "Decision-support dashboards",
      "Data management",
    ],
    icon: "BarChart3",
  },
  {
    slug: "climate-carbon-solutions",
    name: "Climate & Carbon Solutions",
    short:
      "Carbon project intelligence, MRV support and climate data analysis for credible climate action.",
    description:
      "We support climate and carbon initiatives with GIS-supported project assessment, monitoring, reporting and verification (MRV) support, climate data analysis and forest and ecosystem monitoring.",
    capabilities: [
      "Carbon project intelligence",
      "GIS-supported carbon project assessment",
      "Monitoring, Reporting & Verification (MRV) support",
      "Climate data analysis",
      "Forest & ecosystem monitoring",
      "Climate technology research",
    ],
    icon: "CloudSun",
  },
  {
    slug: "research-innovation",
    name: "Research & Innovation",
    short:
      "Applied research, prototyping and emerging-technology development at the intersection of environment and technology.",
    description:
      "Our research division runs applied research, technology prototyping, environmental innovation and digital experimentation — often in collaboration with universities, NGOs and development partners.",
    capabilities: [
      "Applied research",
      "Technology prototyping",
      "Environmental innovation",
      "Digital experimentation",
      "Research collaborations",
      "Emerging technology development",
    ],
    icon: "FlaskConical",
  },
];

/* ── Services ───────────────────────────────────────────────────── */
export const SERVICES: Service[] = [
  {
    slug: "environmental-assessment",
    title: "Environmental Assessment & Impact Studies",
    division: "Environmental & Sustainability Solutions",
    summary:
      "Structured environmental assessments that give decision-makers a clear, evidence-based picture of environmental risk and opportunity.",
    problem:
      "Organisations often lack a reliable, documented understanding of their environmental impacts before planning, financing or approval decisions.",
    scope: [
      "Baseline environmental data collection",
      "Impact identification and significance rating",
      "Mitigation and management recommendations",
      "Reporting aligned to applicable frameworks",
    ],
    deliverables: [
      "Environmental assessment report",
      "Impact register",
      "Mitigation & monitoring plan",
    ],
    industries: [
      "Government & public institutions",
      "NGOs & development organisations",
      "Agriculture & agribusiness",
    ],
    technologies: [
      "Field survey methods",
      "GIS mapping",
      "Statistical analysis",
    ],
    published: true,
  },
  {
    slug: "environmental-monitoring",
    title: "Environmental Monitoring Programmes",
    division: "Environmental & Sustainability Solutions",
    summary:
      "Designed monitoring programmes with repeatable methods, quality-controlled data and reporting that stands up to scrutiny.",
    problem:
      "One-off studies cannot show change over time. Without structured monitoring, trends, compliance and intervention effectiveness remain invisible.",
    scope: [
      "Monitoring design and indicator selection",
      "Field and remote data collection protocols",
      "Data quality assurance",
      "Periodic reporting and trend analysis",
    ],
    deliverables: [
      "Monitoring framework",
      "Data collection protocols",
      "Periodic monitoring reports",
    ],
    industries: [
      "Environmental & conservation organisations",
      "Government & public institutions",
      "Climate & carbon projects",
    ],
    technologies: ["Remote sensing", "GIS databases", "Python analytics"],
    published: true,
  },
  {
    slug: "sustainability-planning",
    title: "Sustainability Planning & Strategy",
    division: "Environmental & Sustainability Solutions",
    summary:
      "Practical sustainability strategies that connect environmental goals to operational reality and measurable targets.",
    problem:
      "Sustainability commitments frequently fail because they are disconnected from budgets, responsibilities and measurable outcomes.",
    scope: [
      "Sustainability baseline and materiality review",
      "Strategy and target setting",
      "Implementation roadmaps",
      "Reporting frameworks",
    ],
    deliverables: [
      "Sustainability strategy",
      "Action roadmap",
      "KPI dashboard specification",
    ],
    industries: [
      "SMEs & startups",
      "Hospitality & tourism",
      "Retail & commerce",
    ],
    technologies: ["Data analytics", "Decision-support dashboards"],
    published: true,
  },
  {
    slug: "gis-mapping",
    title: "GIS Mapping & Spatial Analysis",
    division: "GIS & Geospatial Intelligence",
    summary:
      "Professional GIS mapping and spatial analysis for planning, conservation, infrastructure and resource management.",
    problem:
      "Location-dependent decisions are often made with incomplete or outdated spatial information, leading to poor siting, duplicated effort and missed opportunities.",
    scope: [
      "Data acquisition and cleaning",
      "Geospatial database design",
      "Spatial analysis and modelling",
      "Cartographic production",
    ],
    deliverables: [
      "GIS database",
      "Analytical maps",
      "Spatial analysis report",
    ],
    industries: [
      "Government & public institutions",
      "Environmental & conservation organisations",
      "Agriculture & agribusiness",
    ],
    technologies: [
      "QGIS / ArcGIS",
      "PostGIS",
      "Python (GeoPandas)",
      "MapLibre GL",
    ],
    published: true,
  },
  {
    slug: "remote-sensing-land-cover",
    title: "Remote Sensing & Land-Use / Land-Cover Analysis",
    division: "GIS & Geospatial Intelligence",
    summary:
      "Satellite-image analysis that quantifies land-use and land-cover change for planning, carbon and conservation programmes.",
    problem:
      "Land-cover change is difficult to measure consistently across large areas without remote sensing, yet it underpins carbon accounting, planning and conservation decisions.",
    scope: [
      "Image acquisition and preprocessing",
      "Classification and change detection",
      "Accuracy assessment",
      "Change statistics and reporting",
    ],
    deliverables: [
      "Classified imagery & change maps",
      "Accuracy report",
      "Land-cover statistics",
    ],
    industries: [
      "Environmental & conservation organisations",
      "Climate & carbon projects",
      "Government & public institutions",
    ],
    technologies: [
      "Sentinel / Landsat imagery",
      "Google Earth Engine",
      "Python (scikit-learn)",
    ],
    published: true,
  },
  {
    slug: "spatial-decision-support",
    title: "Spatial Decision-Support Systems",
    division: "GIS & Geospatial Intelligence",
    summary:
      "Interactive spatial tools that let stakeholders explore scenarios, compare options and make defensible location-based decisions.",
    problem:
      "Static maps cannot support collaborative scenario planning. Stakeholders need interactive tools to test alternatives and see trade-offs.",
    scope: [
      "Requirements and stakeholder analysis",
      "Web-based spatial application development",
      "Scenario and suitability modelling",
      "User training and handover",
    ],
    deliverables: [
      "Web decision-support application",
      "Suitability / scenario models",
      "User documentation",
    ],
    industries: [
      "Government & public institutions",
      "NGOs & development organisations",
      "Agriculture & agribusiness",
    ],
    technologies: ["MapLibre GL", "PostGIS", "Next.js", "Python APIs"],
    published: true,
  },
  {
    slug: "custom-web-applications",
    title: "Custom Web Application Development",
    division: "Software & Digital Systems",
    summary:
      "Bespoke web applications — from customer portals to internal tools — engineered for performance, security and maintainability.",
    problem:
      "Off-the-shelf software rarely fits specialised workflows, and generic templates cannot support the data, integrations and reporting an organisation actually needs.",
    scope: [
      "Requirements discovery and system design",
      "UI/UX design",
      "Full-stack development",
      "Testing, deployment and handover",
    ],
    deliverables: [
      "Production web application",
      "Source code & documentation",
      "Deployment & training",
    ],
    industries: [
      "Education & research institutions",
      "Hospitality & tourism",
      "Retail & commerce",
      "SMEs & startups",
    ],
    technologies: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    published: true,
  },
  {
    slug: "enterprise-management-systems",
    title: "Enterprise & Information Management Systems",
    division: "Software & Digital Systems",
    summary:
      "Integrated management systems that replace fragmented spreadsheets and manual processes with a single source of truth.",
    problem:
      "Fragmented tools and manual processes create data silos, reconciliation errors and slow reporting across departments.",
    scope: [
      "Process analysis and system architecture",
      "Database design and development",
      "Role-based access and workflows",
      "Reporting and audit trails",
    ],
    deliverables: [
      "Management system",
      "Database & API layer",
      "Administrator training",
    ],
    industries: [
      "Education & research institutions",
      "Healthcare",
      "Government & public institutions",
      "Agriculture & agribusiness",
    ],
    technologies: ["Next.js", "PostgreSQL", "Supabase Auth", "REST APIs"],
    published: true,
  },
  {
    slug: "learning-management-systems",
    title: "Learning Management Systems",
    division: "Software & Digital Systems",
    summary:
      "Digital learning platforms with course management, assessment, progress tracking and learner engagement tools.",
    problem:
      "Institutions struggle to scale quality learning delivery and track learner progress without a dedicated digital platform.",
    scope: [
      "Platform configuration and customisation",
      "Course and content management",
      "Assessment and certification workflows",
      "Analytics and reporting",
    ],
    deliverables: [
      "LMS deployment",
      "Course structure & content tools",
      "Administrator & instructor training",
    ],
    industries: [
      "Education & research institutions",
      "NGOs & development organisations",
    ],
    technologies: ["Next.js", "Supabase", "Vercel"],
    published: true,
  },
  {
    slug: "environmental-data-analysis",
    title: "Environmental Data Analysis & Visualisation",
    division: "Data Science & Analytics",
    summary:
      "Statistical analysis and clear visualisation of environmental datasets — from water quality to biodiversity monitoring.",
    problem:
      "Environmental datasets are often collected but never analysed, leaving valuable monitoring investment without decision value.",
    scope: [
      "Data cleaning and quality assurance",
      "Statistical analysis",
      "Visualisation and dashboard design",
      "Interpretation and reporting",
    ],
    deliverables: [
      "Analytical report",
      "Interactive dashboards",
      "Cleaned, documented datasets",
    ],
    industries: [
      "Environmental & conservation organisations",
      "Government & public institutions",
      "Climate & carbon projects",
    ],
    technologies: [
      "Python (pandas, matplotlib)",
      "Excel automation",
      "Power BI / custom dashboards",
    ],
    published: true,
  },
  {
    slug: "decision-support-dashboards",
    title: "Decision-Support Dashboards",
    division: "Data Science & Analytics",
    summary:
      "Live dashboards that turn organisational and environmental data into clear, actionable insight for leadership teams.",
    problem:
      "Leadership decisions are slowed by scattered reports and outdated figures. Dashboards provide a single, trusted view of key indicators.",
    scope: [
      "KPI definition and data-source mapping",
      "Data pipeline development",
      "Dashboard design and build",
      "Training and documentation",
    ],
    deliverables: [
      "Interactive dashboard",
      "Data pipeline",
      "KPI documentation",
    ],
    industries: [
      "SMEs & startups",
      "Retail & commerce",
      "Hospitality & tourism",
      "Government & public institutions",
    ],
    technologies: ["Python", "Next.js", "PostgreSQL", "Charting libraries"],
    published: true,
  },
  {
    slug: "carbon-project-assessment",
    title: "Carbon Project Intelligence & Assessment",
    division: "Climate & Carbon Solutions",
    summary:
      "GIS-supported assessment of carbon project potential, additionality and feasibility before investment decisions are made.",
    problem:
      "Carbon project claims require credible spatial evidence. Without rigorous assessment, projects risk invalidation, reputational damage and financial loss.",
    scope: [
      "Spatial feasibility screening",
      "Baseline and additionality analysis",
      "Risk assessment",
      "Go / no-go recommendation report",
    ],
    deliverables: [
      "Feasibility assessment report",
      "Spatial evidence pack",
      "Risk register",
    ],
    industries: [
      "Climate & carbon projects",
      "Environmental & conservation organisations",
      "Financial technology",
    ],
    technologies: [
      "GIS & remote sensing",
      "Python analytics",
      "MRV frameworks",
    ],
    published: true,
  },
  {
    slug: "mrv-support",
    title: "Monitoring, Reporting & Verification (MRV) Support",
    division: "Climate & Carbon Solutions",
    summary:
      "Technical support for MRV systems — the measurement backbone that makes carbon and climate claims credible.",
    problem:
      "Weak MRV undermines carbon credit integrity. Projects need robust, auditable measurement systems from design through verification.",
    scope: [
      "MRV system design",
      "Indicator and protocol development",
      "Data management systems",
      "Verification-readiness review",
    ],
    deliverables: [
      "MRV plan",
      "Data management system",
      "Verification-readiness report",
    ],
    industries: [
      "Climate & carbon projects",
      "Environmental & conservation organisations",
    ],
    technologies: ["Remote sensing", "GIS databases", "Python pipelines"],
    published: true,
  },
  {
    slug: "digital-transformation",
    title: "Digital Transformation Consulting",
    division: "Software & Digital Systems",
    summary:
      "End-to-end digital transformation support: assessment, roadmap, system selection and implementation oversight.",
    problem:
      "Organisations invest in technology without a coherent strategy, resulting in disconnected tools and unrealised returns.",
    scope: [
      "Digital maturity assessment",
      "Transformation roadmap",
      "Vendor / platform evaluation",
      "Implementation support",
    ],
    deliverables: [
      "Digital transformation roadmap",
      "System selection report",
      "Implementation plan",
    ],
    industries: [
      "SMEs & startups",
      "Education & research institutions",
      "Government & public institutions",
      "Healthcare",
    ],
    technologies: [
      "Enterprise architecture",
      "Cloud platforms",
      "API integration",
    ],
    published: true,
  },
];

/* ── Products ───────────────────────────────────────────────────── */
export const PRODUCTS: Product[] = [
  {
    slug: "cypher-terra",
    name: "Cypher Terra",
    category: "Environmental Technology",
    classification: "Environmental technology and intelligence platform",
    description:
      "An environmental information and intelligence platform combining GIS-related capabilities, educational resources and community-oriented environmental solutions. Cypher Terra is CGS's flagship environmental platform.",
    features: [
      "Environmental information hub",
      "GIS-related mapping capabilities",
      "Educational resources",
      "Community-oriented environmental tools",
    ],
    status: "Live",
    stack: [],
    url: "https://cypher-green-systems.vercel.app",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    slug: "edvora-lms",
    name: "Edvora LMS",
    category: "Education Technology",
    classification: "Learning management and digital education platform",
    description:
      "A learning management system for digital education delivery — course management, learner progress tracking and structured learning pathways for institutions and training providers.",
    features: [
      "Course & content management",
      "Learner progress tracking",
      "Assessment workflows",
      "Instructor dashboards",
    ],
    status: "Live",
    stack: [],
    url: "https://edvora-lms.vercel.app",
    accent: "from-sky-500 to-blue-600",
  },
  {
    slug: "cypher-fx",
    name: "Cypher FX",
    category: "Financial Technology",
    classification: "Financial trading software and digital financial tools",
    description:
      "A development-stage financial technology workspace for market exploration, synthetic chart replay and practice-order review. It is not a service for depositing customer funds.",
    features: [
      "Interactive market replay",
      "Practice trade review",
      "Market explorer",
      "Margin and pip estimation",
    ],
    status: "Beta",
    stack: ["Next.js", "React", "TypeScript", "PostgreSQL"],
    url: "https://cypher-fx-beta.vercel.app",
    accent: "from-amber-500 to-orange-600",
  },
  {
    slug: "chalar-farm-inventory",
    name: "Chalar Farm Inventory System",
    category: "Agricultural Technology",
    classification: "Agricultural inventory and farm management software",
    description:
      "Agricultural inventory and farm management software for tracking stock, inputs and farm operations — built for practical day-to-day farm administration.",
    features: [
      "Inventory & stock tracking",
      "Farm operations management",
      "Supplier & input records",
      "Reporting tools",
    ],
    status: "Live",
    stack: ["Next.js", "React", "TypeScript", "PostgreSQL", "Drizzle ORM"],
    url: "https://chalarfarminventorysystem.vercel.app",
    accent: "from-lime-500 to-green-600",
  },
];

/* ── Projects (client portfolio — commissioned work) ────────────── */
export const PROJECTS: Project[] = [
  {
    slug: "kingangi-hotel-system",
    name: "Kingangi Hotel System",
    client: "Kingangi Hotel",
    category: "Hospitality Management System",
    description:
      "Public hotel website and operations desk for two branches, combining a digital menu, ordering and staff workflows.",
    problem:
      "Guests and staff need a consistent way to place, route and track orders across branches.",
    objectives: [
      "Present the menu online",
      "Keep orders and operational records branch-specific",
    ],
    scope: ["Public website and multi-branch operations system"],
    solution:
      "A mobile-first menu and ordering experience connects to a protected operations desk.",
    features: [
      "Digital menu and category filters",
      "Branch-specific ordering",
      "Kitchen order queue",
      "Inventory adjustments and reporting",
    ],
    technologies: ["Next.js", "PostgreSQL", "Drizzle ORM"],
    url: "https://kingangi-hotel-system-hotel-system.vercel.app",
    featured: true,
    ownership: "Client-commissioned",
  },
  {
    slug: "sensei-brand-portfolio",
    name: "Sensei Brand & Portfolio",
    client: "Sensei Brand",
    category: "Brand & Portfolio Website",
    description: "A brand and portfolio website for Sensei.",
    problem: "An online presence for the organisation and its work.",
    objectives: ["Provide a public point of reference for visitors"],
    scope: [
      "Commissioned digital presence; further engagement details are subject to client disclosure.",
    ],
    solution: "A brand and portfolio website for Sensei.",
    features: ["Public-facing website"],
    technologies: [],
    url: "https://sensei-brand-and-portfolio.vercel.app",
    featured: true,
    ownership: "Client-commissioned",
  },
  {
    slug: "frontpage-supermarket",
    name: "Frontpage Supermarket",
    client: "Frontpage Supermarket",
    category: "Retail & Commerce Platform",
    description: "A retail website for Frontpage Supermarket.",
    problem: "An online presence for the organisation and its work.",
    objectives: ["Provide a public point of reference for visitors"],
    scope: [
      "Commissioned digital presence; further engagement details are subject to client disclosure.",
    ],
    solution: "A retail website for Frontpage Supermarket.",
    features: ["Public-facing website"],
    technologies: [],
    url: "https://frontpage-supermarket-cyphertic.vercel.app",
    featured: true,
    ownership: "Client-commissioned",
  },
  {
    slug: "view-point-inn",
    name: "View Point Inn",
    client: "View Point Inn",
    category: "Hospitality Website",
    description:
      "A hospitality website for an inn, presenting accommodation, amenities and booking enquiries.",
    problem:
      "The inn needed an online presence that reflects the guest experience and converts interest into bookings.",
    objectives: [
      "Showcase rooms and amenities",
      "Support booking enquiries",
      "Improve discoverability",
    ],
    scope: [
      "Design and development",
      "Content and imagery structure",
      "Deployment",
    ],
    solution:
      "A public accommodation and booking website with a staff dashboard.",
    features: [
      "Rooms and amenities",
      "Room, table and event bookings",
      "Staff dashboard",
    ],
    technologies: ["Node.js"],
    url: "https://view-point-inn.vercel.app",
    featured: false,
    ownership: "Client-commissioned",
  },
  {
    slug: "summertime-grooming-beauty-hub",
    name: "Summertime Grooming & Beauty Hub",
    client: "Summertime Grooming & Beauty Hub",
    category: "Beauty & Services Website",
    description:
      "A service-business website for Summertime Grooming & Beauty Hub.",
    problem: "An online presence for the organisation and its work.",
    objectives: ["Provide a public point of reference for visitors"],
    scope: [
      "Commissioned digital presence; further engagement details are subject to client disclosure.",
    ],
    solution:
      "A service-business website for Summertime Grooming & Beauty Hub.",
    features: ["Public-facing website"],
    technologies: [],
    url: "https://summertime-grooming-beauty-hub.vercel.app",
    featured: false,
    ownership: "Client-commissioned",
  },
  {
    slug: "rgc-makindu",
    name: "RGC Makindu",
    client: "RGC Makindu",
    category: "Institutional Website",
    description: "An institutional website for RGC Makindu.",
    problem: "An online presence for the organisation and its work.",
    objectives: ["Provide a public point of reference for visitors"],
    scope: [
      "Commissioned digital presence; further engagement details are subject to client disclosure.",
    ],
    solution: "An institutional website for RGC Makindu.",
    features: ["Public-facing website"],
    technologies: [],
    url: "https://rgcmakindu.vercel.app",
    featured: false,
    ownership: "Client-commissioned",
  },
];

/* ── Industries ─────────────────────────────────────────────────── */
export const INDUSTRIES: Industry[] = [
  {
    slug: "environment-conservation",
    name: "Environmental & Conservation Organisations",
    description:
      "Monitoring, GIS analysis and reporting that strengthens conservation outcomes.",
    offerings: [
      "Environmental monitoring",
      "GIS & remote sensing",
      "Impact assessment",
    ],
  },
  {
    slug: "agriculture-agribusiness",
    name: "Agriculture & Agribusiness",
    description:
      "Farm management systems, inventory tools and spatial analysis for productive, sustainable agriculture.",
    offerings: [
      "Farm inventory systems",
      "Land-use analysis",
      "Data dashboards",
    ],
  },
  {
    slug: "education-research",
    name: "Education & Research Institutions",
    description:
      "Learning platforms, research data systems and digital infrastructure for teaching and discovery.",
    offerings: [
      "Learning management systems",
      "Research data management",
      "Digital transformation",
    ],
  },
  {
    slug: "hospitality-tourism",
    name: "Hospitality & Tourism",
    description:
      "Management systems and websites that improve guest experience and operational efficiency.",
    offerings: [
      "Hotel management systems",
      "Booking websites",
      "Operations dashboards",
    ],
  },
  {
    slug: "retail-commerce",
    name: "Retail & Commerce",
    description:
      "Digital storefronts, catalogues and management tools for modern retail businesses.",
    offerings: ["Commerce websites", "Inventory systems", "Customer platforms"],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    description:
      "Information management systems that support reliable records, reporting and service delivery.",
    offerings: [
      "Information management systems",
      "Reporting dashboards",
      "Data management",
    ],
  },
  {
    slug: "government-public",
    name: "Government & Public Institutions",
    description:
      "Spatial planning tools, data systems and digital services for public-sector delivery.",
    offerings: [
      "Spatial decision support",
      "GIS databases",
      "Digital services",
    ],
  },
  {
    slug: "ngo-development",
    name: "NGOs & Development Organisations",
    description:
      "Programme data systems, monitoring tools and digital platforms for development impact.",
    offerings: [
      "Programme data systems",
      "Monitoring & evaluation tools",
      "Digital platforms",
    ],
  },
  {
    slug: "financial-technology",
    name: "Financial Technology",
    description:
      "Trading software, analytical dashboards and digital financial tools.",
    offerings: [
      "Trading software",
      "Analytics dashboards",
      "Digital financial tools",
    ],
  },
  {
    slug: "smes-startups",
    name: "SMEs & Startups",
    description:
      "Practical software, dashboards and digital transformation support that scales with the business.",
    offerings: [
      "Custom web applications",
      "Decision dashboards",
      "Digital transformation",
    ],
  },
];

/* ── Publications & insights ────────────────────────────────────── */
export const PUBLICATIONS: Publication[] = [
  {
    slug: "gis-remote-sensing-climate-action",
    title:
      "Why GIS and Remote Sensing Are Now Essential for Credible Climate Action",
    type: "Insight",
    category: "Climate Technology",
    date: "2026-11-25",
    excerpt:
      "Carbon claims live or die on spatial evidence. This insight explains how GIS and remote sensing underpin credible carbon project assessment and MRV.",
    body: [
      "Climate finance increasingly depends on verifiable evidence. A carbon project that cannot demonstrate, with spatial data, what changed on the ground — and what would have happened without the project — will struggle to attract investment or pass verification.",
      "GIS and remote sensing provide that evidence. Satellite imagery reveals land-cover change at scales no field team could cover alone. Geospatial databases organise project boundaries, baselines and monitoring indicators into an auditable record. Spatial analysis tests additionality: would this forest have been cleared without the project?",
      "For MRV — monitoring, reporting and verification — these tools are not optional extras. They are the measurement backbone. Organisations that build spatial evidence into project design from the start avoid costly retrofits and credibility gaps later.",
      "At CGS, our Climate & Carbon Solutions division combines GIS-supported assessment with MRV design so that climate claims rest on evidence, not assertion.",
    ],
    tags: ["GIS", "Remote Sensing", "Carbon", "MRV", "Climate Technology"],
    featured: true,
    downloadable: true,
  },
  {
    slug: "digital-transformation-smes-kenya",
    title:
      "Digital Transformation for SMEs: Start With the Process, Not the Software",
    type: "Article",
    category: "Digital Transformation",
    date: "2026-11-25",
    excerpt:
      "Many digital projects fail because they automate broken processes. A practical framework for SMEs to sequence transformation for real returns.",
    body: [
      "Small and medium enterprises across Kenya are under pressure to digitise — and many technology purchases disappoint. The common thread in failed projects is not the software; it is the absence of process clarity before the software arrives.",
      "A more reliable sequence starts with mapping the current workflow, identifying where manual effort creates errors or delays, and only then selecting technology that fits the redesigned process. Dashboards built on clean, well-owned data outperform expensive platforms fed by fragmented spreadsheets.",
      "CGS supports SMEs through exactly this sequence: digital maturity assessment, a transformation roadmap, and implementation support that keeps technology subordinate to business outcomes.",
    ],
    tags: ["Digital Transformation", "SMEs", "Software", "Kenya"],
    featured: true,
  },
  {
    slug: "environmental-data-decisions",
    title:
      "From Data Collection to Decisions: Making Environmental Monitoring Count",
    type: "Article",
    category: "Environmental Data",
    date: "2026-11-25",
    excerpt:
      "Monitoring programmes generate data; decisions require analysis. How to close the gap between collection and action.",
    body: [
      "Environmental monitoring programmes often produce impressive volumes of data — and very few decisions. The gap is rarely technical. It is structural: indicators are not tied to decisions, data quality is not assured, and analysis is treated as an afterthought.",
      "Effective programmes define, up front, which decisions each indicator informs, what thresholds trigger action, and who owns the response. Data pipelines then serve those decisions, with visualisation designed for the people who must act.",
      "Our Data Science & Analytics division helps organisations make this shift — from collecting data to acting on it.",
    ],
    tags: ["Environmental Data", "Monitoring", "Analytics"],
    featured: false,
  },
  {
    slug: "cypher-terra-platform-update",
    title: "Cypher Terra: Environmental Intelligence, One Platform",
    type: "News",
    category: "Product News",
    date: "2026-11-25",
    excerpt:
      "Cypher Terra brings environmental information, GIS-related capabilities and community-oriented tools together in a single platform.",
    body: [
      "Cypher Terra, CGS's environmental technology and intelligence platform, continues to evolve as a single home for environmental information, GIS-related capabilities, educational resources and community-oriented environmental solutions.",
      "The platform is live and accessible at cypher-green-systems.vercel.app. Organisations interested in environmental information systems, community engagement tools or educational content are invited to explore it and speak with our team about deployment and collaboration.",
    ],
    tags: ["Cypher Terra", "Product", "Environmental Technology"],
    featured: false,
  },
];

/* ── Careers ────────────────────────────────────────────────────── */
export const VACANCIES: Vacancy[] = [];
