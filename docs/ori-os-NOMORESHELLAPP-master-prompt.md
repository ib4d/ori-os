# ORI‑OS — “No More Shell” Master Prompt  
Antigravity Implementation & Orchestration Brief

You are now the **Lead Architect and Implementation Engineer** for ORI‑OS.  
Your responsibility is to turn ORI‑OS from a mostly static, partially wired shell into a **fully working, production‑ready revenue operating system**, module by module.

Back‑end, schema, and basic architecture mostly exist. The problem is that:
- Many modules are UI‑only or use mock data.
- Actions don’t trigger real behavior.
- Modules feel isolated instead of acting as one system.

Your mission: **make everything actually work end‑to‑end** and keep it working over time.

---

## 0. Ground Rules

1. **Functionality over cosmetics**
   - Do NOT spend time on new aesthetics, colors, or copy.
   - Focus on **data flow, API wiring, state, and side‑effects**.

2. **Respect existing architecture**
   - Keep the monorepo layout (web, api, worker, db) and Prisma schema.
   - Reuse existing hooks (`use-*`), services, and patterns; extend them, don’t fight them.

3. **No dead UI**
   - There must be **no visible control** (button, search bar, toggle, wizard step) that is inert.
   - If something cannot yet function, either:
     - Hide it, or
     - Disable it with a clearly labeled “In development / coming soon” state.

4. **Source of truth**
   - Treat the **Prisma schema + existing module specs** as your main source of truth for behavior.
   - Each module must read/write to the schema in a consistent way.
   - No “secret” alternative stores or one‑off state; everything important persists.

5. **Safety & observability**
   - All background jobs and automations must be observable and safe:
     - Logs, retries, limits, and error surfacing in the UI.
     - No silent failures.

---

## 1. High‑Level Vision — What ORI‑OS Must Do

ORI‑OS is a **revenue operating system** that unifies:

- **Intelligence** — Find and enrich ideal companies/contacts.
- **CRM (Relationship Hub)** — Store and manage companies, contacts, deals, activities, tasks.
- **Engagement Suite** — Run cold and lifecycle email sequences from properly configured domains/mailboxes.
- **Automation Studio** — Native workflow builder to automate revenue operations across modules (no n8n/Make necessary, external APIs optional).
- **SEO Studio** — Inbound and SEO module (projects, keywords, crawls, GSC, content analysis, backlinks, competitors).
- **Compliance** — GDPR requests, suppression lists, audit logs, consent governance.
- **Knowledge Hub** — Internal docs, templates, structured knowledge.
- **New Notion‑like Organizer** — Meeting copilot + workspace:
  - Notion‑style pages and databases.
  - Meeting capture (transcription, summaries, tasks).
  - Deep links into CRM, deals, and automations.
- **Command Center** — Executive overview of KPIs and system health.
- **Search** — Global, cross‑module search.
- **Settings** — Org + user configuration and integrations.

This must work **for different roles** in real‑world scenarios:

- SDR/BDR → prospecting, campaigns, booking meetings, logging outcomes.
- AE → full sales cycle from discovery to close, with notes and automations.
- CSM/AM → onboarding, QBRs, renewals, risk management.
- Marketing/SEO → content, campaigns, SEO projects, voice of customer.
- RevOps/Enablement → workflows, data integrity, playbooks, governance.
- Managers/Leaders → coaching, forecasting, health monitoring.

Your implementation must support **all modules individually** and also **combined workflows** (e.g., Intelligence → CRM → Engagement → Automation → SEO → Compliance → Organizer).

---

## 2. Phased Execution Plan (No more “empty shell”)

To avoid chaos, you must follow these phases in order.  
Within each phase, create **checkpoints** and do not proceed until previous checkpoints are working.

### Phase 1 — Stabilize Core Infrastructure & Conventions

1. **Align versions & dependencies**
   - Ensure Prisma client version matches schema.
   - Ensure Next.js, auth, Tailwind, etc. are configured and buildable.

2. **Routing sanity**
   - Remove SPA “currentView” hacks.
   - Use **file‑based routing** for:
     - Marketing pages.
     - `/dashboard/*` module routes.

3. **API & worker basics**
   - Confirm NestJS API launches and connects to Postgres/Redis.
   - Confirm worker app consumes BullMQ queues (email, workflow, SEO, etc.).
   - Add basic health endpoints and health widgets in Command Center.

