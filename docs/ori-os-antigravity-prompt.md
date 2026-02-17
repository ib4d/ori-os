\# Build “Ori‑OS” – Full SaaS Platform (Next.js 16, Compliance‑First Lead Gen Hub)

Act as a \+20 years senior full‑stack engineer, product architect, and UI/UX lead.    
Your mission is to (re)build \*\*Ori‑OS\*\* end‑to‑end as a production‑ready SaaS, using the tech stack and architecture below, and \*\*encoding best‑practice lead‑gen, deliverability and GDPR workflows directly into the product\*\*.

You must output \*\*complete, coherent code\*\* (entire files, not snippets) and a \*\*step‑by‑step execution plan\*\* for VSCode on Windows and deployment to my Hostinger VPS.

\---

\#\# 0\. Context & Product Definition

Ori‑OS is an all‑in‑one platform that replaces the typical stack of: Apollo.io, Sales Navigator \+ Phantombuster/TexAu, Woodpecker/Quickmail, n8n/Make, Attio/HubSpot CRM, PostHog, and basic content tools.

Core philosophy: \*\*“One input, complete intelligence.”\*\*    
User inputs a target (niche / company / problem), and Ori‑OS runs the loop:

\> Find → Enrich → Analyze → Strategize → Engage → Measure → Iterate

Key constraints:

\- Single login, single dashboard, single source of truth.  
\- Avoid hard dependencies on third‑party tools for core logic.  
\- If external APIs are needed (email sending, SMS, payments, calendar, validation, warm‑up, etc.):  
  \- Explain \*why\*.  
  \- Implement native connectors and OAuth/API‑key management so the user connects once.  
  \- Ensure the platform still works in a \*\*local MVP mode\*\* with reduced features if connectors are not configured.

Ori‑OS has two main faces:

1\. \*\*Marketing Site\*\* – marketing pages, pricing, blog, demo flows, legal.  
2\. \*\*App Dashboard\*\* – multi‑tenant workspace with feature modules.

\---

\#\# 1\. Tech Stack & Repo Structure

\#\#\# 1.1 Monorepo

Use a monorepo with this structure:

