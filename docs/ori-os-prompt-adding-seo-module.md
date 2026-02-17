ORI-OS SEO Studio Module - Antigravity Integration Prompt
CRITICAL: This is an EXTENSION to the existing ORI-OS platform. Do NOT rebuild from scratch. Follow the existing architecture, conventions, and patterns established in the original ORI-OS prompt.

📋 Executive Summary
You are extending the ORI-OS platform with a SEO Studio module that adds inbound marketing capabilities to the existing outbound sales/marketing automation system. This creates a complete growth engine: SEO-driven content → inbound leads → CRM enrichment → warm outreach → higher conversion.

Integration Philosophy: "One Platform, Zero Silos"

SEO data feeds into CRM (organic visitors become leads)

Campaign module uses SEO keyword data for better email copy

Workflows trigger on SEO events (ranking drops, competitor content, critical issues)

Analytics dashboard shows unified outbound + inbound metrics

🎯 What Already Exists (DO NOT MODIFY)
✅ Multi-tenant architecture (Organizations, Users, RBAC)
✅ Intelligence module (company/contact discovery)
✅ CRM module (companies, contacts, deals, activities)
✅ Engagement Suite (campaigns, sequences, templates)
✅ Automation Studio (React Flow workflow builder)
✅ Analytics module (event tracking, KPI dashboards)
✅ Deliverability module (domains, mailboxes, warmup)
✅ GDPR/Compliance tools

🆕 What You're Adding (SEO Studio Module)
Core Features
SEO Projects Management

Link SEO projects to existing Companies (optional)

Track multiple domains per organization

Google Search Console integration (OAuth 2.0)

Keyword Research & Tracking

Keyword discovery (Google Autocomplete API - FREE)

Manual keyword import (CSV/bulk)

Daily rank tracking (position monitoring)

SERP feature tracking (snippets, PAA, images, videos)

AI-powered keyword clustering by topic

Technical SEO Audits

Site crawler (Puppeteer-based, respects robots.txt)

Issue detection (missing metas, broken links, slow pages, mobile issues)

Internal linking opportunity suggester

Scheduled crawls (weekly/monthly)

Issue prioritization (critical/warning/info)

Content Optimization

Analyze your content vs top 10 competitors

Word count, headings, images, readability comparison

AI-powered recommendations

Content gap analysis

SEO score (0-100)

Backlink Monitoring

Track backlinks to your domain

New/lost backlink detection

Spam/toxic link flagging

Link quality scoring

Competitor SEO Tracking

Monitor competitor domains

Detect new competitor content (RSS/crawl-based)

Compare keyword rankings

Content publication frequency analysis

Alerts & Notifications

Ranking drop alerts

Critical issue detection

Competitor activity notifications

GSC traffic anomaly detection

Google Search Console Sync

OAuth integration with GSC

Daily data sync (queries, pages, clicks, impressions, CTR, position)

Historical data (90 days on initial sync)

Automatic keyword import from GSC

🗄️ Database Schema Extensions
Instructions for Prisma Schema
FILE: packages/db/prisma/schema.prisma

ADD these new models at the END of the existing schema:

text
// SEO Studio Module Models
// Add these AFTER all existing models

model SEOProject { ... }
model SEOKeyword { ... }
model SEORanking { ... }
model SEOCrawl { ... }
model SEOPage { ... }
model SEOIssue { ... }
model SEOContentAnalysis { ... }
model SEOBacklink { ... }
model SEOCompetitor { ... }
model SEOAlert { ... }
model GSCQueryData { ... }
EXTEND these existing models (add relations only):

text
// In existing Company model, ADD:
model Company {
  // ... existing fields remain unchanged ...
  
  // NEW: SEO relations
  seoProjects    SEOProject[]
  seoCompetitors SEOCompetitor[]
}

// In existing User model, ADD:
model User {
  // ... existing fields remain unchanged ...
  
  // NEW: SEO project ownership
  seoProjects    SEOProject[] @relation("SEOProjectCreator")
}

// In existing Organization model, ADD:
model Organization {
  // ... existing fields remain unchanged ...
  
  // NEW: SEO projects
  seoProjects    SEOProject[]
}
Schema Design Principles:

All SEO entities MUST have organizationId for multi-tenancy

Use @index on frequently queried fields (projectId, keyword, date, status)

Use @unique constraints where appropriate (e.g., projectId + keyword)

Foreign keys with onDelete: Cascade for dependent data

Store GSC tokens encrypted (use existing ORI-OS encryption utility)

JSON fields for flexible data (recommendations, metadata)

Field Details:

SEOProject:

Primary entity linking to Organization and optionally Company

Stores GSC connection credentials (encrypted)

Crawl settings (frequency, max pages)

Relations: keywords, crawls, rankings, backlinks, competitors, alerts

SEOKeyword:

Keywords being researched or tracked

searchVolume, difficulty, CPC (nullable - from external APIs if available)

searchIntent: informational, commercial, transactional, navigational

tracked: boolean (if actively monitoring rankings)

targetUrl: which page should rank for this keyword

source: manual, autocomplete, gsc, competitor, import

SEORanking:

Historical ranking data per keyword

position (1-100)

previousPosition (for change detection)

SERP feature flags (hasFeaturedSnippet, hasPAA, hasImagePack, etc.)

device, location, searchEngine

checkedAt timestamp

SEOCrawl:

Represents a single site audit

status: pending, running, completed, failed

Aggregate metrics: pagesFound, pagesCrawled, issuesFound, criticalIssues, warnings

Relations: pages (crawled), issues (found)

SEOPage:

Individual page from crawl

Technical metrics: statusCode, loadTime, pageSize

Content metrics: title, metaDescription, h1, h2Count, wordCount

Link metrics: internalLinks, externalLinks, brokenLinks

Image metrics: imageCount, imagesWithoutAlt

Schema: hasSchema, schemaTypes[]

SEOIssue:

Issues found during crawl

severity: critical, warning, info

category: meta, links, images, performance, mobile, schema

type: specific issue type (e.g., "missing_meta_description")

status: open, acknowledged, fixed, ignored

pageUrl: where the issue was found

description, recommendation: human-readable text

SEOContentAnalysis:

Result of content vs competitor analysis

User content metrics (wordCount, h2Count, imageCount, readability, keywordDensity)

Competitor averages (avg*)

recommendations: JSON array of recommendation objects

contentGaps: JSON of missing topics

score: 0-100 overall quality score

SEOBacklink:

Backlinks pointing to your domain

sourceUrl, sourceDomain, targetUrl

anchorText, linkType (dofollow/nofollow), linkPlacement

Quality indicators: domainRating, isSpam, isToxic

status: active, lost

Timestamps: firstSeen, lastChecked, lostAt

SEOCompetitor:

Competitor domains being monitored

Optional link to existing Company entity

Metrics: estimatedTraffic, domainRating, backlinksCount, rankingKeywords

Content monitoring: lastCrawled, newPagesCount

SEOAlert:

Notifications for important SEO events

type: ranking_drop, new_issue, competitor_action, backlink_lost, gsc_traffic_drop

severity: critical, warning, info

metadata: JSON with context

read status tracking

GSCQueryData:

Synced data from Google Search Console

query (keyword), page (landing page)

clicks, impressions, ctr, position

date, device, country

Unique constraint on (projectId, query, page, date, device)

🏗️ Backend API Structure
Module Organization
Create directory structure:

text
apps/api/src/seo/
├── seo.module.ts
├── controllers/
│   ├── projects.controller.ts
│   ├── keywords.controller.ts
│   ├── crawl.controller.ts
│   ├── rankings.controller.ts
│   ├── content.controller.ts
│   ├── backlinks.controller.ts
│   ├── gsc.controller.ts
│   ├── competitors.controller.ts
│   └── alerts.controller.ts
├── services/
│   ├── projects.service.ts
│   ├── keywords.service.ts
│   ├── crawl.service.ts
│   ├── rankings.service.ts
│   ├── content-analysis.service.ts
│   ├── backlinks.service.ts
│   ├── gsc.service.ts
│   ├── competitors.service.ts
│   └── alerts.service.ts
├── dto/
│   ├── project.dto.ts
│   ├── keyword.dto.ts
│   ├── crawl.dto.ts
│   └── content.dto.ts
├── providers/
│   ├── google-autocomplete.provider.ts
│   ├── serpapi.provider.ts (optional, paid)
│   └── value-serp.provider.ts (optional, paid)
├── jobs/
│   └── (job definitions for BullMQ)
└── utils/
    ├── seo-analyzer.util.ts
    ├── keyword-clustering.util.ts
    ├── content-extractor.util.ts
    └── readability-calculator.util.ts
API Endpoint Structure
REST API endpoints to implement:

text
/api/seo/projects
  POST   /                    - Create SEO project
  GET    /                    - List projects
  GET    /:id                 - Get project details
  PUT    /:id                 - Update project
  DELETE /:id                 - Archive project

/api/seo/projects/:projectId/keywords
  POST   /                    - Add keyword manually
  POST   /research            - Research keywords (autocomplete)
  POST   /import              - Bulk import keywords (CSV)
  GET    /                    - List keywords (with filters)
  PUT    /:id                 - Update keyword
  DELETE /:id                 - Remove keyword
  POST   /cluster             - AI keyword clustering

