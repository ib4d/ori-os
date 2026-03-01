# ORI‑OS 2.0 — Axion‑Style UI Upgrade (Front‑End Only)

You are a Senior Product Designer + Frontend Engineer.  
Your **only** job is to re‑skin the existing ORI‑OS 2.0 app (marketing + dashboard) so that its **visual language and layout structure** feel close to the `axion-agent` (https://www.aura.build/templates/axion-agent) template from Aura — without touching back‑end logic, data flow, routing, or copy.

Back‑end, API contracts, database, auth, business logic, and page text/CTAs **must not change**.  
This is a pure **UI layer** upgrade.

---

## 0. Hard Constraints — DO NOT VIOLATE

1. **No color changes**
   - Keep the current ORI‑OS color palette exactly as is (backgrounds, text colors, accent orange, etc.).
   - You may reuse existing palette tokens (variants/shades), but **do not introduce new brand colors**.

2. **No rounded corners**
   - All shapes (cards, buttons, modals, inputs, dropdowns, toasts, etc.) must be **perfectly squared**.
   - Border radius must be `0` or effectively invisible everywhere in marketing and dashboard.
   - If components/libs ship with default rounding, override them.

3. **Icons color**
   - All icons across **marketing + dashboard** use **one accent color: ORI orange**.
   - No multicolor icon sets; no rainbow arrays.
   - If multiple icons appear in the same row/section, they are all the same orange accent.

4. **Scope: UI only**
   - Do **not** alter:
     - Data models or Prisma schema.
     - API endpoints or business logic.
     - Auth flow, routing structure, or deployment config.
     - Text, CTAs, headings, labels, or app copy.
   - You may reorder existing content visually to match the Axion layout, but **not change wording**.

5. **Performance**
   - Animations must be light and performant.
   - Avoid heavy video; use gradients, SVGs, and simple transforms.

6. **Do not re-use**
   - Text copy and message from Axion website (maintain the copy across all ORI-OS app).
   - If any element not suitting ORI-OS from Axion, will be ignored.

---

## 1. Axion‑Style Structure to Apply

Use the `axion-agent` site and screenshots as your structural reference. We want Ori‑OS to feel similar in composition while keeping its own copy/colors.

### 1.1 Global Layout (Marketing)

For all marketing pages (home, features, pricing, product pages, docs, etc.):

- **Top nav bar**
  - Full‑width dark bar at top, fixed when scrolling.
  - Left: ORI‑OS logo.
  - Center: main nav (PRODUCT, COMPANY, RESOURCES, PRICING).
  - Right: “Sign in” (ghost) + primary CTA (e.g. “Get Started” / “Request demo”).

- **Vertical left section progress indicator**
  - On all long marketing pages, add a fixed **left vertical stepper** similar to Axion:
    - Labels: 01, 02, 03, 04, 05, 06 (or matching section count).
    - Active step highlighted according to scroll position.
    - Clicking a step scrolls smoothly to that section.
  - Implement with IntersectionObserver or scroll‑triggered logic; this is visual only and must not alter content.

- **Section layout**
  - Each page is composed of **full‑viewport or near‑full‑height sections**:
    - Hero.
    - Product pillars / features.
    - Pricing band.
    - Integrations/Logos band.
    - Security / Status strip.
    - Final CTA.
  - Align section paddings, grids, and spacing to Axion‑like proportions (big hero, dense lower grid).

- **Footer**
  - Wide, Axion‑like footer with squared columns:
    - PRODUCT
    - COMPANY
    - RESOURCES
    - LEGAL
  - Use the link lists you were given (no new links, no text changes).
  - Keep footer pinned visually to the bottom of the longest pages.

### 1.2 Dashboard Shell

For the in‑app dashboard:

- **Sidebar**
  - Keep existing structure and labels, but tighten to Axion style:
    - Dark vertical bar.
    - Orange accent left border for active item.
    - All icons orange.
    - No rounded corners anywhere.
  - Modules:
    - Command Center
    - New Campaign
    - Intelligence
    - Relationship Hub
    - Automation Studio
    - Engagement Suite
    - SEO Studio
    - Compliance
    - Knowledge Hub
    - Search
    - Settings

- **Top bar**
  - Minimal dark bar with:
    - Left: Page title / breadcrumb.
    - Center/right: search, filters, user avatar, status badges (if already present).

- **Content frames**
  - Each view (Command Center, CRM, etc.) should look like Axion’s panels:
    - Clean rectangular cards.
    - Strong vertical rhythm.
    - Data “panels” with clear separation via borders and typography, not soft shadows or radius.

---

## 2. Interactions & Motion

### 2.1 Smooth scrolling & scroll triggers

- Marketing pages:
  - Enable **smooth scrolling** between sections when:
    - Clicking nav links that point to anchors.
    - Clicking items in the left vertical progress indicator.
  - Use scroll triggers to:
    - Update the active step in the left indicator.
    - Trigger subtle reveal animations for sections/cards.

### 2.2 Hover states (cards/icons/images/links)

Apply consistent, Axion‑like hover patterns:

- **Cards / panels**
  - `translateY(-2px)` and subtle shadow or border‑brightness increase.
  - No scaling; keep it crisp and squared.

- **Buttons**
  - Primary: slight brightness + subtle outline glow on hover.
  - Secondary/ghost: border and text color brighten, background stays dark.

- **Icons**
  - All icons are orange by default; on hover, use:
    - Slight luminance/opacity change.
    - Small `translateY(-1px)`.

- **Links**
  - Underline or subtle underline‑from‑center animation on hover.
  - Always maintain legibility against background.

### 2.3 H1 / heading animations

For **every H1** in marketing (hero and section headers):

- Animate on entering viewport:
  - Split H1 into 2 lines if necessary (Axion style: big top line + lighter second).
  - Use a fast, lightweight animation:
    - E.g., fade + slight upward motion, or letter/word stagger.
- Requirements:
  - Keep animation under ~300–500ms.
  - No heavy libraries if not already used; reuse existing animation stack or simple CSS/Framer Motion.
  - Animation should not block content from being visible quickly (no long intro).

---

## 3. Detailed UI Rules

### 3.1 Grids & Sections (Marketing)

Re‑compose the marketing sections to mirror Axion patterns:

- **Hero sections**
  - Large left‑aligned H1 (two‑line; second line can use lighter weight or slight transparency).
  - Short 1–2 line subtext.
  - Primary + secondary CTA row.
  - Right side: Could be current Ori‑OS product screenshot / telemetry panel style; wrap in a squared card with border.

- **Product/Features section**
  - 3–4 wide rectangular feature cards, side‑by‑side or grid.
  - Each card:
    - Small all‑caps label.
    - H3 title.
    - Short description.
    - “Read more →” link.

- **Pricing section**
  - Axion‑like pricing band:
    - 3 plans in squared cards.
    - Middle plan visually emphasized via border weight/opacity, not new colors.
    - Plan badges (LEVEL_01, LEVEL_02…) can be reused with Ori copy.

- **Infrastructure / Capabilities section**
  - Full‑width background gradient or image (use existing palette).
  - Four text columns below, similar to Axion’s “Data Ingestion / Core Processing / Security / Telemetry”.

### 3.2 Dashboard Cards & Telemetry

On the dashboard modules:

- Use Axion‑style “system panels”:
  - Header band with small label.
  - Main numeric in large mono or bold type.
  - Thin progress bar or indicator line where relevant.
- Align multiple cards to a **consistent grid** (no irregular different card sizes unless intentionally highlighted).
- Maintain high contrast between content and background; don’t change text.

---

## 4. Implementation Approach

You must:

1. **Preserve existing component tree and props** wherever possible.
   - Adjust Tailwind classes / CSS / layout wrappers.
   - Only refactor into smaller components when necessary for clarity; no breaking changes to props used by logic hooks.

2. **Centralize UI primitives**
   - Buttons, icons, cards, panels, and layout containers should be updated via shared components:
     - e.g. `Button`, `Card`, `MetricPanel`, `SectionWrapper`, `SidebarNavItem`.
   - This ensures consistent squared shapes and icon color across the entire app.

3. **Keep all text & CTAs identical**
   - Do not rename “Start Free Trial”, “Book a demo”, section names, or copy.
   - You may adjust where text appears within the layout (e.g., move a description below a heading) as long as text is unchanged.

4. **Respect existing theming**
   - Reuse current font stack and color tokens.
   - No new theme provider or overrides that break the app.

---

## 5. Acceptance Checklist

Consider the Axion‑style UI upgrade complete only when:

- All marketing pages (home, feature pages, pricing, product pages, docs, etc.) share:
  - Fixed top navbar.
  - Left vertical progress indicator per long page.
  - Axion‑like sectional layout (hero + content bands).
  - Shared footer with the provided link structure.
- All dashboard modules display:
  - Squared cards and panels, no rounding.
  - Orange icons everywhere; no mismatched icon colors.
  - Consistent hover states for cards, buttons, and icons.
- H1s on all marketing pages/sections animate into view with a fast, non‑blocking animation.
- Scrolling between sections is smooth, and the left progress indicator correctly highlights the current section.
- No backend code, API contracts, data models, or copy have been changed.

Execution directive:  
**Do not rebuild Ori‑OS logic. Only elevate its visual layer to an Axion‑style, squared, orange‑icon, smooth‑scroll experience that respects the existing brand palette and text.**