\- \`apps/web\` – Next.js 16 (App Router) SaaS UI (marketing \+ app shell).  
\- \`apps/api\` – NestJS REST API (TypeScript) for core backend.  
\- \`apps/worker\` – Node worker (BullMQ) for queues, workflows, warm‑up, scraping orchestration, scheduled jobs.  
\- \`packages/db\` – Prisma schema, migrations, DB client.  
\- \`packages/ui\` – shared UI components (shadcn/ui, Tailwind config, design system).  
\- \`packages/core\` – shared domain logic (validation, GDPR helpers, deliverability utilities, workflow engine types).  
\- \`infra/\` – Docker Compose (PostgreSQL, Redis, Meilisearch, MinIO/S3), Nginx config, Hostinger deployment scripts.  
\- \`docs/\` – \`README.md\`, \`CHANGELOG.md\`, \`QUICK\_START.md\`, \`DEPLOYMENT\_HOSTINGER.md\`, architecture diagrams (markdown), and an “App Tree”.

\#\#\# 1.2 Frontend

\- \*\*Framework:\*\* Next.js 16 App Router, TypeScript, Server Components where possible.  
\- \*\*Styling:\*\* TailwindCSS \+ shadcn/ui \+ shadcnblocks sections.  
\- \*\*Visuals:\*\* gradients, glassmorphism, subtle noise, micro/macro animations via Framer Motion.  
\- \*\*Icons:\*\* Lucide.  
\- \*\*Design language:\*\* very small or zero border radius for main cards, tables, and buttons, consistent with Ori‑OS screenshots.  
\- \*\*Color palette\*\* (use as CSS variables / Tailwind theme):

  \- \`\#393d3f\` gunmetal (dark background)  
  \- \`\#fdfdff\` white  
  \- \`\#c6c5b9\` silver  
  \- \`\#10050c\` coffee‑bean (deep accent)  
  \- \`\#f77f00\` vivid‑tangerine (primary accent)

\- \*\*State management & data fetching:\*\* React Query (TanStack Query) as primary remote‑data layer; minimal Zustand for local UI state.  
\- \*\*Charts:\*\* Recharts (or a better library if justified) with theme‑consistent styling.  
\- \*\*Workflow builder:\*\* React Flow for the Automation Studio canvas.

\#\#\# 1.3 Backend

\- \*\*Framework:\*\* NestJS (TypeScript).  
\- \*\*DB:\*\* PostgreSQL with Prisma.  
\- \*\*Queue:\*\* Redis \+ BullMQ.  
\- \*\*Search:\*\* Meilisearch (primary) with an abstraction so Elasticsearch could be plugged later.  
\- \*\*File storage:\*\* Local disk for dev, S3‑compatible for production (e.g. MinIO or Hostinger’s object storage).  
\- \*\*Auth & Billing:\*\*   
  \- Email/password \+ OAuth (Google, Microsoft).  
  \- Multi‑tenant by Organizations (workspaces).  
  \- \*\*Subscription Model:\*\* Support for "Demo/Trial", "Limited", and "Full" access tiers.  
  \- RBAC: \`owner\`, \`admin\`, \`manager\`, \`operator\`, \`viewer\` (scoped by subscription limits).  
  \- JWT access tokens \+ refresh tokens, secure cookies.  
\- \*\*Security/Compliance:\*\*  
  \- Encryption at rest for secrets/API keys (e.g. using libsodium or AES via a master key env var).  
  \- 2FA scaffold (TOTP entities, UI, API).  
  \- Audit logs for critical actions (exports, deletions, permission changes, workflow edits, domain changes).  
  \- GDPR: retention policies, export & delete (right‑to‑be‑forgotten) endpoints.

\---

\#\# 2\. Product Modules (Feature Requirements)

\#\#\# 2.1 Shared Concepts

Model these core entities in Prisma and expose them via the API:

\- \`Organization\` (workspace)  
\- \`Subscription\` (plan, status, limits)  
\- \`User\` (with membership & role per organization)  
\- \`Domain\` (sending domains and mailboxes)  
\- \`Mailbox\` (individual email identities connected)  
\- \`Company\`, \`Contact\`, \`Deal\`, \`Activity\`, \`Task\`, \`Note\`  
\- \`Segment\` (saved filters / dynamic lists)  
\- \`Campaign\` (outbound sequence)  
\- \`EmailTemplate\`, \`SequenceStep\`  
\- \`Workflow\` (Automation Studio definition)  
\- \`WorkflowRun\` and \`WorkflowRunStep\`  
\- \`Event\` (analytics events)  
\- \`AuditLog\`  
\- \`GDPRRequest\` (export/delete)  
\- \`WarmupPlan\`, \`WarmupJob\`  
\- \`ValidationJob\` (list/email validation pipeline)  
\- \`ComplianceProfile\` (regional defaults per org, e.g., EU‑strict)

Make everything multi‑tenant via \`organizationId\`.

\---

\#\#\# 2.2 Dashboard (Command Center)

Features:

\- KPI cards (per workspace):  
  \- Active campaigns, emails sent, open/reply rates.  
  \- New leads this week, meetings booked, pipeline value.  
\- Trend charts (time‑series via Recharts).  
\- Activity feed (recent events: new contacts, deals, campaign status changes).  
\- Alert panel:  
  \- Deliverability alerts (high bounce, spam flags, domain score below threshold).  
  \- Workflow errors, API quota issues.  
\- Quick actions:  
  \- “New Campaign”  
  \- “New Workflow”  
  \- “Import Contacts”  
  \- “Add Domain”  
  \- “Run Domain Audit”  
\- Global search bar:  
  \- Instant search across contacts/companies/deals/workflows using Meilisearch.

\---

\#\#\# 2.3 Intelligence (Find \+ Enrich \+ Analyze)

\*\*Discovery\*\*

\- Company search form (industry, location, size, tech keywords).  
\- People search (title, seniority, department).  
\- CSV bulk import.  
\- \*\*Smart List Curation:\*\*  
  \- "OpenRate‑style" curation simplified: User describes desires (e.g. "clean special symbols").  
  \- Domain guessing: Generate/guess domains from Name \+ Surname \+ Company.  
  \- easy filtering without Excel formulas.  
\- Abstraction for external enrichment providers (e.g. Clearbit‑like, PDL‑like) behind a generic \`EnrichmentProvider\` interface.

\*\*Enrichment & Compliance\*\*

\- Web crawler (for public websites) with:  
  \- HTML fetch \+ content extraction (title, H1–H3, metadata, pricing, product pages).  
  \- Tech stack detection (based on script tags, HTML attributes, DNS, etc.).  
\- Email pattern inference and hooks to external validation APIs.  
\- News & hiring signals placeholders (basic RSS / jobs page crawl; stub but wired).

\*\*AI Analysis\*\*

\- “Company Deep Dive” page combining:  
  \- Summary, key products, ICP guess.  
  \- Pain points, value props, differentiation.  
  \- Suggested messaging angles and objection handling.  
\- Scoring model (0–100) based on firmographic fit, tech, hiring signals, etc., with explanation.

\*\*Scraping Safety & ToS Compliance\*\*

\- Do \*\*not\*\* implement direct LinkedIn scraping.    
\- Provide:  
  \- CSV import.  
  \- “Browser extension capture” placeholder (documented approach, but no browser code).  
  \- Connector slots for Phantombuster/TexAu via their APIs, with clear warnings and per‑provider limits.  
\- Configurable per‑provider limits:  
  \- Max search size (e.g. 1,000–1,500 per batch).  
  \- Daily action limits.

\---

\#\#\# 2.4 Relationship Hub (CRM)

\- Entities:  
  \- Companies, Contacts, Deals, Activities (email, call, meeting, note), Tasks.  
\- Features:  
  \- Kanban pipelines for Deals with custom stages.  
  \- Activity timeline per contact/company/deal.  
  \- Relationship graphs (contacts ↔ companies ↔ deals).  
  \- Segments: saved filter definitions, dynamic updates.  
  \- Permissions:  
    \- Managers/owners can define visibility (org‑wide vs team vs private pipelines).

\---

\#\#\# 2.5 Automation Studio (Native “n8n‑like”)

\- \*\*UI:\*\* React Flow canvas inside the Dashboard app.  
\- \*\*Node types (MVP):\*\*  
  \- Triggers: Time‑based, Webhook, Event (e.g. “new lead created”, “campaign step completed”).  
  \- Logic: Delay, Condition, Branch.  
  \- Actions:  
    \- HTTP Request.  
    \- Enrich Lead (Intelligence).  
    \- Add/Remove from Segment.  
    \- Create/Update Contact or Deal.  
    \- Send Email (via connector).  
    \- Create Task.  
    \- Notify Slack / Webhook (connector).  
    \- Start Campaign / Move to next step.  
\- \*\*Engine:\*\*  
  \- Workflows stored as JSON graphs in DB.  
  \- Worker consumes jobs from BullMQ, executes node by node, logs each \`WorkflowRunStep\`.  
  \- Retry policy, back‑off, and dead‑letter queue for failed jobs.  
\- \*\*Template library:\*\*  
  \- Lead enrichment flow.  
  \- Domain warm‑up automation.  
  \- Cold outbound campaign starter.  
  \- Re‑engagement/nurture drip.

\---

\#\#\# 2.6 Engagement Suite (Outreach \+ Inbox \+ Deliverability)

\*\*Sequences & Campaigns\*\*

\- Multi‑step sequences (email first; SMS/other channels pluggable).  
\- Steps: send email, wait X, check reply, branch, tag, update statuses.  
\- Per‑step rules and A/B versions.

\*\*Templates\*\*

\- Templating with variables (contact fields) and snippets (snippets library).  
\- Localization support (en/en‑gb/pl at least).

\*\*Unified Inbox (MVP)\*\*

\- Thread view for campaign‑related messages.  
\- Sync connectors to Gmail/O365 (scaffold \+ integration abstraction).  
\- Detection of replies and automatic stop of further steps per contact.

\*\*Meetings\*\*

\- Simple booking pages (per user) with:  
  \- Timezone support.  
  \- Availability from connected Google/Microsoft calendar (scaffold).  
\- Create calendar events via API where connectors are configured.

\*\*Deliverability & Sending Safety\*\*

Encode the deliverability manuals as product features:

\- Domain & Mailbox Management:  
  \- Add domain, verify DNS (SPF, DKIM, DMARC).  
  \- Link mailboxes with per‑provider sending limits.  
\- Domain Audit:  
  \- Integration to mail‑tester / GlockApps / MXToolbox as “external audits”; store score and blacklist status.  
  \- UI showing score (0–10), blacklists, DMARC/SPF/DKIM status.  
\- Warm‑up Module (Integrated into Engagement/Automation):  
  \- Warm‑up plans with day‑by‑day volume (e.g. Week1: 10–20/day, Week2: 20–40, Week3: 40–80, Week4: 80–100).  
  \- Worker scheduling low‑volume, high‑reply conversations between internal warm‑up inboxes.  
  \- \*\*Action:\*\* "Warming Campaign" available within the Engagement Hub.  
  \- Rules: varied content, different times, random recipients, never over 3 emails at same instant.  
\- Pre‑flight Check for Campaigns:  
  \- Block campaign if:  
    \- Domain audit score below threshold (e.g. 8.5/10).  
    \- SPF/DKIM/DMARC not OK.  
    \- Daily/hourly limits would be exceeded.  
    \- List not validated or bounce risk too high.  
    \- Spammy words detected in subject/body beyond threshold.  
  \- Show human‑readable checklist with actions (change subject, reduce volume, re‑warm domain, validate list).

\*\*List Hygiene & Validation\*\*

\- Built‑in \*\*Validation Pipeline\*\*:  
  \- Integrations with services like TheChecker, Bouncer, ZeroBounce, NeverBounce, Mailgun validation via pluggable adapter interface.  
  \- Statuses: \`valid\`, \`invalid\`, \`catch\_all\`, \`disposable\`, \`unknown\`.  
  \- Option to treat catch‑alls in a separate phase with extra verification.  
\- Scheduled job that:  
  \- Suppresses contacts after repeated bounces.  
  \- Keeps bounce rate and spam complaints under safe levels.

\---

\#\#\# 2.7 Compliance & GDPR Module

Encode GDPR best practices:

\- For each \`Contact\`:  
  \- Store \`country\`, \`gdprRegion\` flag, \`lawfulBasis\` enum (\`legitimate\_interest\`, \`consent\`, \`contract\`, \`other\`).  
  \- \`consentSource\`, \`consentTimestamp\`, \`optOut\`, \`optOutTimestamp\`.  
\- Suppression lists:  
  \- Global email/domain suppression per organization.  
  \- Campaigns automatically exclude them.  
\- Data subject tools:  
  \- “Export personal data” endpoint & UI.  
  \- “Delete/anonymise contact” endpoint & UI.  
\- Compliance profiles per organization:  
  \- EU‑strict vs non‑EU defaults (e.g. more conservative pre‑send warnings for EU contacts).  
\- Add ToS/DPAs scaffolding pages (in marketing app) and mark Ori‑OS as \*\*processor\*\*; customers act as \*\*controllers\*\*.

\---

\#\#\# 2.8 Roles, Permissions & Safety

\- Implement RBAC with scopes:  
  \- Owner: billing, global settings, domain & mailbox management.  
  \- Admin: manage users, workflows, campaigns, segments.  
  \- Manager: manage teams, campaigns, review exports.  
  \- Operator: execute workflows, run campaigns, \*\*no mass export\*\*.  
  \- Viewer: read‑only.  
\- Enforce:  
  \- Only Owners/Admins can connect new data sources, create warm‑up plans, or run bulk exports.  
  \- Exports are logged in \`AuditLog\` with userId, count, timestamp, IP.  
\- Sessions:  
  \- Shorter idle timeouts for high‑privilege roles; longer for operators.

\---

\#\# 3\. Database Schema (Prisma)

Implement the database in \`packages/db/prisma/schema.prisma\` with models for all entities mentioned above.  

Respect multi‑tenant design (every business object must have \`organizationId\`).  

Include indexes for frequent queries (e.g. search by email, domain, externalId).

Provide the full Prisma schema and initial migrations.  
  
**Seed Data:**  
- Implement a seed script to generate **50 dummy contacts** (varied job titles, related industries) and **10 companies** to populate tables for immediate testing.

\---

\#\# 4\. API Design (NestJS)

Design REST (or REST \+ minimal GraphQL if justified) endpoints around these groups:

1\. \*\*Auth & Orgs:\*\* login, register, invite user, accept invite, list orgs, switch org, manage roles, 2FA.  
2\. \*\*Domains & Mailboxes:\*\* CRUD domains, verify DNS, run audits, setup warm‑up, manage limits.  
3\. \*\*Companies & Contacts:\*\* CRUD, bulk import, search, segments management.  
4\. \*\*Campaigns & Sequences:\*\* CRUD campaigns, steps, start/stop, stats.  
5\. \*\*Workflows:\*\* CRUD workflows, run, pause, resume, get history.  
6\. \*\*Events & Analytics:\*\* ingest events, query KPIs.  
7\. \*\*Deliverability:\*\* run audits, get list health, run spam check, view warm‑up status.  
8\. \*\*GDPR & Compliance:\*\* export contact data, delete/anonymise, manage suppression lists.  
9\. \*\*Connectors:\*\* manage API keys/OAuth, test connections, list available integrations.

For each group, implement controllers, services, DTOs, and validation. Include example request/response bodies in docs.

\---

\#\# 5\. Worker Behaviour (BullMQ)

Describe and implement workers for:

\- Workflow execution (\`WorkflowRun\`).  
\- Warm‑up sending (\`WarmupPlan\` & \`WarmupJob\`).  
\- List validation (\`ValidationJob\`).  
\- Domain audits & reputation checks.  
\- Scheduled tasks (daily metrics aggregation, bounce processing, list hygiene).

Workers must be idempotent and safe to retry.

\---

\#\# 6\. UX Flows to Implement (Important)

\#\#\# 6.1 “New Campaign” Wizard

Implement a multi‑step wizard in the app that guides users through:

1\. \*\*Objective & ICP\*\*  
   \- Select objective: meetings, replies, nurture, etc.  
   \- Choose or create an ICP profile (industry, size, geo, roles, blacklisted personas).  
2\. \*\*Audience & Data Quality\*\*  
   \- Select contacts/segments or import CSV.  
   \- Run or attach validation job; show email status distribution.  
3\. \*\*Sending Infrastructure\*\*  
   \- Choose domain \+ mailbox(es) with visible health (score, warm‑up status, daily limits).  
   \- If warm‑up not complete or domain score low, show blocking warning and suggestion.  
4\. \*\*Sequence & Content\*\*  
   \- Configure steps (emails, waits, conditions).  
   \- Template editor with spam‑word checker and estimated risk.  
5\. \*\*Compliance & Safety\*\*  
   \- Show GDPR/legal summary based on ICP geo.  
   \- Highlight opt‑out default, unsubscribe link, frequency caps.  
   \- Require checkbox: user confirms lawful basis & ToS.  
6\. \*\*Pre‑flight Check & Launch\*\*  
   \- Run automated pre‑flight (domain health, list validation, spam scan, limits).  
   \- Show check results and block launch if critical issues.  
   \- On success: schedule campaign, show monitoring view.

See section 8 below for more detailed screen‑by‑screen description.

\---

\#\# 7\. Delivery Expectations

\- Provide full repo tree and then \*\*all files\*\*, organised by directory.  
\- No \`...\` placeholders; include implementation, even if some integrations are stubbed with clear comments and “TODO”.  
\- Include:  
  \- \`QUICK\_START.md\` – local dev on Windows (install deps, env template, run docker, prisma migrate, seed, run all apps).  
  \- \`DEPLOYMENT\_HOSTINGER.md\` – Docker‑based deployment with Nginx reverse proxy, SSL (Let’s Encrypt), env management, DB backups, zero‑downtime update flow.  
  \- “What’s implemented vs stubbed” matrix.

Make reasonable assumptions and document them in the docs.    
Prioritise a coherent, working MVP with clear extension points over maximal feature depth.

Start now.