/api/seo/projects/:projectId/rankings
  POST   /check               - Trigger rank check
  GET    /                    - Get ranking history
  GET    /summary             - Get ranking stats

/api/seo/projects/:projectId/crawl
  POST   /                    - Start new crawl
  GET    /                    - List crawl history
  GET    /:crawlId            - Get crawl details
  GET    /:crawlId/issues     - List issues
  PUT    /:crawlId/issues/:id - Update issue status
  GET    /:crawlId/pages      - List crawled pages
  POST   /internal-links/suggest - Get internal link suggestions

/api/seo/projects/:projectId/content
  POST   /analyze             - Analyze content
  GET    /analyses            - List analyses
  GET    /analyses/:id        - Get analysis details

/api/seo/projects/:projectId/backlinks
  GET    /                    - List backlinks
  POST   /                    - Add backlink manually
  PUT    /:id                 - Update backlink
  GET    /summary             - Get backlink stats

/api/seo/projects/:projectId/gsc
  POST   /connect             - Initiate OAuth
  GET    /callback            - OAuth callback
  DELETE /disconnect          - Remove GSC connection
  POST   /sync                - Trigger manual sync
  GET    /queries             - Get GSC query data
  GET    /pages               - Get GSC page performance

/api/seo/projects/:projectId/competitors
  POST   /                    - Add competitor
  GET    /                    - List competitors
  DELETE /:id                 - Remove competitor
  POST   /:id/check           - Manual competitor check
  GET    /:id/content         - Get competitor content

/api/seo/projects/:projectId/alerts
  GET    /                    - List alerts
  PUT    /:id/read            - Mark as read
  PUT    /read-all            - Mark all as read
Service Layer Responsibilities
ProjectsService:

CRUD for SEO projects

Link to existing Company entities

Calculate project-level metrics (aggregate from keywords, crawls, GSC)

Integration point: createFromCompany(companyId, domain) for Intelligence module

KeywordsService:

Keyword CRUD

Research via Google Autocomplete (FREE)

Bulk import/export

Keyword clustering algorithm

Integration: Import keywords from GSC data

Integration: Suggest keywords to Campaign/Email templates

CrawlService:

Orchestrate site audits

Queue crawl jobs to BullMQ

Retrieve crawl results

Issue management (status updates)

Internal link suggestion algorithm

RankingsService:

Queue rank check jobs

Store ranking history

Calculate ranking changes

Detect SERP feature wins/losses

Alert on significant drops

ContentAnalysisService:

Scrape user's page

Scrape top 10 competitors (via SERP API or scraping)

Calculate metrics (word count, headings, images, readability)

Generate recommendations

Calculate content score

GSCService:

Google OAuth flow (initiate, callback, token refresh)

Sync GSC data (queries, pages, clicks, impressions)

Store in GSCQueryData table

Automatic keyword import from GSC

Traffic anomaly detection

BacklinksService:

Track backlinks (manual entry or API integration)

Detect new/lost backlinks

Spam/toxic link flagging

Link quality scoring

CompetitorsService:

Monitor competitor domains

Detect new content (RSS feed parsing, HTML change detection)

Track competitor metrics

Alert on competitor activity

AlertsService:

Create alerts for various triggers

Mark as read/unread

Deliver via notification system (integrate with existing ORI-OS notifications)

Third-Party API Providers
GoogleAutocompleteProvider (FREE):

text
GET http://suggestqueries.google.com/complete/search?client=firefox&q={keyword}
Returns: Array of keyword suggestions
Legal: Public API, no auth required, rate limit: ~1 req/sec
SerpApiProvider (OPTIONAL, PAID):

text
GET https://serpapi.com/search?q={keyword}&api_key={key}
Returns: Top 10 organic results
Cost: $50-250/month depending on volume
Use: For content analysis, SERP feature detection
ValueSerpProvider (OPTIONAL, PAID):

text
GET https://api.valueserp.com/search?q={keyword}&api_key={key}
Returns: SERP results
Cost: $50-500/month
Use: Alternative to SerpApi for rank tracking
Recommendation: Start with FREE APIs only:

Google Autocomplete for keyword research

Manual SERP scraping for content analysis (respectful, rate-limited)

Google Search Console for actual ranking data (most accurate)

⚙️ Worker Implementation (BullMQ Jobs)
Worker Structure
Create processors in:
apps/worker/src/processors/
├── seo-crawl.processor.ts
├── seo-ranking.processor.ts
├── seo-gsc-sync.processor.ts
└── seo-competitor.processor.ts

Job Queue Configuration
Register SEO queues in worker main file:

text
apps/worker/src/main.ts

Add to existing queue registrations:
- seo-crawl (for site audits)
- seo-ranking (for rank checking)
- seo-gsc-sync (for GSC data sync)
- seo-competitor (for competitor monitoring)
SEO Crawl Processor
Responsibilities:

Execute site crawl using Puppeteer/Cheerio

Respect robots.txt (use robots-parser npm package)

Rate limiting (1 request per second)

Extract page data (title, metas, headings, links, images)

Detect technical issues

Store results in SEOPage and SEOIssue tables

Update crawl status (running → completed/failed)

Create alerts for critical issues

Track event: seo.crawl_completed

Implementation approach:

typescript
1. Fetch project domain and settings
2. Start crawl from homepage (seed URL)
3. Use breadth-first search (BFS) up to maxCrawlPages
4. For each page:
   - Fetch HTML
   - Parse with Cheerio (or Puppeteer if JS-heavy)
   - Extract: title, meta, h1-h3, links, images, structured data
   - Calculate: word count, load time, page size
   - Detect issues: missing metas, broken links, slow load, etc.
   - Store in SEOPage table
5. Generate issues list with severity classification
6. Mark crawl as completed
7. If critical issues found, create SEOAlert
Issue detection logic:

Missing title: CRITICAL

Missing meta description: WARNING

Duplicate title across pages: WARNING

Broken internal link (404): WARNING

Broken external link: INFO

Image without alt tag: WARNING

Page load time > 3s: WARNING

Page size > 2MB: INFO

No H1 tag: WARNING

Multiple H1 tags: WARNING

Missing canonical tag: INFO

Invalid schema markup: WARNING

Ranking Check Processor
Responsibilities:

Fetch tracked keywords for project

Check current position for each keyword (via SERP API or scraping)

Detect SERP features (snippet, PAA, images, videos, local pack)

Compare with previous position

Store in SEORanking table

Create alert if position dropped > 5 positions

Track event: seo.ranking_checked

Implementation approach:

typescript
1. Get all keywords where tracked = true for project
2. For each keyword:
   - Query SERP (SerpApi or manual scraping)
   - Find project domain in results (match by domain)
   - Record position (1-100, or >100 if not found)
   - Detect SERP features in result
   - Compare with last ranking
   - Store new ranking with previousPosition reference
3. If significant drop detected:
   - Create SEOAlert (type: ranking_drop)
   - Trigger workflow if configured
4. Rate limit: Check max 100 keywords per run
5. Schedule: Daily checks (via cron)
SERP scraping safety:

Use rotating user agents

Rate limit: 1 request per 2-3 seconds

