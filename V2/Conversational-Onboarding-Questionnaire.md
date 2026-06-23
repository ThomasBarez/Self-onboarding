# Pluxee Mobility - Conversational Onboarding Questionnaire

## Welcome & Introduction

**Welcome to Pluxee Mobility!** 👋

Great to have you here, Thomas! I can help you get more done by guiding you through your onboarding process. Let's start by asking you a couple of questions to understand where you stand.

---

## Section 1: Document Upload (ONE TIME)

### Q1: Document Readiness
**Question:** "Did you already have your documents ready?"

**Options:**
- ✅ Yes, upload them now
- 📋 No, I'll fill everything manually
- 💡 I'm not sure what I need

---

### Q1a: If "Yes, upload them now"

**Message:** "Perfect! Upload your documents and I'll extract everything automatically — company info, budget groups, services, compliance rules, the works. You'll just need to review and confirm at the end."

**Upload Area:**
```
📤 Drag & drop your files here

Supported documents:
✓ Statement of Work (SOW) - PDF
✓ TCO Calculator - Excel/CSV
✓ Company info spreadsheet - Excel/CSV
```

**[User uploads documents]**

**AI Processing (30 seconds):**
```
🤖 Reading documents...
📊 Extracting company information...
💰 Analyzing TCO & budget configuration...
📋 Generating compliance rules...
✨ All done! Let's review what I found.
```

**→ Skip to Section 2 (Full Review)**

---

### Q1b: If "No, I'll fill everything manually"

**Message:** "No problem! I'll guide you through each step. Would you like to download our template to make it easier?"

**Options:**
- 📥 Yes, give me the template
- ➡️ No thanks, let's start

**→ Go to Manual Entry Flow**

---

## Section 2: Complete Review (AFTER Document Upload)

### Q2: Review Everything at Once
**Message:** "Hey Thomas 👋 I've extracted everything from your documents! Just give it a quick check to make sure everything's right — should only take a minute or two."

---

### Company Information
```
🏢 Company Name: ZETA GLOBAL
📋 Parent Entity: [Already filled]
🆔 VAT Number: BE12 2345 2435 2344 2343
📍 Address: Avenue de Finlande 8, 1420 Braine l'Alleud
📧 Invoice Email: accounting@zetaglobal.com
👥 Employees: 20
```
✏️ Edit | ✅ Looks good

---

### Federal Mobility Budget Configuration
```
📊 Budget Range: €3,233 - €17,244
💰 Framework: TCO1 + TCO2 + TCO3
📏 Distance allowances: Enabled
```
✏️ Customize | ✅ Looks good

---

### Budget Groups (4 found)
```
1. 💼 Executives - €800/month (Rollover: Yes)
2. 👔 Managers - €500/month (Rollover: Yes)
3. 👤 Employees - €300/month (Rollover: No)
4. 🎓 Interns - €150/month (Rollover: No)
```
✏️ Edit groups | ✅ Looks good

---

### Mobility Services (14 enabled)
```
✅ Car leasing, Public transport, Bikes, Car rental,
   Car sharing, Bus, Taxi, Carpooling, Scooter, etc.

❌ Bike leasing, Kickscooter
```
✏️ Change services | ✅ Looks good

---

### Compliance Rules (11 generated)
```
✅ Budget ≤ 1/5 of gross salary
✅ Receipt mandatory above €25
✅ 30-day submission window
✅ €500 escalation threshold
✅ €150 annual bike cap
... and 6 more
```
👀 See all rules | ✅ Looks good

---

**Question:** "How does everything look?"

**Options:**
- 🚀 Perfect! Let's launch
- ✏️ I need to edit [specific section]
- 👀 Show me more details
- 💾 Save as draft for now

---

## Section 3: Employee Invitation

### Q3: Team Onboarding
**Message:** "Great work! Your mobility program is almost ready. Now let's invite your team!"

**Question:** "How would you like to invite your employees?"

**Options:**
- 📤 Upload a list (CSV/Excel)
- ✉️ Send invitations manually
- 📧 Use my existing HR system integration
- ⏭️ I'll do this later

**If "Upload a list" selected:**
"Please include these columns:
- Email address (required)
- First name
- Last name
- Budget group
- Start date (optional)"

---

## Section 4: Final Launch

