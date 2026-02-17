# New Campaign Wizard Specification

> [!NOTE]
> **Status: IMPLEMENTED**
> The physical implementation can be found in `CampaignWizard.tsx`. This document serves as the UI/UX specification.

Design this as a 6-step wizard inside the Engagement module. Each step validates and controls progression.


## Step 1 – Objective & ICP

Goal: Define the purpose and who you’re targeting.  
Fields:

* Objective (radio):  
  * “Book meetings”  
  * “Generate replies/interest”  
  * “Nurture existing leads”  
* Campaign name (text).  
* Select ICP profile (dropdown from icp\_profiles) or “Create new”.  
* If creating new:  
  * Industry, company size, locations, job titles, seniority levels.  
  * Excluded personas/industries.  
  * Regions (EU/US/Other) → sets gdprRegion.

Validations:

* Name required, objective required, one ICP selected or created.  
* If geo includes EU, show inline notice:  
  “Contacts in the EU are subject to GDPR and stricter outreach rules. Make sure you have a valid legal basis.”

Error messages:

* “Please choose a campaign objective.”  
* “Name is required.”  
* “Define at least one ICP profile or select an existing one.”

CTA: Next: Audience & Data  
---

## Step 2 – Audience & Data Quality

Goal: Choose who will receive emails and ensure list is clean.  
Options:

* Choose existing Segment(s).  
* OR select contacts via filters.  
* OR import CSV (launches import modal).

UI elements:

* Summary panel: “X contacts selected, Y companies.”  
* Button: “Run Email Validation” (creates validation\_job if not already valid recently).  
* List health panel:  
  * % valid, invalid, catch‑all, disposable, unknown.  
  * Bounce risk estimate.

Validations:

* At least one contact must be selected.  
* If \>10% invalid or \>20% unknown:  
  * Display warning banner:  
    * “Your list quality looks risky. We strongly recommend cleaning invalid/unknown addresses to protect your domain reputation.”  
* If invalid emails present:  
  * Default behaviour: they are excluded; show message.

Blocking rule (optional configuration):

* If bounce risk ‘high’, block Next unless user explicitly confirms:  
  * Checkbox: “I understand the risk and accept possible deliverability issues.”

Error messages:

* “No contacts selected. Please choose a segment, apply filters, or import a CSV.”  
* “Validation in progress. Please wait until your list is validated to continue.”

CTA: Next: Sending Setup  
---

## Step 3 – Sending Infrastructure (Domain & Mailbox)

Goal: Pick from which domain/mailbox the campaign will send.  
UI:

* Domain selector with health indicator:  
  * Name, SPF/DKIM/DMARC status, last audit score (0–10), reputation status.  
* Mailbox selector:  
  * Email, provider, warm‑up status (not started / running / completed).  
  * Daily and hourly limits, and used quota for the current day.

Indicators:

* Badge colours:  
  * Green: score ≥ 8.5 and warm‑up completed.  
  * Yellow: score 7–8.4 or warm‑up in progress.  
  * Red: score \< 7 or warm‑up not started.

Validations & rules:

* Must select one or more mailboxes.  
* If selected domain has:  
  * No SPF/DKIM/DMARC → block progression.  
  * Score \< 8.5 OR warm‑up incomplete:  
    * Show blocking modal:  
      * “Your domain/mailbox is not ready yet.”  
      * Provide reasons (e.g. “Warm‑up started 3 days ago. We recommend at least 14 days before cold outreach.”).  
      * Offer actions: “Adjust warm‑up plan”, “Run domain audit”, “Switch to a healthier mailbox.”  
    * Allow override only if user has Admin/Owner role and checks:  
      * “I understand that sending with this configuration may damage my domain reputation.”

Error messages:

* “Please select a domain with valid SPF, DKIM and DMARC.”  
* “The chosen mailbox exceeds daily sending limit when combined with current campaigns. Reduce audience size or choose another mailbox.”

CTA: Next: Sequence & Content  
---

## Step 4 – Sequence & Content

Goal: Define the sequence steps and write emails.  
UI:

* Timeline or list of steps:  
  * Step 1: Email (required).  
  * Additional steps: Email, Wait, Condition.  
* For each Email step:  
  * Subject, body editor (rich text \+ variables).  
  * Language selection.  
  * Preview panel with sample contact.  
  * Spam‑check score:  
    * Basic rule‑based detector using spam‑word list; show warnings:  
      * “We detected X potential spam trigger words: \[list\]. Consider adjusting your copy.”  
* For Wait step:  
  * Wait type: “X days/hours after previous step”, “Specific date/time”.  
* For Condition step:  
  * Conditions on events: opened/not opened, replied/not replied, in/out of segment.

Validations:

* At least one email step.  
* Subject not empty, body above minimal length.  
* Sequence must not exceed max length (e.g. 8 steps) for initial MVP.  
* If spam‑word risk high:  
  * Non‑blocking but with clear warning and recommended actions.

Error messages:

* “Email subject is required.”  
* “Email body is too short. Add at least a few sentences of value.”  
* “Sequence contains a condition referencing a missing step. Please fix the logic.”

CTA: Next: Compliance & Safety  
---

## Step 5 – Compliance & Safety

Goal: Make legal and reputation‑related choices explicit.  
UI:

* Summary of:  
  * ICP geography (e.g. “60% EU, 40% US”).  
  * Legal basis selector per campaign (for logging): legitimate interest, consent, contract, other.  
* GDPR info text (for EU contacts):  
  * Short explanation, plus note that user is controller, Ori‑OS is processor.  
* Opt‑out configuration:  
  * Unsubscribe link required (default on).  
  * Frequency cap (e.g. max X emails per contact per month).  
* Reminder:  
  * “We will automatically respect existing opt‑out and suppression lists.”

Checkboxes (must be checked to continue):

* “I confirm I have a valid legal basis to contact the selected recipients.”  
* “I understand that Ori‑OS provides infrastructure; I am responsible for how I use contact data.”

Validations:

* Legal basis must be selected.  
* Required checkboxes ticked.

Error messages:

* “Please select a legal basis for this campaign.”  
* “You must confirm your responsibilities before launching the campaign.”

CTA: Next: Review & Launch  
---

## Step 6 – Review & Pre‑Flight Check

Goal: Run automated checks and confirm launch.  
UI:

* Read‑only summary:  
  * Objective, ICP, audience size.  
  * Domain \+ mailbox health.  
  * Sequence overview (steps, wait times).  
  * Send schedule.  
* Button: “Run Pre‑Flight Check”.

Pre‑flight system runs and returns a checklist:

1. Domain Health  
   * Green: “Domain example.com has SPF, DKIM, DMARC configured and last audit score 9.1/10.”  
   * Yellow/Red with reasons and suggestions.  
2. List Quality  
   * e.g. “Valid 92%, Invalid 3%, Catch‑all 5%. Bounce risk: Low.”  
3. Sending Limits  
   * e.g. “This campaign will send at most 300 emails/day across 2 mailboxes. You are within your defined limits.”  
4. Spam Risk  
   * e.g. “We found 3 potential spam trigger words in your subjects. Consider revising ‘free’ and ‘guaranteed’.”  
5. GDPR & Opt‑Out  
   * Confirm unsubscribe link and suppression list usage.

Rules:

* If any critical item fails (missing DNS records, extremely poor domain score, unvalidated list with high risk, or sending volume far above provider limits), block launch and show a clear “Fix before launch” message.  
* Otherwise, allow “Launch campaign”.

Error messages:

* “Pre‑flight check failed: \[list of critical items\]. Fix them and run the check again.”  
* “We detected unsafe sending volume for the current domain and provider. Reduce daily sends or add more mailboxes.”

CTA: Launch Campaign or Schedule for later.  
---

This gives you:

1. A refined Antigravity prompt aligned with your new requirements.  
2. A concrete schema you can map into Prisma.  
3. A detailed, validation‑rich “New Campaign” wizard you can start implementing in your Next.js app.