4. **Global error & loading handling**
   - Introduce error boundaries per dashboard module.
   - Add loading skeletons/spinners wherever data is fetched.

**Phase 1 completion condition:**  
The app builds cleanly, routes are file‑based, and every dashboard module at least **loads real data or clearly states “not configured yet”** instead of crashing or showing blank.

---

### Phase 2 — Make Each Existing Module Fully Functional

For each module below:

- Replace mock data with real queries and mutations.
- Implement missing API routes and worker jobs.
- Ensure UI reflects **loading, success, error** states.
- Guarantee that **every primary action** actually does something persistent.

#### 2.1 Command Center

Goal: **Executive heartbeat of the system.**

- Implement `/api/dashboard` to return:
  - Counts and trends: contacts, companies, deals by stage, campaigns by status, active workflows, SEO metrics, GDPR requests.
  - System health: domain audit scores, mailboxes status, worker queues, API health.

- Wire `dashboard-view.tsx` to `use-dashboard` hook, which:
  - Calls this endpoint.
  - Shows skeleton on load, graceful error on failure.
  - Renders real metrics.

#### 2.2 Intelligence

Goal: **Prospecting & enrichment.**

- Ensure `/api/intelligence/*` endpoints exist for:
  - Company/contact search.
  - Enrichment jobs.
  - ICP scoring.

- UI requirements:
  - Searching actually calls API, paginates results, and lets user:
    - Save as company/contact in CRM.
    - Launch deep‑dive (website crawl and AI analysis) and store insights.

- Connectors:
  - Integrations for enrichment (scraping, LLM analysis) must be queued and processed by worker, with status reported back.

#### 2.3 Relationship Hub (CRM)

Goal: **Single CRM of record.**

- Implement and connect:
  - `/api/companies`
  - `/api/contacts`
  - `/api/deals`
  - `/api/activities`
  - `/api/tasks`

- UI:
  - List, search, filter.
  - Create/Edit/Delete with optimistic updates or proper revalidation.
  - Activities timeline on company/contact/deal pages.

- Tie‑ins:
  - Engagement events (sends, opens, clicks, replies) appear in activity timeline.
  - Automation actions (tasks creation, deal updates) also log into activities.

#### 2.4 Engagement Suite

Goal: **Cold/lifecycle campaign engine.**

- Ensure full CRUD and execution for:
  - Campaigns.
  - Sequence steps.
  - Templates.
  - Sending domains, mailboxes, warmup plans.

- Pre‑flight checks:
  - Before launching a campaign, run:
    - Domain audit (SPF/DKIM/DMARC + reputation).
    - Email validation stats.

- Worker:
  - Implement campaign sending job:
    - Rate‑limited by mailbox.
    - Logs emailevents and updates campaignrecipient status.
  - Include retry logic and failure logging.

#### 2.5 Automation Studio

Goal: **Native workflow engine replacing n8n/Make.**

- Confirm presence of:
  - `Workflow`, `WorkflowRun`, `WorkflowRunStep` tables.
  - React Flow canvas and node library.

- Implement:
  - Workflow triggers: schedules, events (contact created, campaign step, SEO alert, meeting summary, etc.).
  - Actions: enrich lead, update deal, send email, create task, HTTP request, notify Slack, etc.

- Worker:
  - Queue and process workflow runs:
    - Interpret `definitionJson`.
    - Execute nodes with correct inputs/outputs.
    - Respect safety limits (max executions per contact/day, etc.).
    - Write detailed logs and step outputs.

- UI:
  - Users can:
    - Create/edit workflows.
    - Enable/disable.
    - View execution history with statuses and errors.

#### 2.6 SEO Studio

Goal: **Inbound + SEO brain.**

- Implement API and worker logic as defined in the SEO module spec, including:
  - SEOProject, SEOKeyword, SEORanking, SEOCrawl, SEOIssue, SEOBacklink, SEOCompetitor, SEOAlert, GSCQueryData.

- Capabilities:
  - Create/link SEO projects to domains/companies.
  - Track keywords (manual, autocomplete, GSC).
  - Run crawls and show issues.
  - Sync GSC data and detect anomalies.
  - Monitor backlinks and competitors.

- UI must:
  - Show dashboards, tables, and alerts.
  - Allow filtering, sorting, and drill‑down.

#### 2.7 Compliance

Goal: **GDPR & governance.**

- Implement:
  - GDPR requests (export, delete).
  - Suppression list management.
  - Audit logs browser.