Respect Google ToS (don't abuse)

Alternative: Use official GSC data (more accurate, free, legal)

GSC Sync Processor
Responsibilities:

Fetch GSC data via Google Search Console API

Store query/page performance data

Detect traffic anomalies

Auto-import high-performing keywords

Track event: seo.gsc_synced

Implementation approach:

typescript
1. Get project with gscConnected = true
2. Decrypt GSC access/refresh tokens
3. Refresh token if expired (OAuth refresh flow)
4. Call searchanalytics.query API:
   - dimensions: [query, page, date, device]
   - date range: last 7 days (daily sync)
   - rowLimit: 25000
5. For each row, upsert GSCQueryData:
   - Use unique constraint (projectId, query, page, date, device)
   - Update clicks, impressions, ctr, position
6. Auto-import keywords:
   - Find queries with clicks > 10 and not already in SEOKeyword
   - Create keyword with source = "gsc"
7. Anomaly detection:
   - Compare last 7 days vs previous 7 days
   - If clicks dropped > 20%, create alert
8. Schedule: Daily at 2 AM (cron: 0 2 * * *)
GSC API details:

Endpoint: searchanalytics.query

Requires OAuth 2.0 scope: webmasters.readonly

Free tier: No cost, generous limits

Data freshness: 2-3 days lag

Competitor Monitor Processor
Responsibilities:

Check competitor domains for new content

Detect publishing patterns

Alert on competitor activity

Track event: seo.competitor_checked

Implementation approach:

typescript
1. Get all SEOCompetitor records
2. For each competitor:
   - Check RSS feed (if available)
   - Or crawl /blog, /news pages
   - Or detect HTML changes on homepage
   - Parse new article titles/URLs
3. Compare with last check:
   - If new pages found, store count
   - Create alert (type: competitor_action)
   - Optional: Queue content analysis job
4. Update lastCrawled timestamp
5. Schedule: Weekly (cron: 0 9 * * MON)
Legal & ethical considerations:

Only scrape public pages

Respect robots.txt

Rate limit: 1 request per 5 seconds per domain

Don't overload competitor servers

🎨 Frontend Implementation
Route Structure
Add SEO routes to existing dashboard:

text
apps/web/app/(dashboard)/[orgSlug]/
├── seo/                              # NEW SEO Studio section
│   ├── layout.tsx                    # SEO navigation sidebar
│   ├── page.tsx                      # Projects overview
│   ├── new/
│   │   └── page.tsx                  # Create project wizard
│   └── projects/
│       └── [projectId]/
│           ├── page.tsx              # Project dashboard
│           ├── keywords/
│           │   ├── page.tsx          # Keyword research & tracking
│           │   └── [keywordId]/
│           │       └── page.tsx      # Keyword details
│           ├── audit/
│           │   ├── page.tsx          # Site audit overview
│           │   └── [crawlId]/
│           │       ├── page.tsx      # Crawl report
│           │       ├── pages/
│           │       │   └── page.tsx  # Crawled pages list
│           │       └── issues/
│           │           └── page.tsx  # Issues list
│           ├── content/
│           │   ├── page.tsx          # Content analyses list
│           │   ├── new/
│           │   │   └── page.tsx      # New analysis form
│           │   └── [analysisId]/
│           │       └── page.tsx      # Analysis results
│           ├── backlinks/
│           │   └── page.tsx          # Backlink monitor
│           ├── competitors/
│           │   └── page.tsx          # Competitor tracking
│           └── settings/
│               └── page.tsx          # Project settings & GSC
UI Component Structure
Create shared SEO components:

text
apps/web/components/seo/
├── project-card.tsx                  # Project overview card
├── project-stats.tsx                 # KPI cards (rankings, traffic, issues)
├── keyword-table.tsx                 # Sortable, filterable keyword table
├── keyword-research-dialog.tsx      # Autocomplete keyword suggester
├── keyword-import-dialog.tsx        # CSV import modal
├── ranking-chart.tsx                # Position over time (Recharts)
├── ranking-change-badge.tsx         # Up/down arrows with colors
├── crawl-status-badge.tsx           # Pending/running/completed status
├── crawl-issues-list.tsx            # Grouped by severity
├── issue-detail-card.tsx            # Issue with recommendation
├── content-score-card.tsx           # Circular progress with score
├── content-recommendations.tsx      # Actionable recommendation list
├── serp-feature-badges.tsx          # Icons for snippet, PAA, images
├── gsc-connection-dialog.tsx        # OAuth flow UI
├── gsc-metrics-cards.tsx            # Clicks, impressions, CTR, position
├── gsc-query-table.tsx              # GSC data table
├── backlink-table.tsx               # Backlinks with quality indicators
├── competitor-card.tsx              # Competitor overview
├── alert-list.tsx                   # SEO alerts with read/unread
└── internal-link-suggester.tsx      # Link opportunity cards
Key UI Features
SEO Projects Overview Page:

Grid of project cards

Each card shows: domain, status, keyword count, last crawl date, unread alerts

Quick actions: View project, Run crawl, Add keyword

"New Project" button (primary action)

Filter by status (active/paused/archived)

Project Dashboard:

Hero KPI cards:

Total tracked keywords

Avg position (with trend)

GSC clicks last 30 days

Critical issues count

Unread alerts

Ranking chart (last 90 days, multi-line for top keywords)

Recent alerts list (last 5)

Quick links to sub-sections

GSC connection status banner if not connected

Keywords Page:

Search/filter bar (by priority, intent, tracked status)

Bulk actions: Track/untrack, delete, export

Keyword table columns:

Keyword

Position (with change indicator)

Search volume (if available)

Difficulty (if available)

Tracked toggle

Priority dropdown

Target URL input

Actions menu

"Research Keywords" button → Opens autocomplete suggester

"Import Keywords" button → CSV upload dialog

"Cluster Keywords" button → AI grouping

Keyword Research Dialog:

Input: Seed keyword

Button: "Get Suggestions"

Results: List of suggested keywords (from Google Autocomplete)

Checkboxes to select keywords to add

"Add Selected" button

Site Audit Overview:

Latest crawl summary:

Status, date, pages crawled

Issue counts by severity (critical/warning/info)

Start new crawl button

Crawl history table (date, status, pages, issues)

Click row → View crawl details

Crawl Details Page:

Tabs:

Overview (summary stats)

Issues (filterable list)

Pages (all crawled pages)

Internal Links (suggestions)

Issues list:

Group by severity

Each issue card shows: type, page URL, description, recommendation

Action buttons: Mark as fixed, Ignore

Pages list:

Table with columns: URL, status code, title, word count, load time, issues count

Click row → View page details

Content Analyzer:

Form:

Your page URL input

Target keyword input

"Include competitors" checkbox (default: true)

"Analyze" button

Results page:

Score gauge (0-100) with color coding

Comparison table (your metrics vs competitor averages)

Recommendations list with priority indicators

Content gaps section

Export PDF button

GSC Connection:

If not connected: Banner with "Connect Google Search Console" button

Click → Redirect to Google OAuth

After auth → Return to settings page, show "Connected" status

Display: Connected property URL, last sync date

Actions: Sync now, Disconnect

GSC data table: queries, pages, clicks, impressions, CTR, position

Alerts System:

Bell icon in top nav (with unread count badge)

Click → Dropdown list of recent alerts

Each alert shows: icon (by severity), title, time ago

Click alert → Navigate to relevant page (e.g., keyword details for ranking drop)

"Mark all as read" action

UI Design Guidelines
Follow existing ORI-OS design system:

Use shadcn/ui components (Button, Card, Table, Dialog, Badge, etc.)

Tailwind CSS for styling

Color palette: gunmetal, white, silver, coffee bean, vivid tangerine

Zero or minimal border radius (per ORI-OS style)

Glassmorphism effects where appropriate

Framer Motion for animations

Lucide icons

SEO-specific color coding:

Ranking improvements: Green (#10b981)

Ranking declines: Red (#ef4444)

Critical issues: Red background

Warnings: Yellow/amber background

Info: Blue background

Good scores (>80): Green

Average scores (50-80): Yellow

Poor scores (<50): Red

Responsive design:

Mobile-first approach

Tables become cards on mobile

Charts maintain aspect ratio

Dialogs become full-screen on mobile

🔗 Cross-Module Integration Points
1. Intelligence Module → SEO Studio
When enriching a company:

typescript
// In apps/api/src/intelligence/services/company-enrichment.service.ts

async enrichCompany(companyId: string, userId: string) {
  // ... existing enrichment logic ...
  
  // NEW: Add SEO analysis option
  const company = await this.prisma.company.findUnique({
    where: { id: companyId },
    include: { organization: true }
  });
  
  // If company has a website, offer to create SEO project
  if (company.website) {
    // This can be automatic or user-triggered via UI button
    await this.seoProjectsService.createFromCompany({
      organizationId: company.organizationId,
      companyId: company.id,
      domain: this.extractDomain(company.website),
      name: `${company.name} - SEO Analysis`
    });
  }
  
  return enrichmentData;
}
UI integration:

Add "Analyze SEO" button to company detail page

When clicked, create SEO project and redirect to SEO dashboard

Show SEO project link in company sidebar if exists

2. CRM Module → SEO Studio
Track content engagement in deals:
    if (isHighValue) {
      await this.autoProgressDealStage(contactId, {
        note: `Viewed ${seoPage.title} - High intent signal`
      });
    }
  }
}

UI integration:

Add "Content Engagement" section to deal detail page

Show timeline of blog posts/pages viewed by contact

Display: page title, word count, time spent (if tracked)

Link to SEO project for content optimization

Dashboard widget:

"Top Content Driving Deals" card

Shows which blog posts/pages lead to most conversions

Metric: Views → MQLs → SQLs → Closed Won

Click → Opens content analysis for that page

3. Engagement Suite (Campaigns) → SEO Studio
Use SEO keywords to improve email copy:

typescript
// In apps/api/src/engagement/services/template.service.ts

async getContentSuggestions(campaignId: string) {
  const campaign = await this.prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { organization: { include: { seoProjects: true } } }
  });
  
  const seoProject = campaign.organization.seoProjects[0]; // Default project
  
  if (!seoProject) {
    return { keywords: [], message: 'Connect SEO Studio for keyword suggestions' };
  }
  
  // Get top-performing keywords from GSC
  const topKeywords = await this.prisma.gSCQueryData.groupBy({
    by: ['query'],
    where: {
      projectId: seoProject.id,
      date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      ctr: { gt: 0.05 } // High CTR indicates resonance
    },
    _sum: { clicks: true },
    orderBy: { _sum: { clicks: 'desc' } },
    take: 10
  });
  
  return {
    keywords: topKeywords.map(k => ({
      keyword: k.query,
      clicks: k._sum.clicks,
      suggestion: `This keyword drives ${k._sum.clicks} clicks/month`
    })),
    message: 'These keywords resonate with your audience. Consider using them in subject lines or body.'
  };
}
UI integration:

In campaign template editor, add "SEO Suggestions" sidebar

Display top keywords as clickable badges

Click badge → Insert into subject line or body

Show preview: "Using this keyword increased engagement by X%"

4. Automation Studio (Workflows) → SEO Studio
Add SEO-specific triggers and actions to workflow builder:

NEW Workflow Trigger Types:

typescript
// In apps/api/src/workflows/constants/node-types.ts

