// Single source of truth for everything shown on the site (from the résumé).

export const profile = {
  name: "Aakash Shetty",
  first: "Aakash",
  last: "Shetty",
  roles: ["Full Stack Developer", "Generative AI Engineer"],
  location: "Mumbai, India",
  status: "Open to opportunities",
  tagline:
    "I build the whole product: React frontends, Python backends and the AI agents behind them, shipped to thousands of people.",
  email: "aakashshetty227@gmail.com",
  phone: "+91 80975 23767",
  phoneHref: "tel:+918097523767",
  github: "https://github.com/aakash-shetty",
  linkedin: "https://www.linkedin.com/in/aakash-shettys",
  resume: "/Aakash_Shetty_Resume.docx",
};

export const metrics = [
  { value: 3000, suffix: "+", label: "Employees use my AI assistant across 3 countries" },
  { value: 90, suffix: "%", label: "Faster responses after re-architecting the core" },
  { value: 1.6, suffix: "M+", label: "Shipment records answerable in plain English", decimals: 1 },
  { value: 91, suffix: "%", label: "Accuracy routing ~200 emails every day" },
];

export const about = {
  statement:
    "Full stack developer who treats *AI* as a product feature, not a demo.",
  body: "At Allcargo Global I own systems end to end: React and TypeScript interfaces with streaming UIs, FastAPI backends, retrieval pipelines and Claude-powered agents, deployed on AWS. I care about the unglamorous parts that make AI trustworthy: evaluation, guardrails and clear interfaces.",
};

export const capabilities = [
  {
    index: "01",
    title: "Generative AI",
    text: "Agentic systems, RAG pipelines and text-to-SQL tools on Claude and GPT, with guardrails and evaluation built in.",
    tags: [
      "AWS Bedrock",
      "LangChain",
      "LangGraph",
      "MCP",
      "RAG / GraphRAG",
      "pgvector",
      "Text-to-SQL",
      "OpenAI",
      "OCR / OpenCV",
      "LLM Evaluation",
    ],
  },
  {
    index: "02",
    title: "Full Stack",
    text: "React and TypeScript frontends with streaming UIs, async Python and Node backends, shipped to production on AWS.",
    tags: [
      "React 18",
      "Next.js",
      "TypeScript",
      "Redux",
      "SSE Streaming",
      "FastAPI",
      "Node.js",
      "PostgreSQL",
      "AWS",
      "Docker",
    ],
  },
];

// ── Work experience ────────────────────────────────────────────────────────

export const work = {
  company: "Allcargo Global Ltd.",
  division: "ECU Worldwide",
  location: "Mumbai, India",
  since: "Jan 2025",
  roles: [
    {
      title: "Data Scientist",
      period: "Jul 2025 — Present",
      summary:
        "Building and owning production AI systems across logistics, finance and compliance.",
      bullets: [
        "ELMA 2.0: cut response time ~90% (30–60s to 2–5s) for 3,000+ employees in India, USA and Canada, as 1 of 3 engineers, with a 26-tool MCP server, a bounded Claude agent loop and pgvector hybrid retrieval.",
        "Pendulum AI: GraphRAG over 1.6M+ shipment records behind 43 endpoints; sole frontend owner of the React 18 app, with streaming chat, Azure AD SSO and an S3 + CloudFront release, adopted by 25 branch managers.",
        "KAIROS & FRAME: 7 text-to-SQL agents across 3 production databases, plus 3-stage email triage routing ~200 emails a day at 91% accuracy.",
        "ACE and RIVA: sole backend developer of an invoice translation platform live in ECU Cambodia, and technical lead on dangerous-goods compliance automation; mentored 1 junior developer.",
      ],
      tech: [
        "Python",
        "FastAPI",
        "React 18",
        "LangChain",
        "MCP",
        "pgvector",
        "AWS Bedrock",
        "PostgreSQL",
      ],
      projects: ["ELMA 2.0", "Pendulum AI", "KAIROS & FRAME", "ACE", "RIVA"],
    },
    {
      title: "Data Science Intern",
      period: "Jan — Jun 2025",
      summary:
        "Six-month internship that converted to a full-time placement.",
      bullets: [
        "GLIMPSE: sole backend developer of an AI sales research agent used by ~900 reps.",
        "A LangChain agent on Claude Sonnet 4 with 3 web-search tools writes 13-section client briefs in ~30 seconds instead of 3+ hours of manual prep.",
      ],
      tech: ["Python", "FastAPI", "LangChain", "AWS Bedrock", "PostgreSQL"],
      projects: ["GLIMPSE"],
    },
  ],
};

// ── Education ──────────────────────────────────────────────────────────────

