# Skipr Onboarding Prototype V2

**User Journey Optimized** • Based on José, Michelle & Max personas

## Overview

This V2 prototype incorporates learnings from the FigJam user journey analysis, specifically designed to address pain points and optimize for the emotional arc: 😐 → 😐 → 😄 → 😄 → 😄

## Key Improvements from V1

### 1. **Power User Shortcuts** (Max Persona)
- **Login page**: Added "Skip to platform" option for users who have already completed onboarding
- **Welcome page**: Persistent "Skip to platform" link in header
- **Company review**: "Skip program review and finish" option for users in a hurry
- **Why**: Power users (like Max) want to move quickly and skip unnecessary steps

### 2. **AI Extraction Transparency** (All Personas, especially José)
- **Upload page**: Real-time progress visualization showing:
  - What documents are being analyzed
  - Which extraction step is currently running (Reading → Company info → Program details → Finalizing)
  - Progress bar with percentage
  - Estimated time remaining
  - Clear status indicators (Processing → Complete)
- **Why**: Users want to know what's happening and build trust in the AI extraction process

### 3. **Card-Based Review Layout** (José Persona)
- **Company review**: Information organized into digestible cards:
  - Basic Information card
  - Contact Details card
  - Organization card
- Each card has focused content, not overwhelming tables
- **Why**: The table format was overwhelming for users like José who are uncertain about the process

### 4. **Inline Editing Helpers** (José Persona)
- **Tooltips**: Added contextual help icons (?) next to fields that might be confusing
  - Parent entity: "The parent company if this entity is part of a larger corporate structure..."
  - VAT number: "Your company's Value Added Tax identification number..."
  - Invoice email: "The email address where you want to receive invoices..."
  - Number of employees: "The total number of employees currently working at your company..."
- **Inline editing**: Click directly on values to edit, no separate edit mode
- **Visual feedback**: Fields highlight on hover and focus
- **Why**: Reduces uncertainty and helps users understand what information is needed

### 5. **Celebratory Completion** (All Personas)
- **Completion screen** with:
  - Animated checkmark and confetti emoji
  - Success summary (Company verified, Monthly budget, Employees ready)
  - Clear next steps (numbered 1-2-3)
  - Primary CTA: "Access Your Workspace"
  - Help resources (Documentation, Live Chat, Email Support)
- **Why**: Creates a positive ending and reinforces achievement, aligns with the desired 😄 emotional state

### 6. **Welcoming Copy** (Michelle Persona)
- **Welcome page**: "Hey Thomas, let's get you set up!" with warm, friendly tone
- **Company review**: "Looking good! Review your company details"
- **"Wow" banner**: "Most of your info is ready! We found 85% of your company details automatically"
- **Why**: Builds trust and creates a positive emotional response at the touch-down moment

### 7. **Progress Transparency**
- **Header progress bar**: Shows "Step X of 3" with visual progress (33%, 66%, 100%)
- **Consistent across all pages**
- **Save & Exit**: Always available for users who need to pause
- **Why**: Users want to know where they are in the process and how much is left

## File Structure

```
prototype-v2/
├── index.html              # Navigation hub with all prototype links
├── 01-login.html           # Login with power user skip option
├── 02-welcome.html         # Welcoming intro with step overview
├── 03-upload-data.html     # Enhanced AI extraction with progress
├── 04-company-review.html  # Card-based review with tooltips
├── 05-program-review.html  # Simplified program review
├── 06-completion.html      # Celebratory finish screen
└── README.md              # This file
```

## User Journey Personas

### José (Worst Case)
- **Profile**: Less tech-savvy, uncertain, frustrated by complexity
- **Pain points**: Overwhelming information, unclear AI process, no inline help
- **V2 solutions**: Tooltips, card-based layout, AI transparency, digestible chunks

### Michelle (Happy Path)
- **Profile**: Confident, appreciates good UX, wants efficiency
- **Pain points**: Minor friction in upload stage
- **V2 solutions**: Welcoming copy, smooth transitions, celebration at end

### Max (Power User)
- **Profile**: Experienced, wants speed, annoyed by hand-holding
- **Pain points**: Can't skip unnecessary steps
- **V2 solutions**: Skip to platform option, skip program review, fast navigation

## Emotional Arc Design

| Stage | Target Emotion | V2 Implementation |
|-------|---------------|-------------------|
| Access | 😐 Neutral | Clean login, skip option available |
| Touch down | 😐 → 😄 Wow! | Welcoming copy, "Most info is ready!" banner |
| Upload | 😄 Satisfied | Transparent AI extraction, clear progress |
| Review | 😄 Confident | Digestible cards, inline helpers, no overwhelm |
| Done | 😄 Delighted | Celebration, clear next steps, platform access |

## Design Principles Applied

1. **Show, don't tell**: AI extraction progress is visible, not a black box
2. **Trust through transparency**: Show what was extracted, let users verify
3. **Smart defaults**: Pre-fill everything possible, users only fill gaps
4. **Celebrate completion**: Positive reinforcement creates better experience
5. **Flexible paths**: Power users can skip, cautious users get helpers

## Next Steps

To test this prototype:
1. Open `index.html` in a browser
2. Follow the journey from login → completion
3. Try both power user shortcuts and the full flow
4. Pay attention to the emotional progression

## Changelog from V1

- ✅ Added power user skip functionality
- ✅ Enhanced AI extraction with real-time progress
- ✅ Replaced table layout with card-based design
- ✅ Added inline editing with contextual tooltips
- ✅ Created celebratory completion screen
- ✅ Improved copy to be more welcoming and casual
- ✅ Added progress indicators throughout
- ✅ Implemented 3-step flow (simplified from 5)