export const SEO_TRIGGERS = {
  RANKING_DROP: {
    id: 'seo.ranking_drop',
    name: 'Keyword Ranking Dropped',
    description: 'When a tracked keyword drops more than X positions',
    category: 'seo',
    icon: 'TrendingDown',
    config: {
      threshold: { type: 'number', default: 5, label: 'Drop threshold (positions)' },
      keywordIds: { type: 'multiselect', label: 'Specific keywords (or all)' }
    },
    outputs: {
      keyword: 'string',
      oldPosition: 'number',
      newPosition: 'number',
      url: 'string',
      drop: 'number'
    }
  },
  
  COMPETITOR_CONTENT: {
    id: 'seo.competitor_content',
    name: 'Competitor Published Content',
    description: 'When monitored competitor publishes new page',
    category: 'seo',
    icon: 'Eye',
    config: {
      competitorId: { type: 'select', label: 'Competitor' }
    },
    outputs: {
      competitorDomain: 'string',
      pageUrl: 'string',
      pageTitle: 'string',
      publishedAt: 'date'
    }
  },
  
  CRITICAL_ISSUE: {
    id: 'seo.critical_issue',
    name: 'Critical SEO Issue Detected',
    description: 'When site audit finds critical issue',
    category: 'seo',
    icon: 'AlertTriangle',
    config: {
      categories: { type: 'multiselect', label: 'Issue categories' }
    },
    outputs: {
      issueType: 'string',
      pageUrl: 'string',
      description: 'string',
      severity: 'string'
    }
  },
  
  GSC_TRAFFIC_DROP: {
    id: 'seo.gsc_traffic_drop',
    name: 'GSC Traffic Drop',
    description: 'When Google Search Console shows traffic decrease',
    category: 'seo',
    icon: 'TrendingDown',
    config: {
      threshold: { type: 'number', default: 20, label: 'Drop % threshold' }
    },
    outputs: {
      previousClicks: 'number',
      currentClicks: 'number',
      percentageChange: 'number',
      topAffectedQueries: 'array'
    }
  }
};
NEW Workflow Action Types:

typescript
export const SEO_ACTIONS = {
  CREATE_TASK: {
    id: 'seo.create_task',
    name: 'Create SEO Task',
    description: 'Create task to fix SEO issue',
    category: 'seo',
    icon: 'CheckSquare',
    inputs: {
      assigneeId: { type: 'user_select', label: 'Assign to' },
      title: { type: 'text', label: 'Task title' },
      description: { type: 'textarea', label: 'Description' },
      priority: { type: 'select', options: ['high', 'medium', 'low'] },
      dueDate: { type: 'date', label: 'Due date' }
    }
  },
  
  ANALYZE_CONTENT: {
    id: 'seo.analyze_content',
    name: 'Analyze Content',
    description: 'Run content analysis for URL and keyword',
    category: 'seo',
    icon: 'FileText',
    inputs: {
      url: { type: 'text', label: 'Page URL' },
      keyword: { type: 'text', label: 'Target keyword' }
    },
    outputs: {
      analysisId: 'string',
      score: 'number',
      recommendations: 'array'
    }
  },
  
  START_CRAWL: {
    id: 'seo.start_crawl',
    name: 'Start Site Audit',
    description: 'Trigger site crawl',
    category: 'seo',
    icon: 'Search',
    inputs: {
      projectId: { type: 'seo_project_select', label: 'SEO Project' },
      maxPages: { type: 'number', label: 'Max pages', default: 500 }
    },
    outputs: {
      crawlId: 'string',
      status: 'string'
    }
  },
  
  NOTIFY_ALERT: {
    id: 'seo.notify_slack',
    name: 'Send SEO Alert',
    description: 'Post alert to Slack channel',
    category: 'seo',
    icon: 'MessageSquare',
    inputs: {
      webhookUrl: { type: 'text', label: 'Slack Webhook URL' },
      message: { type: 'textarea', label: 'Message' },
      severity: { type: 'select', options: ['critical', 'warning', 'info'] }
    }
  }
};
Workflow Template Library:

Create pre-built workflow templates:

"Auto-Fix Critical SEO Issues"

Trigger: seo.critical_issue

Actions:

Create task assigned to SEO manager

Send Slack notification

Add to weekly report

"Competitor Content Response"

Trigger: seo.competitor_content

Actions:

Analyze competitor content

Create task for content team

Add to content calendar

"Weekly SEO Health Report"

Trigger: schedule (every Monday 9 AM)

Actions:

Aggregate SEO metrics

Generate PDF report

Email to stakeholders

"Ranking Drop Alert"

Trigger: seo.ranking_drop (threshold: 5)

Actions:

Create high-priority task

Analyze content quality

Send email alert

UI integration in Workflow Builder:

Add "SEO" category to node palette

Drag-drop SEO triggers and actions onto canvas

Configure nodes with SEO-specific inputs (project selector, keyword picker)

Show SEO data in workflow execution logs

5. Analytics Module → SEO Studio
Unified dashboard showing both outbound + inbound metrics:

typescript
// In apps/api/src/events/services/analytics.service.ts

async getDashboardMetrics(organizationId: string, period: { start: Date; end: Date }) {
  const [outbound, inbound] = await Promise.all([
    this.getOutboundMetrics(organizationId, period),
    this.getInboundMetrics(organizationId, period)
  ]);
  
  return {
    outbound: {
      emailsSent: outbound.emailsSent,
      emailsOpened: outbound.emailsOpened,
      replied: outbound.replied,
      meetings: outbound.meetings,
      newLeads: outbound.newLeads,
      pipeline: outbound.pipelineValue
    },
    inbound: {
      organicClicks: inbound.gscClicks,
      organicImpressions: inbound.gscImpressions,
      avgPosition: inbound.avgPosition,
      keywordsRanking: inbound.keywordsTop10,
      contentViews: inbound.contentViews,
      inboundLeads: inbound.leadsFromOrganic
    },
    combined: {
      totalLeads: outbound.newLeads + inbound.leadsFromOrganic,
      blendedCAC: this.calculateBlendedCAC(outbound, inbound),
      multiTouchAttribution: this.getMultiTouchAttribution(organizationId, period)
    }
  };
}

private async getInboundMetrics(organizationId: string, period: { start: Date; end: Date }) {
  const seoProjects = await this.prisma.sEOProject.findMany({
    where: { organizationId },
    select: { id: true }
  });
  
  const projectIds = seoProjects.map(p => p.id);
  
  // GSC metrics
  const gscData = await this.prisma.gSCQueryData.aggregate({
    where: {
      projectId: { in: projectIds },
      date: { gte: period.start, lte: period.end }
    },
    _sum: { clicks: true, impressions: true },
    _avg: { position: true }
  });
  
  // Ranking keywords in top 10
  const topRankings = await this.prisma.sEORanking.count({
    where: {
      keyword: { projectId: { in: projectIds } },
      position: { lte: 10 },
      checkedAt: { gte: period.start, lte: period.end }
    }
  });
  
  // Content views (from activity tracking)
  const contentViews = await this.prisma.event.count({
    where: {
      organizationId,
      type: 'seo_content_engagement',
      timestamp: { gte: period.start, lte: period.end }
    }
  });
  
  // Leads from organic (contacts with source = 'organic')
  const inboundLeads = await this.prisma.contact.count({
    where: {
      organizationId,
      source: 'organic',
      createdAt: { gte: period.start, lte: period.end }
    }
  });
  
  return {
    gscClicks: gscData._sum.clicks || 0,
    gscImpressions: gscData._sum.impressions || 0,
    avgPosition: gscData._avg.position || 0,
    keywordsTop10: topRankings,
    contentViews,
    leadsFromOrganic: inboundLeads
  };
}
UI Dashboard Integration:

Add to main dashboard (apps/web/app/(dashboard)/[orgSlug]/page.tsx):

New Dashboard Sections:

Inbound Marketing Performance Card

Organic clicks (this month vs last month)

Keywords in top 10 positions

Avg position trend chart

"View SEO Studio" link

Content Attribution Card

Top 5 blog posts driving leads

Content views → lead conversion rate

Best-performing content topics

"Optimize Content" link

Blended Metrics Card

Total leads (outbound + inbound)

Blended CAC (Customer Acquisition Cost)

Multi-touch attribution (which touchpoints matter)

Channel mix (email vs organic vs social)

6. Deliverability Module → SEO Studio
Domain authority affects email deliverability:

typescript
// In apps/api/src/deliverability/services/domain-audit.service.ts

async auditDomain(domainId: string) {
  // ... existing SPF/DKIM/DMARC checks ...
  
  // NEW: Add SEO domain metrics
  const seoProject = await this.prisma.sEOProject.findFirst({
    where: { 
      domain: domain.domain,
      organizationId: domain.organizationId
    },
    include: {
      backlinks: { where: { status: 'active' } },
      rankings: { 
        where: { position: { lte: 10 } },
        distinct: ['keywordId']
      }
    }
  });
  
  if (seoProject) {
    return {
      ...deliverabilityMetrics,
      seo: {
        backlinkCount: seoProject.backlinks.length,
        keywordsTop10: seoProject.rankings.length,
        domainAuthority: this.calculateDomainAuthority(seoProject),
        recommendation: seoProject.backlinks.length > 100 
          ? 'Strong domain authority - good for email deliverability'
          : 'Consider building backlinks to improve domain reputation'
      }
    };
  }
  
  return deliverabilityMetrics;
}
UI integration:

