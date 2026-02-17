# Wizards and UX Specs for All Major Features

> [!NOTE]
> **Status: IMPLEMENTED (Domain & Mailbox)**
> The Domain & Mailbox Setup Wizard is fully implemented in `DomainMailboxWizard.tsx`.

Use the same format as the “New Campaign” wizard: goal, screens, validations, and messages. Treat each section as a mini‑product spec you can hand to a PM or junior dev.
  
---

## A. Domain & Mailbox Setup Wizard (Deliverability Suite)

## Step 1 – Add Domain

Goal: Register a sending domain and check DNS basics.  
Fields:

* Domain name: example.com (text).  
* Purpose (optional): primary, cold-outbound, transactional.

Validations:

* Domain format (no protocol, no path).  
* Domain not already in the org.

Inline rules/messages:

* If domain is top‑level (e.g. company.com) suggest using a subdomain for cold outbound:  
  * Message: “For cold outreach, consider a subdomain like hello.company.com to protect your main domain reputation.”

CTA: Next: Verify DNS  
---

## Step 2 – Verify SPF / DKIM / DMARC

Goal: Ensure basic authentication is present.  
UI:

* Show required DNS records:  
  * Example SPF record snippet.  
  * DKIM selector names & public keys.  
  * Recommended DMARC policy (p=none for first weeks).  
* Button: “Check records”.

Backend:

* Run DNS lookups for TXT records (SPF, DKIM, DMARC) and summarise.

Validation rules:

* SPF present and not clearly invalid.  
* At least one DKIM record for sending provider or for your own MTA.  
* DMARC present (or show “recommended” but non‑blocking).

Messages:

* Pass: “We detected valid SPF/DKIM/DKIM records for this domain.”  
* Warning (no DMARC): “No DMARC policy found. You can still send, but we recommend adding one to protect against spoofing.”  
* Error (no SPF or DKIM): block progression:  
  * “We couldn’t find a valid SPF/DKIM record. Add the suggested record to your DNS and try again.”

CTA: Next: Domain Audit (or Save & Exit if you want to allow later audit).  
---

## Step 3 – Domain Audit (External Tools)

Goal: Pull a deliverability score and blacklist info.  
UI:

* Button: “Run audit” – triggers:  
  * Send a test email to a dedicated audit address (for tools like mail‑tester / GlockApps).  
  * Or, generate instructions: “Send a test email from mailbox X to this address; then click ‘I’ve sent it’.”  
* Once report is available (polling job):  
  * Show score (0–10).  
  * Show blacklist highlights (e.g., SORBS, other lists).  
  * Link “View full report” (opens external tool).

Rules:

* If score ≥ 8.5 → Green: “Good to go.”  
* 7–8.4 → Yellow: “Proceed with caution, warm up more and trim lists.”  
* \<7 → Red: show recommendation to fix issues before bulk sending.

Blocking behaviour:

* For new orgs, you can block campaigns from domains with score \<7 unless owner overrides and acknowledges risk.

CTA: Finish: Add Mailboxes  
Error messages:

* “We couldn’t fetch a report yet. Wait a few minutes and click ‘Refresh’.”  
* “No test email received. Make sure you sent from the right mailbox.”

---

## Step 4 – Add Mailbox

Goal: Connect individual sending identities.  
Options:

* Connect via:  
  * Google Workspace (Gmail API).  
  * Microsoft 365 (Graph API).  
  * Generic SMTP/IMAP.  
  * Other ESP (e.g., Mailgun/SendGrid/SES).

Fields:

* Display name.  
* Email address.  
* Connection type.  
* OAuth or SMTP credentials (depending on type).  
* Daily and hourly sending caps.

Validations:

* Test connection (send test email to yourself and verify).  
* Caps must be within provider limits (e.g., \<400/day for new Gmail accounts; you can suggest safe defaults).

Messages:

* On success: “Mailbox connected and test email delivered.”  
* On failure: “We couldn’t send a test email. Check credentials or provider limits and try again.”

CTA: Next: Warm‑Up Plan  
---

## Step 5 – Warm‑Up Plan

Goal: Configure gradual warm‑up based on mailbox age.  
UI:

* Ask: “Mailbox age?”  
  * “Brand new (created this week)”  
  * “Active, but never used for cold outbound”  
  * “Existing outbound mailbox (used regularly)”  