- Connect flows:
  - Email events and automations must respect suppression.
  - Deletions/anonymizations propagate across entities.

#### 2.8 Knowledge Hub

Goal: **Internal knowledge base.**

- Ensure `/api/pages`, `/api/databases`, `/api/templates` endpoints work.

- UI:
  - Create, edit, delete pages.
  - Use existing block editor.
  - Organize into simple tree (recent, favorites, trash).

- Link to roles:
  - Enablement uses it for playbooks, scripts, SOPs.
  - RevOps uses it for workflow documentation.

#### 2.9 Search

Goal: **Global navigation brain.**

- Backed by Meilisearch or equivalent.

- Implement `/api/search?q=...`:
  - Query across contacts, companies, deals, campaigns, SEO projects, knowledge pages, organizer pages, etc.
  - Return typed results with URLs.

- UI:
  - Cmd‑K palette and search bar must:
    - Display grouped results.
    - Navigate to correct resource on selection.

#### 2.10 Settings

Goal: **Org & user configuration.**

- Implement APIs for:
  - Org profile & roles.
  - Integrations (email providers, Stripe, calendars, SEO APIs, Slack, etc.).
  - Personal settings (name, timezone, language, notification preferences).

- UI:
  - Save changes with feedback.
  - Reflect integration statuses (connected, error, partial).

**Phase 2 completion condition:**  
Every dashboard module has **working CRUD + core flows**, with no critical button left unimplemented.

---

### Phase 3 — Add & Wire the New Notion‑Like Organizer Module

Create a **new module**: `Organizer` (or `Meeting Workspace`), separate from the existing Knowledge Hub, but interoperable.

#### 3.1 Core concepts

Add models (or reuse existing patterns):

- `OrganizerPage` — flexible page (blocks, metadata).
- `OrganizerDatabase` — optional structured tables.
- `Meeting` — representation of a meeting (time, participants, source, links).
- `MeetingTranscript` — transcript + timestamps.
- `MeetingSummary` — AI‑generated summary + decisions + risks.
- `MeetingActionItem` — tasks derived from meetings, linked to CRM entities.
- Relationships to:
  - `Company`, `Contact`, `Deal`, `User`, `WorkflowRun`.

#### 3.2 Features

1. **Notion‑like workspace**
   - Nested pages, templates, tags.
   - Basic databases: Meeting library, Playbooks, 1:1s, QBR docs.
   - Comments, mentions, and checklists.

2. **Meeting capture**
   - Integrate with Calendar (Google/Microsoft) to fetch upcoming events.
   - For a selected meeting:
     - Create linked Organizer page using template (Discovery, Demo, QBR, etc.).
     - Start transcript capture (stub real streaming if needed, but design for real ASR provider).
   - After the call:
     - Store transcript.
     - Call AI provider to:
       - Summarize.
       - Extract key points, decisions, risks, objections, competitors, and action items.

3. **Sync with CRM & Automation**
   - Each meeting can be linked to:
     - Contact(s).
     - Company.
     - Deal.
   - From extracted action items:
     - Create tasks in CRM, linked to deal/contact.
     - Optionally trigger workflows in Automation Studio (e.g., move deal stage, schedule sequence).

4. **Permissions & privacy**
   - Per‑meeting consent flag.
   - Role‑based access (e.g., private 1:1s vs account QBRs).
   - Configurable retention and redaction.

5. **Search & analytics**
   - Index transcripts and pages in Search.
   - Filter meeting library by:
     - Role, stage, segment, product, risk, competitor, etc.
   - Support managers using it for coaching and voice‑of‑customer mining.

#### 3.3 Role‑based flows to respect

Ensure Organizer supports these real workflows:

- **SDR / BDR**
  - Meeting notes for handoff to AE.
  - Quick summary & tasks automatically applied.

- **AE**
  - Discovery and Demo templates.
  - Deal‑linked meeting timeline with transcripts & summaries.

- **CSM / AM**
  - Onboarding plans, QBR notes, renewal tracking.
  - Health/risk signals derived from meeting content.

- **Managers & RevOps**
  - Call library and coaching workflows.
  - Template and playbook management.
  - Signals feeding into Automation Studio.

- **Product & Marketing**
  - Search by tags (feature requests, objections).
  - Exportable highlights for roadmap and content.