Show SEO metrics in domain audit report

"Domain authority score boosts email deliverability" tooltip

Link to SEO backlink monitoring

📊 Analytics & Event Tracking (CONTINUED)
New event types to track:

typescript
// Add to apps/api/src/events/constants/event-types.ts

export const SEO_EVENTS = {
  // Project events
  PROJECT_CREATED: 'seo.project_created',
  PROJECT_ARCHIVED: 'seo.project_archived',
  GSC_CONNECTED: 'seo.gsc_connected',
  GSC_DISCONNECTED: 'seo.gsc_disconnected',
  
  // Keyword events
  KEYWORD_ADDED: 'seo.keyword_added',
  KEYWORD_TRACKED: 'seo.keyword_tracked',
  KEYWORD_UNTRACKED: 'seo.keyword_untracked',
  KEYWORD_IMPORTED: 'seo.keyword_imported',
  
  // Crawl events
  CRAWL_STARTED: 'seo.crawl_started',
  CRAWL_COMPLETED: 'seo.crawl_completed',
  CRAWL_FAILED: 'seo.crawl_failed',
  ISSUE_ACKNOWLEDGED: 'seo.issue_acknowledged',
  ISSUE_FIXED: 'seo.issue_fixed',
  
  // Ranking events
  RANKING_CHECKED: 'seo.ranking_checked',
  RANKING_IMPROVED: 'seo.ranking_improved',
  RANKING_DECLINED: 'seo.ranking_declined',
  SNIPPET_WON: 'seo.snippet_won',
  SNIPPET_LOST: 'seo.snippet_lost',
  
  // Content events
  CONTENT_ANALYZED: 'seo.content_analyzed',
  CONTENT_ENGAGEMENT: 'seo.content_engagement', // User viewed blog post
  
  // Backlink events
  BACKLINK_GAINED: 'seo.backlink_gained',
  BACKLINK_LOST: 'seo.backlink_lost',
  
  // Competitor events
  COMPETITOR_ADDED: 'seo.competitor_added',
  COMPETITOR_CONTENT_PUBLISHED: 'seo.competitor_content_published',
  
  // Alert events
  ALERT_CREATED: 'seo.alert_created',
  ALERT_READ: 'seo.alert_read',
  
  // GSC sync events
  GSC_SYNCED: 'seo.gsc_synced',
  GSC_SYNC_FAILED: 'seo.gsc_sync_failed',
};
Track these events throughout the SEO module:

Every service method that performs a significant action should call eventsService.track() with appropriate metadata.

Example event tracking pattern:

typescript
// In any SEO service method:
await this.eventsService.track({
  organizationId: project.organizationId,
  userId: userId, // If user-initiated
  type: SEO_EVENTS.CRAWL_COMPLETED,
  metadata: {
    projectId: project.id,
    crawlId: crawl.id,
    pagesCrawled: crawl.pagesCrawled,
    issuesFound: crawl.issuesFound,
    criticalIssues: crawl.criticalIssues,
    duration: crawl.completedAt - crawl.startedAt
  }
});
Dashboard analytics queries:

typescript
// Get SEO activity summary
async getSEOActivitySummary(organizationId: string, period: { start: Date; end: Date }) {
  const events = await this.prisma.event.groupBy({
    by: ['type'],
    where: {
      organizationId,
      type: { startsWith: 'seo.' },
      timestamp: { gte: period.start, lte: period.end }
    },
    _count: true
  });
  
  return {
    crawlsRun: events.find(e => e.type === 'seo.crawl_completed')?._count || 0,
    keywordsAdded: events.find(e => e.type === 'seo.keyword_added')?._count || 0,
    issuesFixed: events.find(e => e.type === 'seo.issue_fixed')?._count || 0,
    rankingsImproved: events.find(e => e.type === 'seo.ranking_improved')?._count || 0,
    contentAnalyses: events.find(e => e.type === 'seo.content_analyzed')?._count || 0
  };
}
🔒 Security & Compliance
Token Encryption
Use existing ORI-OS encryption utility for GSC tokens:

typescript
// In apps/api/src/seo/services/gsc.service.ts

import { CryptoService } from '../../common/services/crypto.service';

constructor(
  private prisma: PrismaService,
  private crypto: CryptoService // Existing ORI-OS encryption
) {}

private async encryptToken(token: string): Promise<string> {
  return this.crypto.encrypt(token);
}

private async decryptToken(encryptedToken: string): Promise<string> {
  return this.crypto.decrypt(encryptedToken);
}
Ensure master encryption key is in environment:

bash
# In .env file (already exists in ORI-OS)
ENCRYPTION_KEY="your-32-byte-encryption-key-here"
RBAC for SEO Module
Permission checks in controllers:

typescript
// In all SEO controllers
import { RBACGuard } from '../../auth/guards/rbac.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('seo/projects')
@UseGuards(JwtAuthGuard, RBACGuard)
export class ProjectsController {
  
  @Post()
  @Roles('owner', 'admin', 'manager') // Only these roles can create projects
  async create(@CurrentUser() user: User, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(user.id, user.organizationId, dto);
  }
  
  @Delete(':id')
  @Roles('owner', 'admin') // Only owner/admin can delete
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectsService.delete(id, user.organizationId);
  }
}
Role capabilities for SEO:

Owner: Full access (create/delete projects, connect GSC, configure settings)

Admin: Full access except billing and org-level settings

Manager: Create projects, run crawls, analyze content, manage keywords

Operator: View reports, run crawls, acknowledge issues (no delete)

Viewer: Read-only access to all SEO data

Audit Logging
Log critical SEO actions:

typescript
// In apps/api/src/audit/services/audit-log.service.ts

// Add SEO-specific audit events
await this.createAuditLog({
  organizationId,
  userId,
  action: 'seo.gsc_connected',
  resource: 'seo_project',
  resourceId: projectId,
  metadata: {
    siteUrl: gscSiteUrl,
    connectedAt: new Date()
  }
});

await this.createAuditLog({
  organizationId,
  userId,
  action: 'seo.bulk_keyword_import',
  resource: 'seo_keywords',
  metadata: {
    projectId,
    keywordCount: keywords.length,
    source: 'csv_import'
  }
});
Audit log entries for:

GSC connection/disconnection

Bulk keyword imports

Project deletion/archival

Critical issue acknowledgment

Competitor addition/removal

Rate Limiting
Add rate limits to SEO endpoints:

typescript
// In SEO controllers, add throttle decorators
import { Throttle } from '@nestjs/throttler';

@Post('crawl')
@Throttle(5, 3600) // Max 5 crawls per hour
async startCrawl(@Body() dto: StartCrawlDto) {
  return this.crawlService.startCrawl(dto.projectId, dto.options);
}

@Post('keywords/research')
@Throttle(20, 60) // Max 20 keyword research requests per minute
async research(@Body() dto: ResearchDto) {
  return this.keywordsService.research(dto.projectId, dto.seedKeyword);
}

@Post('content/analyze')
@Throttle(10, 3600) // Max 10 content analyses per hour
async analyze(@Body() dto: AnalyzeContentDto) {
  return this.contentService.analyze(dto.projectId, dto);
}
Prevent abuse:

Crawl limits prevent server overload

Keyword research limits prevent API quota exhaustion

Content analysis limits prevent excessive SERP scraping

GDPR Compliance
SEO data is mostly non-personal, but:

GSC tokens are personal data (linked to user's Google account)

Store encrypted

Delete on user request

Include in GDPR export

Visitor tracking (if implemented)

Cookie consent required for tracking blog visitors

Anonymize IP addresses

Allow opt-out

Data retention:

GSC data: Keep for 1 year (configurable)

Crawl data: Keep latest 10 crawls per project

Rankings: Keep indefinitely (aggregated, non-personal)

GDPR export includes:

typescript
// In apps/api/src/compliance/services/gdpr.service.ts

async exportUserData(userId: string) {
  // ... existing exports ...
  
  // NEW: SEO data
  const seoProjects = await this.prisma.sEOProject.findMany({
    where: { createdBy: userId },
    include: {
      keywords: true,
      crawls: { include: { issues: true } },
      alerts: true
    }
  });
  
  return {
    ...existingExports,
    seo: {
      projects: seoProjects.map(p => ({
        name: p.name,
        domain: p.domain,
        createdAt: p.createdAt,
        gscConnected: p.gscConnected,
        keywords: p.keywords.length,
        crawls: p.crawls.length
      }))
    }
  };
}
🧪 Testing Strategy
Unit Tests
Test core service methods:

typescript
// apps/api/src/seo/services/__tests__/keywords.service.spec.ts

describe('KeywordsService', () => {
  it('should create keyword with valid data', async () => {
    const keyword = await keywordsService.create(projectId, {
      keyword: 'test keyword',
      priority: 'high',
      tracked: true
    });
    
    expect(keyword).toBeDefined();
    expect(keyword.keyword).toBe('test keyword');
    expect(keyword.tracked).toBe(true);
  });
  
  it('should prevent duplicate keywords', async () => {
    await keywordsService.create(projectId, { keyword: 'duplicate' });
    
    await expect(
      keywordsService.create(projectId, { keyword: 'duplicate' })
    ).rejects.toThrow();
  });
  
  it('should cluster keywords by topic', async () => {
    // Create test keywords
    await keywordsService.bulkImport(projectId, [
      'seo tools',
      'best seo tools',
      'seo software',
      'keyword research',
      'keyword finder'
    ]);
    
    const clusters = await keywordsService.cluster(projectId);
    
    expect(clusters).toHaveLength(2); // tools and keyword clusters
    expect(clusters[0].keywords).toContain('seo tools');
  });
});
Integration Tests
Test API endpoints:

typescript
// apps/api/test/seo/projects.e2e-spec.ts

describe('SEO Projects (e2e)', () => {
  it('POST /seo/projects - creates project', async () => {
    return request(app.getHttpServer())
      .post('/api/seo/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Project',
        domain: 'example.com',
        targetCountry: 'PL'
      })
      .expect(201)
      .expect(res => {
        expect(res.body.name).toBe('Test Project');
        expect(res.body.domain).toBe('example.com');
      });
  });
  
  it('GET /seo/projects/:id - requires org access', async () => {
    // User from different org tries to access
    return request(app.getHttpServer())
      .get(`/api/seo/projects/${projectId}`)
      .set('Authorization', `Bearer ${otherUserToken}`)
      .expect(403);
  });
});
Frontend Component Tests
Test key UI components:

typescript
// apps/web/components/seo/__tests__/keyword-table.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { KeywordTable } from '../keyword-table';

describe('KeywordTable', () => {
  const mockKeywords = [
    { id: '1', keyword: 'test keyword', position: 5, tracked: true },
    { id: '2', keyword: 'another keyword', position: 12, tracked: false }
  ];
  
  it('renders keywords correctly', () => {
    render(<KeywordTable keywords={mockKeywords} />);
    
    expect(screen.getByText('test keyword')).toBeInTheDocument();
    expect(screen.getByText('another keyword')).toBeInTheDocument();
  });
  
  it('toggles tracking status', async () => {
    const onToggleTrack = jest.fn();
    render(<KeywordTable keywords={mockKeywords} onToggleTrack={onToggleTrack} />);
    
    const trackToggle = screen.getAllByRole('checkbox')[0];
    fireEvent.click(trackToggle);
    
    expect(onToggleTrack).toHaveBeenCalledWith('1', false);
  });
});
📦 Dependencies to Add
Backend packages:

json
// apps/api/package.json - ADD these dependencies

{
  "dependencies": {
    "googleapis": "^126.0.0",
    "cheerio": "^1.0.0-rc.12",
    "axios": "^1.6.2",
    "robots-parser": "^3.0.1",
    "natural": "^6.10.4",
    "readability-scores": "^1.0.0"
  }
}
Worker packages (if not already present):

json
// apps/worker/package.json - ADD if needed

{
  "dependencies": {
    "puppeteer": "^21.6.1",
    "puppeteer-extra": "^3.3.6",
    "puppeteer-extra-plugin-stealth": "^2.11.2"
  }
}
Frontend packages (likely already in ORI-OS):

json
// apps/web/package.json - VERIFY these exist

{
  "dependencies": {
    "recharts": "^2.10.3",
    "react-flow-renderer": "^10.3.17",
    "date-fns": "^3.0.6"
  }
}

🚀 Deployment Steps
1. Database Migration
bash
# From repo root
cd packages/db

# Generate migration for SEO schema
npx prisma migrate dev --name add_seo_studio_module

# This will:
# - Create all SEO tables (SEOProject, SEOKeyword, etc.)
# - Add foreign key relations to existing tables (Company, User, Organization)
# - Create indexes for performance
# - Generate Prisma client with new types

# Apply to production database (when ready)
npx prisma migrate deploy
2. Environment Variables
Add to .env file:

bash
# Google Search Console OAuth (required for GSC integration)
GOOGLE_CLIENT_ID="your-google-oauth-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
GOOGLE_REDIRECT_URI="https://yourdomain.com/api/seo/gsc/callback"

# Optional: SERP API keys (if using paid services)
SERPAPI_KEY="your-serpapi-key" # Optional, for SERP scraping
VALUESERP_KEY="your-valueserp-key" # Optional, for rank tracking

# SEO Worker Settings
SEO_CRAWL_CONCURRENCY=3 # Max concurrent crawls
SEO_CRAWL_RATE_LIMIT=1000 # Milliseconds between requests
SEO_RANKING_CHECK_INTERVAL="0 2 * * *" # Daily at 2 AM
SEO_GSC_SYNC_INTERVAL="0 3 * * *" # Daily at 3 AM
SEO_COMPETITOR_CHECK_INTERVAL="0 9 * * MON" # Weekly Monday 9 AM
3. Google OAuth Setup
Steps to get Google OAuth credentials:

Go to Google Cloud Console

Create new project (or use existing)

Enable "Google Search Console API"

Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"

Application type: "Web application"

Authorized redirect URIs: Add https://yourdomain.com/api/seo/gsc/callback

Copy Client ID and Client Secret to .env

4. Worker Registration
Update worker to process SEO queues:

typescript
// apps/worker/src/main.ts

import { seoCrawlProcessor } from './processors/seo-crawl.processor';
import { seoRankingProcessor } from './processors/seo-ranking.processor';
import { seoGscSyncProcessor } from './processors/seo-gsc-sync.processor';
import { seoCompetitorProcessor } from './processors/seo-competitor.processor';

// Register SEO processors
Queue('seo-crawl').process(seoCrawlProcessor);
Queue('seo-ranking').process(seoRankingProcessor);
Queue('seo-gsc-sync').process(seoGscSyncProcessor);
Queue('seo-competitor').process(seoCompetitorProcessor);

// Add cron jobs for scheduled tasks
Queue('seo-ranking').add('check-rankings', {}, {
  repeat: { cron: process.env.SEO_RANKING_CHECK_INTERVAL }
});

Queue('seo-gsc-sync').add('sync-all-projects', {}, {
  repeat: { cron: process.env.SEO_GSC_SYNC_INTERVAL }
});

Queue('seo-competitor').add('check-competitors', {}, {
  repeat: { cron: process.env.SEO_COMPETITOR_CHECK_INTERVAL }
});
5. Build and Deploy
bash
# From repo root

# Build all apps
npm run build

# Or build individually
cd apps/api && npm run build
cd apps/web && npm run build
cd apps/worker && npm run build

# Deploy to Hostinger VPS (follow existing ORI-OS deployment guide)
# Restart services
pm2 restart ori-os-api
pm2 restart ori-os-worker
pm2 restart ori-os-web
6. Post-Deployment Verification
Checklist:

bash
# 1. Verify API endpoints
curl https://yourdomain.com/api/seo/projects # Should return 401 (auth required)

# 2. Check worker queues
# Login to Redis CLI
redis-cli
KEYS seo-* # Should show seo-crawl, seo-ranking, etc. queues

# 3. Test GSC OAuth flow
# Navigate to: https://yourdomain.com/app/[org]/seo/projects/new
# Click "Connect Google Search Console"
# Should redirect to Google login

# 4. Verify database
psql -d ori_os
\dt seo* # Should list all SEO tables
SELECT COUNT(*) FROM "SEOProject"; # Should be 0 initially

# 5. Check logs
tail -f /var/log/ori-os/worker.log # Should show "Registered SEO processors"
📚 Documentation Updates
1. Update Main README
Add SEO Studio section to README.md:

text
## Modules

### SEO Studio (NEW)
Inbound marketing and technical SEO platform integrated with sales workflows.

**Features:**
- Keyword research and rank tracking
- Technical SEO site audits
- Content optimization vs competitors
- Google Search Console integration
- Backlink monitoring
- Competitor tracking
- Automated SEO workflows

**Quick Start:**
1. Create SEO project: `/app/[org]/seo/new`
2. Connect Google Search Console (optional but recommended)
3. Add keywords to track
4. Run first site audit
5. Set up automated alerts

**Learn more:** [SEO Studio Guide](./docs/SEO_STUDIO.md)
2. Create SEO Studio Documentation
FILE: docs/SEO_STUDIO.md

text
# SEO Studio - Complete Guide

## Overview
SEO Studio transforms ORI-OS into a full-funnel growth engine by adding inbound marketing capabilities to your outbound sales automation.

## Architecture
- **Backend:** NestJS module (`apps/api/src/seo/`)
- **Frontend:** Next.js routes (`apps/web/app/(dashboard)/[orgSlug]/seo/`)
- **Workers:** BullMQ processors for crawling, rank checking, GSC sync
- **Database:** 11 new Prisma models + relations to existing entities

## Core Concepts

### SEO Projects
- Container for all SEO work on a domain
- Links to existing Company (optional)
- Stores GSC credentials
- Configures crawl settings

### Keywords
- Research via Google Autocomplete (free)
- Track ranking positions daily
- Cluster by topic with AI
- Import from CSV or GSC

### Site Audits (Crawls)
- Automated technical SEO checks
- Finds 140+ issue types
- Prioritizes by severity
- Suggests internal links

### Content Analysis
- Compare your content vs top 10 competitors
- SEO score (0-100)
- Actionable recommendations
- Content gap identification