### Q4: Ready to Launch
**Message:** "🎉 Congratulations, Thomas! Your Pluxee Mobility program is configured and ready to go."

**Summary:**
```
✅ Company information validated
✅ Federal Mobility Budget configured
✅ 4 budget groups created
✅ 14 mobility services enabled
✅ 11 compliance rules applied
✅ Ready to invite 20 employees
```

**Question:** "Everything looks perfect! Ready to launch your mobility program?"

**Options:**
- 🚀 Yes, launch my program!
- 📄 Let me review the summary again
- ✏️ I want to make some changes
- 💾 Save as draft and finish later

**If "Launch" selected:**
"🎊 Amazing! Your mobility program is now live!

Next steps:
1. Invite your employees via email
2. They'll receive their login credentials
3. They can start using their mobility budget immediately

Need help? Our support team is here for you 24/7!"

---

## Conversation Flow Summary

### Path A: With Documents (Recommended - Faster)
```
START
  ↓
[Welcome & Introduction]
  ↓
Q1: Have documents ready? → YES
  ↓
[Upload documents ONCE] 📤
  ↓
[AI Analysis - 30 sec] 🤖
  ↓
Q2: Review EVERYTHING at once
    ├─ Company info ✅
    ├─ Budget configuration ✅
    ├─ Budget groups (4) ✅
    ├─ Mobility services (14) ✅
    └─ Compliance rules (11) ✅
  ↓
[Edit anything needed] ✏️ (optional)
  ↓
Q3: Invite employees? → [Upload list/Manual/Later]
  ↓
Q4: Ready to launch? → 🚀
  ↓
[SUCCESS - Program Live! 🎉]
```

### Path B: Manual Entry
```
START
  ↓
[Welcome & Introduction]
  ↓
Q1: Have documents ready? → NO
  ↓
[Manual entry flow - step by step]
  ├─ Enter company info
  ├─ Configure budget settings
  ├─ Create budget groups
  ├─ Select services
  └─ Set compliance rules
  ↓
Q3: Invite employees? → [Upload list/Manual/Later]
  ↓
Q4: Ready to launch? → 🚀
  ↓
[SUCCESS - Program Live! 🎉]
```

---

## Conversational Tone Guidelines

### Do's:
- ✅ Use friendly, casual language
- ✅ Show progress and celebrate milestones
- ✅ Provide context for why each step matters
- ✅ Offer help and explanations proactively
- ✅ Use emojis to make it feel personal
- ✅ Anticipate questions and concerns

### Don'ts:
- ❌ Use corporate jargon
- ❌ Make assumptions without confirming
- ❌ Overwhelm with too many options
- ❌ Skip explaining technical terms
- ❌ Rush through important decisions

---

## Alternative Question Phrasings

**Instead of:** "Enter your VAT number"
**Say:** "Can you confirm your VAT number is BE12 2345 2435 2344 2343? I pulled this from your documents."

**Instead of:** "Configure budget groups"
**Say:** "Let's create groups for your team — think of them like different employee tiers, each with their own budget!"

**Instead of:** "Upload employee data"
**Say:** "Ready to bring your team onboard? Upload their details and I'll send them their invites!"

**Instead of:** "Review compliance settings"
**Say:** "I've set up 11 rules to keep everything compliant with Belgian law — want to see what they are?"

---

## Edge Cases & Help Messages

### If user seems stuck:
"Hey, I noticed you've been here for a bit — need any help? I'm happy to explain anything!"

### If validation error:
"Oops! Looks like [field] needs a bit more info. [Specific helpful message]"

### If user wants to go back:
"No problem! Let's go back and adjust that. Your progress is saved."

### If user wants to skip:
"Sure thing! You can always come back to this later. I'll save your progress."

---

## Estimated Time

### Path A: With Documents (Recommended)
- **Upload documents:** 30 seconds
- **AI extraction:** 30 seconds
- **Review everything:** 2-3 minutes
- **Invite employees:** 1 minute
- **Total:** ~3-5 minutes ⚡

### Path B: Manual Entry
- **Step-by-step entry:** 8-12 minutes
- **Total:** ~8-12 minutes

---

**Average Questions (Path A):** 4 main decisions
**User Actions Required:** Minimal (upload once, review, confirm)
**Cognitive Load:** Very Low (AI does the heavy lifting)