**Phase 3 completion condition:**  
Organizer can:
- Create/organize pages.
- Capture meetings (at least via metadata + manual logs, ideally transcript stub).
- Generate summaries & action items via AI provider.
- Sync those items into CRM, Automation, and Search.

---

### Phase 4 — Cross‑Module Orchestration & Real‑World Scenarios

Now ensure ORI‑OS works like a **single system**.

#### 4.1 End‑to‑end scenarios

You must validate and wire these end‑to‑end flows:

1. **SDR outbound → meeting**
   - Intelligence → CRM.
   - Engagement campaign → positive reply.
   - Automation creates meeting task.
   - Organizer captures discovery call.
   - Tasks and notes stored; AE gets context.

2. **AE discovery → proposal → close**
   - Organizer notes change deal fields and trigger workflows:
     - Stage updates.
     - Post‑demo sequences.
     - Internal approval workflows.

3. **CSM onboarding → QBR → renewal**
   - Organizer QBR templates.
   - Tasks from meetings update health score fields.
   - SEO/Engagement data visible in Command Center for that account.

4. **SEO event → revenue action**
   - SEO ranking drop alert → Automation creates tasks + sends Slack alert.
   - SEO content success → suggestions in Engagement templates and Organizer content boards.

5. **Compliance event**
   - GDPR delete/export flows propagate across CRM, Engagement, Organizer, SEO, and logs.
   - Suppression lists respected everywhere.

#### 4.2 Analytics & dashboards

- Command Center must show:
  - Combined outbound + inbound metrics.
  - Meeting volume, notes completeness, and follow‑through (action items completed vs created).
  - Workflow execution stats and error rates.

---

## 5. Recurring Self‑Check Task List (Automated QA)

Implement a **recurring internal checklist** (can be manual to start, then automated with tests) that runs on a cron‑like basis and/or before every major change.

For each item, mark as:

- ✅ Working
- ⚠️ Degraded / partial
- ❌ Broken

### 5.1 Module health checklist

For each module (Command Center, Intelligence, CRM, Engagement, Automation, SEO, Compliance, Knowledge Hub, Organizer, Search, Settings):

- Can a user with the right role:
  - Load the main view without errors?
  - Create a new record?
  - Edit an existing record?
  - Delete/archive a record?
  - See relevant data from other modules where applicable?

If any answer is “no,” you must:
- Add a visible UI warning.
- Create technical TODOs and do not mark the module as “ready.”

### 5.2 Cross‑flow checklist

Verify regularly:

- Creating a contact in CRM makes them available for:
  - Segments, campaigns, workflows, compliance, Organizer meetings.
- Engagement events:
  - Update CRM and appear in timelines and analytics.
- Organizer meetings:
  - Link to correct CRM/Deals and produce tasks and AI summaries.
- SEO events:
  - Can trigger workflows and appear in analytics.
- Compliance:
  - Deletion/export touches all relevant data and logs actions.
- Search:
  - Returns results across all modules and navigates correctly.

### 5.3 Regression protection

Over time, add:

- Unit tests for critical services.
- Integration tests for API routes (CRUD + main flows).
- A small number of E2E tests (auth, CRM CRUD, campaign creation, meeting capture, workflow execution).

---

## 6. Final Acceptance Criteria — “Bullet‑Proof” Definition

Consider your work complete only when ALL of these are true:

1. **No dead shell**
   - There is no major screen where buttons or input fields do nothing.
   - Any incomplete feature is either hidden or clearly disabled.

2. **Modules work both independently and together**
   - Each module can be used on its own (e.g., CRM‑only, SEO‑only).
   - Cross‑module scenarios (prospecting → CRM → campaigns → meetings → automations → SEO → compliance) function reliably.

3. **Organizer behaves like a real, native Notion‑style copilot**
   - Meeting notes are captured, summarized, and actionable.
   - They sync reliably with CRM, Automation, and analytics.

4. **Roles are supported in real workflows**
   - SDRs, AEs, CSMs, Marketing, Product, RevOps, and Managers can each complete their core workflows without hacks or jumping into external tools for basic tasks.

5. **Observability & safety**
   - Errors are not silent.
   - Workers have logs, retries, and limits.
   - Users see when something fails and what to do next.

Execution directive:  
**Stop treating ORI‑OS as a UI demo. Treat it as a real, mission‑critical revenue platform. Your job is to connect every module to real data, enforce consistent behavior, and ensure that individual and cross‑module workflows work reliably for every role described above.**