### Google Search Console
- OAuth integration
- Daily data sync
- Automatic keyword import
- Traffic anomaly alerts

## Integration Points

### Intelligence Module
- "Analyze SEO" button on company pages
- Auto-create SEO project for competitors

### CRM Module
- Track which blog posts contacts viewed
- High-intent content triggers deal progression
- "Content Engagement" timeline in deals

### Campaigns Module
- SEO keyword suggestions for email copy
- "Use top-performing keywords" feature

### Automation Studio
- SEO-specific triggers (ranking drops, competitor content, critical issues)
- SEO actions (create tasks, analyze content, start crawls)

### Analytics Dashboard
- Unified outbound + inbound metrics
- Blended CAC calculation
- Multi-touch attribution

## API Reference

[Full API documentation with request/response examples]

## Workflows Examples

### Auto-Fix Critical Issues
Trigger: Critical SEO issue detected
→ Create task assigned to SEO manager
→ Send Slack notification

### Competitor Response
Trigger: Competitor publishes new content
→ Analyze their content
→ Create task for content team

### Weekly Report
Trigger: Every Monday 9 AM
→ Aggregate SEO metrics
→ Email report to stakeholders

## Best Practices

1. **Connect GSC first** - Most accurate ranking data
2. **Start with 10-20 keywords** - Quality over quantity
3. **Run audits weekly** - Catch issues early
4. **Fix critical issues immediately** - They hurt rankings
5. **Monitor competitors** - Stay ahead of their content
6. **Use workflows** - Automate repetitive tasks

## Troubleshooting

### GSC Connection Fails
- Verify redirect URI in Google Cloud Console
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
- Ensure user has GSC access to the property

### Crawl Hangs
- Check worker logs: `tail -f /var/log/ori-os/worker.log`
- Verify target site allows crawling (robots.txt)
- Increase timeout if site is slow

### Rank Tracking Inaccurate
- Use GSC data instead (more reliable than SERP scraping)
- If using SERP API, check quota limits
- Rankings vary by location - set correct targetCountry

## Roadmap

- [ ] AI content writer (generate optimized content)
- [ ] Schema markup generator UI
- [ ] Automated internal linking (WordPress plugin)
- [ ] Image optimization recommendations
- [ ] Core Web Vitals monitoring
- [ ] Local SEO pack tracker
- [ ] International SEO (hreflang)
3. Update App Tree Documentation
FILE: docs/APP_TREE.md

Add SEO Studio section:

text
## SEO Studio Module

### Routes
/app/[orgSlug]/seo/
├── / - Projects overview
├── /new - Create project wizard
└── /projects/[projectId]/
    ├── / - Dashboard
    ├── /keywords - Keyword research & tracking
    ├── /audit - Site audit results
    ├── /content - Content analyzer
    ├── /backlinks - Backlink monitor
    ├── /competitors - Competitor tracking
    └── /settings - Project settings & GSC

### API Endpoints
/api/seo/
├── /projects - CRUD projects
├── /projects/:id/keywords - Keyword management
├── /projects/:id/rankings - Rank tracking
├── /projects/:id/crawl - Site audits
├── /projects/:id/content - Content analysis
├── /projects/:id/backlinks - Backlink monitoring
├── /projects/:id/gsc - Google Search Console
├── /projects/:id/competitors - Competitor tracking
└── /projects/:id/alerts - Notifications

### Database Models
- SEOProject
- SEOKeyword
- SEORanking
- SEOCrawl
- SEOPage
- SEOIssue
- SEOContentAnalysis
- SEOBacklink
- SEOCompetitor
- SEOAlert
- GSCQueryData

### Workers
- seo-crawl: Execute site audits
- seo-ranking: Check keyword positions
- seo-gsc-sync: Sync GSC data daily
- seo-competitor: Monitor competitor content

### Components
apps/web/components/seo/
├── project-card.tsx
├── keyword-table.tsx
├── ranking-chart.tsx
├── crawl-issues-list.tsx
├── content-score-card.tsx
├── gsc-connection-dialog.tsx
└── [30+ other components]
🎯 Migration Guide for Existing ORI-OS Users
FILE: docs/MIGRATION_SEO_STUDIO.md

text
# Migrating to ORI-OS with SEO Studio

## For Existing ORI-OS Users

### What's New
You now have a complete inbound marketing platform alongside your outbound sales tools.

### Zero Breaking Changes
- All existing features work exactly as before
- SEO Studio is an additive module
- No changes to your current workflows, campaigns, or CRM data

### How to Start Using SEO Studio