export const education = {
  degrees: [
    {
      degree: "M.Sc. Business Analytics",
      focus: "Data Analytics",
      school: "Manipal Academy of Higher Education",
      years: "2023 — 2025",
      gpa: 8.05,
    },
    {
      degree: "B.Com",
      focus: "Commerce",
      school: "KJ Somaiya College of Arts & Commerce, Mumbai University",
      years: "2020 — 2023",
      gpa: 8.82,
    },
  ],
  coursework: [
    "Machine Learning",
    "Natural Language Processing",
    "Statistical Methods",
    "Data Mining & Warehousing",
    "Deep Learning",
    "Time Series Analysis",
    "Big Data Analytics",
    "Database Management Systems",
  ],
  certifications: [
    {
      title: "Business Analyst",
      issuer: "ExcelR Solutions",
      year: "2023",
      detail: "8-month course: Advanced Excel, Power BI, Tableau, SQL, Python and R.",
    },
    {
      title: "Smart Professional MIS",
      issuer: "Aptech Learning",
      year: "2022",
      detail:
        "10-month course: MS Access, Excel, Word, PowerPoint, Tally and VBA automation.",
    },
  ],
  activities: [
    {
      title: "College Placement Cell Representative",
      year: "2022 — 23",
      detail: "Organised 2 placement drives securing 11 internships and 20+ job placements.",
    },
    {
      title: "DLLE Student Representative, KJSCAC",
      year: "2022 — 23",
      detail: "Department of Lifelong Learning & Extension.",
    },
  ],
};

// ── Projects ───────────────────────────────────────────────────────────────

export type ProjectCategory = "enterprise" | "automation" | "personal";

export const projectCategories: {
  id: "all" | ProjectCategory;
  label: string;
  badge?: string;
}[] = [
  { id: "all", label: "All" },
  { id: "enterprise", label: "Enterprise AI Agents", badge: "Enterprise" },
  { id: "automation", label: "Data & Document Automation", badge: "Automation" },
  { id: "personal", label: "Personal Projects", badge: "Personal" },
];

export const projects: {
  name: string;
  category: ProjectCategory;
  subtitle: string;
  tools: string[];
  metric: string;
  metricLabel: string;
  text: string;
  link?: string;
}[] = [
  {
    name: "ELMA 2.0",
    category: "enterprise",
    subtitle: "Enterprise AI Assistant · Agentic RAG",
    tools: ["Python", "FastAPI", "LangChain", "MCP", "pgvector", "AWS Bedrock"],
    metric: "~90%",
    metricLabel: "faster responses",
    text: "30–60s down to 2–5s for 3,000+ employees across India, USA and Canada via a 26-tool MCP server, a bounded Claude agent loop and hybrid retrieval.",
  },
  {
    name: "Pendulum AI",
    category: "enterprise",
    subtitle: "Freight Analytics · Natural-language Q&A",
    tools: ["React 18", "FastAPI", "PostgreSQL", "pgvector", "AWS Bedrock"],
    metric: "1.6M+",
    metricLabel: "records, plain English",
    text: "GraphRAG and hybrid retrieval behind 43 endpoints, plus a React app with streaming chat and Azure AD SSO, adopted by 25 branch managers.",
  },
  {
    name: "KAIROS & FRAME",
    category: "enterprise",
    subtitle: "Finance Q&A Agents · Email Triage",
    tools: ["Python", "FastAPI", "AWS Bedrock", "pgvector", "Microsoft Graph"],
    metric: "7 agents",
    metricLabel: "text-to-SQL on Claude",
    text: "P&L answers in seconds instead of 2–3 day analyst requests, plus 3-stage email triage routing ~200 emails a day at 91% accuracy.",
  },
  {
    name: "GLIMPSE",
    category: "enterprise",
    subtitle: "AI Sales Research Agent",
    tools: ["Python", "FastAPI", "LangChain", "AWS Bedrock", "PostgreSQL"],
    metric: "3 hrs → 30s",
    metricLabel: "per client brief",
    text: "A LangChain agent on Claude Sonnet 4 with web-search tools writes 13-section briefs for ~900 sales reps.",
  },
  {
    name: "ACE",
    category: "automation",
    subtitle: "Invoice Translation Platform",
    tools: ["FastAPI", "GPT-4o-mini", "PostgreSQL", "AWS"],
    metric: "25 → 3 min",
    metricLabel: "per invoice",
    text: "Live in ECU Cambodia. A geometric PDF parser and glossary-guided GPT-4o-mini that never alters amounts or IDs.",
  },
  {
    name: "RIVA",
    category: "automation",
    subtitle: "Dangerous-Goods Compliance Automation",
    tools: ["Python", "GPT-4.1", "OpenCV", "Tesseract"],
    metric: "14",
    metricLabel: "IMDG categories validated",
    text: "Across 100+ live shipping documents using OCR, signature detection and structured LLM checks. Technical lead.",
  },
  {
    name: "Verity",
    category: "personal",
    subtitle: "AI Support Resolution Agent",
    tools: ["LangGraph", "MCP", "FastAPI", "PostgreSQL", "React", "TypeScript"],
    metric: "0 unsafe",
    metricLabel: "actions on 100 held-out cases",
    text: "The model only proposes; code authorizes and verifies every action, with 4 risk tiers and a hash-chained audit log. 600+ tests.",
    link: "https://github.com/aakash-shetty",
  },
  {
    name: "Vanguard",
    category: "personal",
    subtitle: "Multi-Agent Tender Response",
    tools: ["LangGraph", "pgvector", "MCP", "FastAPI", "React", "TypeScript"],
    metric: "97.5%",
    metricLabel: "recall@5 hybrid retrieval",
    text: "A LangGraph team answers 50–100-question tenders with cited sources and caught 100% of planted traps. Human approval before export. 300+ tests.",
    link: "https://github.com/aakash-shetty",
  },
];

export const skillBalls = [
  "React",
  "TypeScript",
  "Python",
  "FastAPI",
  "Node.js",
  "PostgreSQL",
  "AWS",
  "Docker",
  "LangChain",
  "Next.js",
];

export const navLinks = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
];
