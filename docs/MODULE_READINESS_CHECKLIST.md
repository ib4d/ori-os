# Module Readiness Checklist

This document tracks the current implementation status of each module within Ori-OS 2.0.

| Module | Status | Implemented | Missing / Placeholder | Next Actions | DB Tables |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Dashboard** | Working | Layout, Shell, Basic Widgets | Real Activity Feed | Connect real event stream | `AuditLog`, `DailyMetric` |
| **2. Intelligence** | Partial | Enrichment UI, Service Logic | Real provider integrations | Add Apollo/Clearbit keys | `EnrichmentJob`, `IcpProfile` |
| **3. Contacts** | Working | CRUD, Search, API Scoping | Bulk Import (CSV) | Implement CSV parser | `Contact` |
| **4. Companies** | Working | CRUD, Enrichment UI | Domain-based auto-create | Add auto-enrichment trigger | `Company` |
| **5. Deals** | Working | Pipeline UI, CRUD | Advanced Reporting | Add Win/Loss analytics | `Deal`, `Pipeline` |
| **6. Billing** | Partial | UI, API Stub routes | Stripe Integration | Implement Stripe Webhooks | `Subscription` |
| **7. Automation** | Partial | Workflow UI, Basic CRUD | Worker Execution | Connect BullMQ to logic | `Workflow`, `WorkflowRun` |
| **8. Engagement** | Partial | Campaign UI, Sequences | Real SMTP/SES sending | Verify mailbox SMTP config | `Campaign`, `Mailbox` |
| **9. Analytics** | Placeholder | Dashboard Mock Data | Real Event Tracking | Implement segment event tracking | `Event`, `DailyMetric` |
| **10. SEO Studio** | Working | Projects, Audits, Keywords | GSC OAuth Data | Implement GSC OAuth flow | `SEOProject`, `GSCQueryData` |
| **11. Content** | Placeholder | Content Calendar UI | Publishing Engine | Integrate with CMS/Social APIs | `ContentPost` (TBD) |
| **12. Settings** | Working | Navigation, Profile, Security | Integration Config | Add per-integration settings | `User`, `Organization` |
| **13. Help** | Missing | Sidebar Link | Docs Site Content | Write help articles | N/A |

## Key Abbreviations
- **Working**: Feature is functional end-to-end with persistent data.
- **Partial**: UI exists and some API functionality works, but core logic might be mocked or incomplete.
- **Placeholder**: UI exists but uses purely static/mocked data.
- **Missing**: Route or page is not yet implemented.