#### Step 1: Run Database Migration
```bash
cd packages/db
npx prisma migrate deploy
Step 2: Add Environment Variables
bash
# Add to your .env file
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REDIRECT_URI="https://yourdomain.com/api/seo/gsc/callback"
Step 3: Restart Services
bash
pm2 restart all
Step 4: Create Your First SEO Project
Navigate to /app/[your-org]/seo

Click "New Project"

Enter your domain

Connect Google Search Console (optional)

Run your first site audit

Recommended First Actions
Connect GSC - Get accurate ranking data

Import keywords from campaigns - See which keywords your emails use

Run site audit - Fix critical technical issues

Analyze top content - See what's driving organic traffic

Set up competitor monitoring - Stay ahead of competition

Cost Implications
Free forever:

Google Search Console integration (official API)

Google Autocomplete keyword research

Site auditing (crawl your own site)

Content analysis (basic)

Backlink monitoring (manual entry)

Optional paid upgrades:

SERP API for automated rank tracking ($50-250/month)

External backlink data (Moz/Majestic APIs)

Advanced content analysis (more competitors)

Support
Slack: #seo-studio

Email: support@ori-os.com

Docs: https://docs.ori-os.com/seo-studio

***

## ✅ PROJECT GOAL COMPLETION CRITERIA

### **What Defines Success for This Integration**

#### **Phase 1: MVP Launch (Weeks 1-4)**

**MUST HAVE (Blocking):**
- ✅ Database schema migrated without data loss
- ✅ All 11 SEO models created with proper relations
- ✅ SEO Projects CRUD functional
- ✅ Keyword research via Google Autocomplete working
- ✅ Basic site crawler functional (100 pages min)
- ✅ GSC OAuth flow complete (connect/disconnect)
- ✅ Daily GSC sync working
- ✅ SEO Studio navigation in dashboard
- ✅ Project dashboard with KPIs displayed
- ✅ Keywords page with add/track/import
- ✅ Site audit results page with issues list
- ✅ Zero breaking changes to existing ORI-OS features

**SHOULD HAVE (Important):**
- ✅ Rank tracking (manual check)
- ✅ Content analysis (your page vs competitors)
- ✅ Backlink monitoring (manual entry)
- ✅ SEO alerts for critical issues
- ✅ Internal link suggestions
- ✅ Competitor monitoring (basic)

**COULD HAVE (Nice to have):**
- ⏳ Automated rank tracking (daily checks)
- ⏳ Keyword clustering with AI
- ⏳ SERP feature tracking
- ⏳ Advanced content gap analysis

#### **Phase 2: Integration Polish (Weeks 5-6)**

**MUST HAVE:**
- ✅ Intelligence → SEO: "Analyze SEO" button on company pages
- ✅ CRM → SEO: Content engagement tracking in deals
- ✅ Campaigns → SEO: Keyword suggestions in email templates
- ✅ Analytics → SEO: Unified dashboard with inbound metrics
- ✅ Workflows → SEO: SEO triggers and actions in Automation Studio

**SHOULD HAVE:**
- ✅ SEO events tracked in analytics
- ✅ RBAC permissions enforced
- ✅ Audit logging for critical SEO actions
- ✅ Rate limiting on API endpoints

#### **Phase 3: Production Ready (Weeks 7-8)**

**MUST HAVE:**
✅ All unit tests passing (>80% coverage for SEO services)

✅ Integration tests for critical endpoints (projects, keywords, crawl, GSC)

✅ Error handling and validation on all API endpoints

✅ Loading states and error messages in UI

✅ Mobile-responsive design for all SEO pages

✅ Documentation complete (API reference, user guide, integration guide)

✅ Migration guide for existing users

✅ Environment variables documented

✅ Worker processes stable under load

✅ Database indexes optimized for performance

✅ Security audit passed (token encryption, RBAC, rate limiting)

SHOULD HAVE:

✅ Performance optimized (API response <500ms, page load <2s)

✅ Accessibility (WCAG 2.1 AA compliance)

✅ SEO workflow templates in library

✅ Onboarding flow for first-time SEO users

✅ Help tooltips and empty states

📊 SUCCESS METRICS
Technical Metrics
Backend Performance:

API endpoints respond in <500ms (p95)

Database queries <100ms (p95)

Worker jobs complete successfully >99%

Zero downtime during deployment

Memory usage <2GB per service

Frontend Performance:

Lighthouse score >90

First Contentful Paint <1.5s

Time to Interactive <3s

No console errors in production

Data Integrity:

Zero data loss during migration

Foreign key constraints enforced

Unique constraints prevent duplicates

Cascading deletes work correctly

Business Metrics
Adoption (First 30 Days):

50% of organizations create at least 1 SEO project

30% connect Google Search Console

25% run at least 1 site audit

20% track at least 10 keywords

Engagement (First 90 Days):

40% of SEO users active weekly (run crawl, check rankings, analyze content)

Average 3 SEO projects per organization

Average 50 keywords tracked per project

15% use SEO data in campaign templates

10% set up SEO workflows

Value Delivered:

Users find average 25 critical issues per site

60% fix at least 1 critical issue within 7 days

Average content score improves from 45 to 65 after recommendations

Organizations with SEO Studio show 30% more inbound leads

Integration Success:
80% of Intelligence-discovered companies have SEO analysis

50% of deals show content engagement timeline

30% of campaigns use SEO keyword suggestions

25% of workflows include SEO triggers/actions

Dashboard shows unified outbound+inbound metrics for 100% of users

🎯 DEFINITION OF DONE - FINAL CHECKLIST
Code Complete
 All Prisma models defined and migrated

 All API controllers implemented with DTOs

 All services implemented with business logic

 All workers implemented and registered

 All UI routes created

 All UI components built

 Integration points with existing modules complete

 Third-party API providers integrated (Google Autocomplete, GSC)

Quality Assurance
 Unit tests written for all services (>80% coverage)

 Integration tests for all API endpoints

 Frontend component tests for critical UI

 Manual testing completed (happy path + edge cases)

 Security review passed (encryption, RBAC, rate limiting)

 Performance testing passed (load test with 100 concurrent users)

 Accessibility audit passed (WCAG 2.1 AA)

 Browser compatibility verified (Chrome, Firefox, Safari, Edge)

 Mobile responsiveness verified (iOS Safari, Android Chrome)

Documentation
 API documentation complete with examples

 User guide written (SEO_STUDIO.md)

 Migration guide for existing users

 App tree updated with SEO routes

 Environment variables documented

 Deployment guide updated

 Troubleshooting section added

 Video walkthrough recorded (optional)

Deployment
 Database migration tested on staging

 Environment variables configured

 Google OAuth credentials obtained

 Workers registered and scheduled

 Services deployed to production

 Health checks passing

 Monitoring and alerting configured

 Rollback plan documented

User Enablement
 Onboarding flow for new SEO users

 Help tooltips on complex features

 Empty states with clear CTAs

 Error messages are helpful and actionable

 Sample data / demo project available

 Changelog published

 Announcement email sent to users

 Support team trained on new features

🚀 GO-LIVE CHECKLIST
Pre-Launch (T-7 days)
 Code freeze on main branch

 Final QA pass on staging environment

 Performance testing completed

 Security audit completed

 Database migration tested on production-like data

 Rollback plan documented and tested

 Support team trained

 Documentation published

 Monitoring dashboards configured

Launch Day (T-0)
 Database backup taken

 Maintenance window announced (if needed)

 Run database migration: npx prisma migrate deploy

 Deploy backend: pm2 restart ori-os-api

 Deploy worker: pm2 restart ori-os-worker

 Deploy frontend: pm2 restart ori-os-web

 Verify health checks: curl https://yourdomain.com/api/health

 Verify SEO endpoints: curl https://yourdomain.com/api/seo/projects

 Test GSC OAuth flow manually

 Monitor error logs for 1 hour

 Send announcement to users

Post-Launch (T+1 to T+7)
 Monitor adoption metrics daily

 Respond to user feedback in <24 hours

 Fix critical bugs immediately

 Track success metrics (projects created, GSC connections, crawls run)

 Collect user feedback via in-app survey

 Schedule retrospective meeting

 Plan Phase 2 features based on feedback

🎯 PROJECT GOAL COMPLETION - FINAL SUMMARY
What Success Looks Like
✅ TECHNICAL SUCCESS:

SEO Studio module fully integrated into ORI-OS

Zero breaking changes to existing functionality

All 11 database models created with proper relations

Full API implementation (50+ endpoints)

Complete UI with 30+ reusable components

Worker processes running stable

Tests passing (>80% coverage)

Performance targets met (<500ms API, <2s page load)

Security requirements met (encryption, RBAC, rate limiting)

✅ FUNCTIONAL SUCCESS:

Users can create SEO projects and track keywords

Google Search Console integration works (OAuth + daily sync)

Site crawler finds technical issues automatically

Content analyzer compares against competitors

Ranking tracker monitors positions over time

Backlink monitor tracks link building

Competitor monitor alerts on new content

SEO data flows into CRM, campaigns, and workflows

Unified analytics dashboard shows inbound + outbound metrics

✅ BUSINESS SUCCESS:

ORI-OS becomes a complete growth platform (not just outbound)

Users see clear ROI from SEO features (issues fixed, rankings improved)

Differentiation from competitors (only platform with integrated SEO + sales)

Higher retention (users rely on ORI-OS for more of their stack)

Upsell opportunity (enterprise users pay more for advanced features)

Reduced churn (inbound leads supplement outbound campaigns)

✅ USER SUCCESS:

Users spend less time switching tools (everything in one platform)

Data silos eliminated (SEO data enriches CRM records)

Workflows automated (SEO triggers save manual work)

Better decisions (unified analytics show full customer journey)

Higher ROI (blended CAC lower than pure outbound)

How We Measure Success
Week 1 Post-Launch:

100+ SEO projects created

50+ GSC connections

200+ site audits run

Zero critical bugs reported

Month 1 Post-Launch:

50% of organizations using SEO Studio

1,000+ keywords tracked

500+ critical issues fixed

5+ workflows using SEO triggers

90%+ user satisfaction (NPS survey)

Quarter 1 Post-Launch:

70% of organizations using SEO Studio

30% increase in inbound leads for active users

20% reduction in CAC (blended vs outbound-only)

10+ enterprise customers using advanced features

Feature requests prioritized for Phase 2

🏁 FINAL INSTRUCTIONS FOR ANTIGRAVITY
Execution Priority
Phase 1 (Weeks 1-2): Core Infrastructure

Create Prisma schema with all 11 models

Run migration and verify database

Build all service layer methods

Create all API controllers and routes

Register SEO module in main app

Implement GSC OAuth flow

Phase 2 (Weeks 3-4): UI & Workers

Build all frontend routes and pages

Create all reusable components

Implement worker processors

Register workers and cron jobs

Test crawling and ranking checks

Phase 3 (Weeks 5-6): Integration

Connect SEO to Intelligence module

Connect SEO to CRM module

Connect SEO to Campaigns module

Add SEO triggers/actions to Workflows

Update Analytics dashboard

Phase 4 (Weeks 7-8): Polish & Launch

Write all tests (unit + integration)

Complete documentation

Security audit and fixes

Performance optimization

Deploy to production

Code Style & Conventions
Follow existing ORI-OS patterns (NestJS modules, Next.js routes)

Use TypeScript strict mode

Use Prisma for all database access

Use shadcn/ui components for UI

Follow existing naming conventions

Add JSDoc comments to all public methods

Use existing error handling patterns

Reuse existing utilities (encryption, validation, etc.)

Testing Requirements
Unit test all service methods

Integration test all API endpoints

Frontend test critical user flows

Manual test GSC OAuth

Load test workers with 1000+ jobs

Security test (token leakage, SQL injection, XSS)

Commit Standards
text
feat(seo): Add keyword research functionality
fix(seo): Fix GSC token refresh logic
docs(seo): Update API documentation
test(seo): Add crawler service tests
refactor(seo): Optimize ranking query performance
🎉 PROJECT GOAL COMPLETION STATEMENT
This integration is COMPLETE when:

✅ All code is written, tested, and deployed

✅ All documentation is published

✅ Users can successfully:

Create SEO projects

Connect Google Search Console

Track keyword rankings

Run site audits and fix issues

Analyze content vs competitors

Monitor backlinks and competitors

Use SEO data in campaigns and workflows

View unified analytics

✅ Zero breaking changes to existing ORI-OS features

✅ Performance, security, and accessibility standards met

✅ At least 50% user adoption within 30 days

✅ User satisfaction >90% (NPS survey)

✅ Roadmap for Phase 2 features established

ORI-OS will be the ONLY platform that unifies:

Outbound sales automation (cold email, sequences)

Inbound marketing (SEO, content, organic traffic)

CRM with content attribution

Workflow automation with SEO triggers

Unified analytics (full customer journey)

This makes ORI-OS the complete growth engine for modern B2B companies.

📋 FINAL DELIVERABLES SUMMARY
✅ Database Schema: 11 new models + relations to existing entities

✅ Backend API: 50+ endpoints across 9 controllers

✅ Services Layer: 9 services with full business logic

✅ Workers: 4 BullMQ processors for async tasks

✅ Frontend Routes: 15+ pages in SEO Studio section

✅ UI Components: 30+ reusable React components

✅ Integration Points: Connections to 5 existing modules

✅ Workflow Nodes: 4 triggers + 4 actions for Automation Studio

✅ Tests: Unit, integration, and frontend tests

✅ Documentation: API docs, user guide, migration guide, deployment guide

Total Estimated Lines of Code: ~15,000 LOC

Backend: ~6,000 LOC

Frontend: ~5,000 LOC

Workers: ~2,000 LOC

Tests: ~2,000 LOC

NOW BEGIN IMPLEMENTATION. Follow this prompt exactly. Output COMPLETE files, not snippets. Maintain ORI-OS conventions. Build it properly. Make it production-ready. 🚀