* Show suggested schedule (editable):  
  Example JSON you’ll store:  
  * Week 1: 10–20/day  
  * Week 2: 20–40/day  
  * Week 3: 40–80/day  
  * Week 4: 80–100/day  
* Toggle: “Run warm‑up continuously (even during campaigns).”

Validations:

* At least 14 days for brand new domain (hard warning).  
* Total daily warm‑up mails must not exceed provider cap minus reserved space for campaigns.

Messages:

* “Recommended: minimum 14 days of warm‑up at low volume for new domains.”  
* “We’ll send warm‑up emails only during business hours to mimic human behaviour.”

CTA: Start Warm‑Up  
---

## B. List Import & Validation Wizard

## Step 1 – Choose Import Source

Goal: Decide how contacts will be added.  
Options:

* Upload CSV.  
* Paste from spreadsheet.  
* Import from existing integration (e.g., HubSpot, Pipedrive).  
* Use Intelligence search results (from ICP).

Validation:

* One option must be selected.  
* If integration chosen but connector not configured → show link to “Connect tool first”.

Errors:

* “No source selected. Choose at least one way to import contacts.”  
* For integrations: “We couldn’t connect to \[tool\]. Check credentials in Integrations.”

CTA: Next: Map Fields  
---

## Step 2 – Map Fields

Goal: Map columns to contact/company fields.  
UI:

* Show preview of first 10 rows.  
* For each column, dropdown to map to:  
  * first\_name, last\_name, email, company\_name, job\_title, country, etc.  
* Option “Ignore column”.

Validations:

* At least email OR company\_name \+ domain must be present.  
* Warn if names missing (less personalization, but allowed).

Messages:

* “We strongly recommend mapping name fields to personalise outreach.”  
* “Contacts without email cannot be used in email campaigns. They will still be available for manual tasks.”

CTA: Next: Data Checks  
---

## Step 3 – Data Checks & Normalisation

Goal: Clean obvious issues before validation.  
Automatic checks:

* Remove duplicates (by email and by email+company).  
* Flag obviously invalid emails (no “@”, malformed).  
* Clean whitespace, lowercasing emails.  
* Replace special characters in names (per manual’s letter replacement logic).

UI:

* Summary:  
  * X total rows.  
  * Y duplicates removed.  
  * Z obvious invalid emails removed.

Validation:

* If \>30% obvious invalid → show big warning:  
  * “Your file contains a lot of invalid emails. Consider cleaning it before sending campaigns.”

CTA: Next: Email Validation  
---

## Step 4 – Email Validation Pipeline

Goal: Run external validation.  
UI:

* Pick validation profile:  
  * “Standard” (one provider, e.g., ZeroBounce).  
  * “Deep” (two‑step: TheChecker → Bouncer, etc.).  
* Show provider usage & credits (if tracked).

Backend:

* Create validation\_job with provider chain.  
* Run asynchronously via worker.

User actions:

* If job finished quickly, show results inline.  
* If longer, show “We’re validating your list in the background. You’ll get an email when it’s done.”

Output:

* Pie chart: % valid, invalid, catch‑all, disposable, unknown.  
* Default rule: only valid included in “ready for campaigns”.

CTA:

* Finish import (creates contacts and optionally a Segment).  
* Or Adjust rules (include some catch‑alls with warnings).

Warnings:

* “Including catch‑all emails can increase your bounce rate. We recommend using them in smaller, test batches.”

---

## C. Intelligence “New Company Deep Dive” Flow

## Step 1 – Input & Target

Goal: Define target company for analysis.  
Fields:

* Company website (URL) – required.  
* Company name (optional).  
* Region/market (dropdown).  
* ICP profile to compare against (optional).

Validation:

* URL format and reachable (basic HEAD/GET check).  
* If unreachable → show: “We couldn’t fetch this site automatically. You can still add the company and enrich manually.”

CTA: Next: Crawl & Enrich  
---

## Step 2 – Website Crawl

Goal: Fetch content and basic metadata.  
UI:

* Show progress indicator: “Fetching home page… scanning key pages…”  
* Allow user to click “Stop” if stuck.

Backend:

* Crawl limited set of pages (home, about, pricing, /product, /solutions).  
* Extract title, description, headings, meta tags, pricing info, tech stack hints.

Validations:

* If robots.txt disallows crawling → stop and show message:  
  * “We respect this site’s robots.txt and will not crawl it. You can manually upload notes or PDFs instead.”

CTA: Next: AI Analysis  
---

## Step 3 – AI Analysis & Scoring

Goal: Generate insights & score.  
UI:

* Summary cards:  
  * Key products/services.  
  * Target customers.  
  * Tech stack.  
* Score: 0–100 fit to selected ICP, with breakdown:  
  * Fit to industry, size, geography, tech, hiring signals.

Backend:

* Use your AI abstraction to call an LLM (or stub provider) with the crawled text and context.

Validations:

* Ensure company record exists and is linked to this deep dive.

CTA: Save Insight (creates AI‑written company note \+ recommended messaging angles).  
Messages:

* “Analysis generated. You can use these insights to customise your outreach templates.”

---

## D. Automation Workflow Creation Wizard

## Step 1 – Template or Blank

Goal: Choose starting point.  
Options:

* Start from template:  
  * “Lead enrichment pipeline.”  
  * “Cold outbound starter (add to campaign).”  
  * “Warm‑up orchestration.”  
* Start from blank workflow.

CTA: Next: Configure Trigger  
---

## Step 2 – Trigger Definition

Goal: Define when the workflow runs.  
Options:

* Time‑based (schedule): e.g. every night at 02:00.  
* Event‑based:  
  * New contact created.  
  * New deal created.  
  * Campaign step completed.  
* Manual trigger.

Fields:

* For schedule: CRON or simple picker.  
* For event: event type, filters (e.g. only ICP X).

Validations:

* At least one trigger defined.  
* No conflicting schedules.

Messages:

* “You can always disable the workflow later; start with manual trigger if you’re unsure.”

CTA: Next: Build Flow  
---

## Step 3 – Build Flow (Canvas)

Goal: Configure nodes on React Flow canvas.  
UI:

* Node library with:  
  * Action nodes: Enrich Lead, Add to Segment, Send Email, Create Task, Notify Slack, HTTP Request, Start Campaign, Update Deal.  
  * Logic nodes: Condition, Delay.  
* Users drag and connect nodes.

Validations:

* All nodes must be reachable from a trigger (no orphan chains).  
* Each edge must connect valid ports.  
* All required configs set (e.g. HTTP URL, email template, etc.).

Errors:

* At runtime: show red icon on node with error, plus message (e.g. “Missing target segment”).

CTA: Next: Safety & Limits  
---

## Step 4 – Safety & Limits

Goal: Prevent infinite loops and overload.  
Fields:

* Max executions per day (per workflow).  
* Max executions per contact per day/week.  
* Retry policy (max retries, back‑off).

Validations:

* Reasonable caps (defaults given).  
* Check for cycles (graph analyzer) and warn if potential loops.

Messages:

* “We detected a potential loop in your workflow. Make sure you’re not re‑triggering on your own actions indefinitely.”

CTA: Save & Activate or Save as Draft  
---

## E. GDPR & Data Subject Tools

## Flow – “Export Contact Data”

Step 1: Search contact (by email/name).  
Validation:

* Must choose exactly one contact.

Step 2: Show summary & confirm.

* Display what will be included: profile fields, activities, campaign events, notes.

Checkbox:

* “I confirm this export is in response to a legitimate data request.”

CTA: Generate Export – generates JSON/CSV and provides download link, logs in gdpr\_requests.  
---

## Flow – “Delete/Anonymise Contact”

Step 1: Search contact.  
Step 2: Choose action:

* Soft delete (anonymise personal data, keep aggregated stats).  
* Hard delete (remove all events; irreversible).

Warning:

* “Deleting this contact cannot be undone and may affect analytics.”

Checkbox:

* “I understand and confirm this deletion.”

CTA: Delete Contact  
---

## F. Meetings & Calendar Setup

## Step 1 – Connect Calendar

Options:

* Google Calendar via OAuth.  
* Microsoft 365 via Graph API.

Validation:

* OAuth success and at least one calendar available.

Messages:

* “We only request read/write access to your calendars for booking purposes.”

## Step 2 – Availability & Slot Rules

Fields:

* Work hours per weekday.  
* Meeting duration options (15/30/45/60 minutes).  
* Buffer times before/after meetings.

Validation:

* No overlapping rules, at least one slot defined.

CTA: Publish Booking Link  
