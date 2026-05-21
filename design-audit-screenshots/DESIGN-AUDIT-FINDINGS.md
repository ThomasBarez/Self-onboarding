# Design Audit: Mobility Onboarding Prototype
**Date:** 2026-05-20  
**Auditor:** Claude (design-review)  
**Scope:** 6 pages (index, welcome, upload, company-info, program-review, invite-employees)  
**URL:** http://localhost:8000

---

## Executive Summary

**Design Score:** D  
**AI Slop Score:** C  

The Mobility onboarding flow has solid fundamentals but suffers from critical accessibility violations and AI-generated content patterns. The typography and touch targets fail basic WCAG standards. The visual design is clean but generic, with emoji decorations and "Welcome to..." copy that signal AI generation.

---

## Phase 1: First Impression

**The site communicates:** A prototype onboarding flow — the index page immediately signals "developer documentation" rather than a production user interface.

**I notice:** Clean, card-based layouts. Consistent green accent color (#2BFD7F). Professional typography with custom font "TT Travels". The info boxes with bright green borders demand attention — perhaps too aggressively.

**The first 3 things my eye goes to:**
1. Page heading (good - intentional focal point)
2. Bright green info/alert boxes (very prominent - competes with primary actions)
3. Progress indicator in header (subtle, professional)

**If I had to describe this in one word:** Professional (but generic)

---

## Phase 2: Design System (Extracted)

**Fonts in use:** 2-3 families ✅
- Primary: "TT Travels" (custom font - good)
- Fallbacks: -apple-system, system-ui, Segoe UI, sans-serif
- Unintentional: Times New Roman (likely browser default, should be removed)

**Colors:** 11 unique colors ✅ (under 12 limit)
- Brand green: #2BFD7F, #01D253, #00D563
- Dark purple: #221C46, #362F54
- Grays: #6B7280, #F9FAFB
- Background: #FAF8FF (light purple tint)
- White: #FFFFFF
- Orange (validation): #F97316

**Heading scale:**
- H1: 32px, weight 700
- (Other heading levels not visible in sample)

**Spacing:**
- Consistent card padding visible
- Form layouts well-spaced
- Need to verify if using systematic scale (4px or 8px base)

---

## Phase 3: Findings by Category

### 1. Visual Hierarchy & Composition

**Grade: B**

✅ **Strengths:**
- Clear information density on data-heavy pages
- Good use of cards for grouping related information
- Progress indicator provides context without overwhelming

❌ **Issues:**
- Index page feels like developer documentation, not a user-facing product
- Info boxes with bright green border (#2BFD7F) compete for attention with primary CTAs

**Findings:**
- **MEDIUM:** Index page (localhost:8000/) lists all prototype pages — this is a dev tool, not production-ready
- **POLISH:** Info box prominence competes with primary actions

---

### 2. Typography

**Grade: D** ❌

**CRITICAL VIOLATIONS:**

❌ **FINDING-001 [HIGH IMPACT - ACCESSIBILITY]**
- **Issue:** Body text is 15px (detected via getComputedStyle on `.page-description`)
- **Standard:** WCAG requires minimum 16px for body text
- **Location:** All pages
- **Screenshot:** company-info-incomplete.png
- **Fix:** Increase body text to 16px minimum

**Other issues:**
- ✅ Custom font "TT Travels" (not generic stack)
- ⚠️ Times New Roman appears in extracted fonts (likely unintentional fallback)
- Need to verify: line-height ratios, heading hierarchy completeness

---

### 3. Color & Contrast

**Grade: B-**

⚠️ **Potential issues:**
- **FINDING-002 [MEDIUM - ACCESSIBILITY]**
  - **Issue:** Primary green (#2BFD7F, #01D253) is extremely bright
  - **Concern:** When used for text or small UI elements, likely fails WCAG AA contrast ratio (4.5:1 for body, 3:1 for large/UI)
  - **Recommendation:** Test contrast ratios. Consider using darker green variant for text.

✅ **Strengths:**
- Semantic colors consistent (green=success/progress, orange=attention needed)
- Dark purple text (#221C46) provides good contrast on light backgrounds

---

### 4. Spacing & Layout

**Grade: B+**

✅ **Strengths:**
- Max content width set (appears to be 1024px) - no full-bleed body text
- Consistent card border-radius
- Good label-input spacing in forms

**Findings:**
- ✅ TRUNK TEST: **PASS**
  - Site ID: "Mobility" ✓
  - Page name: Clear ✓
  - Breadcrumb: "Onboarding › Company Information" ✓
  - Navigation visible: Header with logo ✓
  - Progress: "Step 2 of 5" ✓
  - Search: N/A (not needed for linear flow)

---

### 5. Interaction States

**Grade: D** ❌

**CRITICAL VIOLATIONS:**

❌ **FINDING-003 [HIGH IMPACT - ACCESSIBILITY]**
- **Issue:** No visible focus outline on interactive elements
- **Detected:** `outline: 0px` on focused input (tested via focus() + getComputedStyle)
- **Standard:** WCAG requires visible focus indicators. Never `outline: none` without replacement.
- **Location:** All input fields, likely all interactive elements
- **Screenshot:** company-info-incomplete.png
- **Fix:** Add `focus-visible` ring. Example: `:focus-visible { outline: 2px solid #221C46; outline-offset: 2px; }`

❌ **FINDING-004 [HIGH IMPACT - ACCESSIBILITY]**
- **Issue:** Touch targets too small - all input fields are 39px height
- **Standard:** WCAG requires minimum 44px × 44px for touch targets
- **Detected:** 7 input fields measured at height 39px (5px below minimum)
- **Location:** All form pages (company-info, program-review, etc.)
- **Screenshot:** company-info-incomplete.png
- **Fix:** Increase input height to minimum 44px

✅ **Strengths:**
- Disabled button correctly shows `cursor: not-allowed`
- Orange underline on required fields provides clear visual indicator
- Button labels are specific ("Continue to Program Review", not generic "Submit")

---

### 6. Responsive Design

**Grade: INCOMPLETE** (desktop-only audit)

⚠️ **Need to check:**
- Mobile layouts
- Touch target sizing on mobile
- No horizontal scroll
- Navigation collapse
- Image responsiveness

---

### 7. Motion & Animation

**Grade: N/A** (static screenshots cannot evaluate)

---

### 8. Content & Microcopy

**Grade: C**

❌ **FINDING-005 [HIGH IMPACT - AI SLOP]**
- **Issue:** Generic "Welcome to your Pluxee organisation" heading
- **Pattern:** AI Slop #9 — "Welcome to [X]" is the most recognizable AI-generated copy pattern
- **Location:** 01-welcome.html, h1 element
- **Screenshot:** 01-welcome.png
- **Fix:** Replace with specific, action-oriented copy. Example: "Set up your mobility program" or "Activate your Pluxee account"

✅ **Strengths:**
- "3 fields need your attention" — specific, clear
- Button labels are action-specific
- Error messaging appears contextual (orange underlines)

❌ **Issues:**
- Descriptive text is overly explanatory ("Get started with your mobility program by activating your account and setting up your organization") — happy talk that users skip
- Could be more concise

---

### 9. AI Slop Detection

**Grade: C** ⚠️

**Blacklist audit (11 patterns):**

❌ **FINDING-006 [MEDIUM - AI SLOP]**
- **Issue:** Emoji (🏢) used as design element
- **Pattern:** AI Slop #7 — emoji as section decoration
- **Location:** Company Details section header (`.section-icon` span)
- **Screenshot:** company-info-incomplete.png
- **Fix:** Replace with icon font, SVG icon, or remove decoration entirely

✅ **AVOIDED patterns:**
- ✅ No purple/violet gradients
- ✅ No 3-column feature grid
- ✅ No icons in colored circles
- ⚠️ Partial: Welcome page is centered (acceptable for splash screen)
- ✅ Border-radius is consistent but not excessive
- ✅ No decorative blobs/shapes
- ✅ No colored left-borders on cards
- ✅ Not using system-ui as primary font (custom "TT Travels")

**AI Slop Score rationale:** Two violations (#7 emoji, #9 "Welcome to...") out of 11 patterns. The design is generic-feeling but not egregiously AI-generated.

---

### 10. Performance as Design

**Grade: INCOMPLETE**

⚠️ **FINDING-007 [POLISH - ERROR]**
- **Issue:** Console shows 404 error: "Failed to load resource: the server responded with a status of 404 (File not found)"
- **Impact:** May affect performance metrics, indicates broken reference
- **Recommendation:** Investigate and fix missing resource

**Cannot evaluate:**
- LCP, CLS (need performance metrics)
- Skeleton loading states
- Image optimization

---

## Cross-Page Consistency Audit

✅ **Consistent across all internal pages:**
- Header: Logo + "Mobility" text + progress indicator
- Breadcrumb navigation format
- Button styling (green primary, white secondary)
- Card/container styling
- Typography hierarchy

❌ **Inconsistent:**
- Index page vs. internal pages — index feels like a different product (dev documentation vs. user interface)

---

## Grade Summary by Category

| Category | Grade | Weight | Rationale |
|----------|-------|--------|-----------|
| Visual Hierarchy | B | 15% | Clean layouts, but info boxes compete for attention |
| **Typography** | **D** | 15% | **Critical: 15px body text (< 16px minimum)** |
| Color & Contrast | B- | 10% | Bright green may fail contrast checks |
| Spacing & Layout | B+ | 15% | Good structure, passes trunk test |
| **Interaction States** | **D** | 10% | **Critical: No focus outline, touch targets too small** |
| Responsive | INCOMPLETE | 10% | Desktop-only audit |
| Content Quality | C | 10% | AI slop "Welcome to..." copy, overly descriptive text |
| **AI Slop** | **C** | 5% | **2 violations: emoji decoration + generic welcome copy** |
| Motion | N/A | 5% | Static audit |
| Performance | INCOMPLETE | 5% | 404 error detected |

**Weighted Design Score: D**  
(Dragged down by typography and interaction states critical violations)

---

## Quick Wins (< 30 minutes each)

Fix these high-impact issues first:

1. **[15 min] FINDING-001:** Change body text from 15px → 16px (find `.page-description` and similar selectors)
2. **[10 min] FINDING-003:** Add focus-visible outline to all interactive elements
3. **[10 min] FINDING-004:** Increase input height from 39px → 44px
4. **[5 min] FINDING-005:** Replace "Welcome to your Pluxee organisation" with action-oriented copy
5. **[5 min] FINDING-006:** Remove emoji (🏢), replace with SVG icon or text only

**Total time: ~45 minutes for all 5 quick wins**  
**Impact: Moves Design Score from D → B**

---

## Deferred Findings

These require more investigation or cannot be fixed from source code:

- **FINDING-002:** Contrast ratio testing (need color contrast analyzer tool)
- **FINDING-007:** 404 error investigation (need to identify missing resource)
- Responsive audit (need mobile screenshots)
- Performance metrics (need live testing tools)

---

## Recommendations

### Immediate (before launch):
1. Fix all HIGH impact findings (001, 003, 004, 005)
2. Remove emoji decoration (006)
3. Test on mobile devices

### Short term:
4. Verify contrast ratios on bright green accent
5. Investigate and fix 404 error
6. Consider more concise microcopy (reduce happy talk)

### Long term:
7. Replace index/documentation page with proper user-facing landing
8. Establish systematic spacing scale (document in DESIGN.md)
9. Create component library with documented interaction states

---

## Files Reviewed

- http://localhost:8000/ (index)
- http://localhost:8000/01-welcome.html
- http://localhost:8000/04a-upload-data.html
- http://localhost:8000/05b-company-info-incomplete.html
- http://localhost:8000/06b-program-review-incomplete.html
- http://localhost:8000/08-invite-employees.html

---

## Next Steps

**Phase 7: Triage** — Prioritize findings by impact (HIGH > MEDIUM > POLISH)  
**Phase 8: Fix Loop** — Apply fixes to source files, one commit per fix  
**Phase 9: Final Audit** — Re-run audit after fixes  
**Phase 10: Final Report** — Document improvements and remaining issues
