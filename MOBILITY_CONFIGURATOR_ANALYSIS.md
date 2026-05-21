# 🧠 Mobility Configurator - Complete Logic & Hidden Architecture

## Executive Summary
The **Mobility Configurator.xlsx** is the central nervous system of Skipr's B2B onboarding process. It's a sophisticated multi-stage questionnaire that transforms complex mobility policy requirements into a structured, implementable dashboard configuration.

---

## 🎯 The Core Purpose

### What It Really Is
This isn't just a data collection form - it's a **business requirements translator** that:

1. **Captures strategic intent** → Converts business objectives into measurable mobility programs
2. **Standardizes complex policies** → 19 different mobility services, 4 allowance types, unlimited budget configurations
3. **Orchestrates multi-stakeholder workflows** → CSM, Client, Validations Team, Payroll, Employees
4. **Generates executable configurations** → Direct mapping to dashboard settings and API payloads

### The Hidden Pattern
```
Business Strategy → Policy Design → Technical Configuration → Employee Experience
     ↓                    ↓                    ↓                      ↓
  Excel Row 49      Excel Row 38         CSM Dashboard      skipr-onboarding app
```

---

## 📊 The 10 Sheets - Deep Dive

### 1. 🤝 Client Information (Discovery Phase)
**Purpose**: Strategic alignment and legal setup

**Key Sections**:
- **2. Objectives** (Row 44-64)
  - Strategic Business Objectives (pick 3 from 9 options)
  - Success metrics definition
  - *Hidden logic*: These drive which services get recommended in templates
  
- **3. Company Profile** (Row 70-94)
  - Multi-entity structure (parent/child companies)
  - VAT numbers, addresses, employee counts
  - *Hidden logic*: Employee count determines license pricing, entity structure affects invoicing
  
- **3.4 Points of Contact** (Row 90-94)
  - Main SPOC (Single Point of Contact)
  - *Hidden logic*: This person receives all GO LIVE communications (mapped to RAW MAPPING sheet)

**Future Implications**:
- The entity structure here determines how users are grouped in `group_name` field
- Employee count forecasts drive prepayment calculations (💰 Prepayment notice sheet)

---

### 2. 🚀 Mobility Program(s) (Configuration Engine)
**Purpose**: The actual program definition - can have multiple programs per client

**Structure** (Repeats for Program 1, Program 2, Program N):

#### Section 1: Program Naming (Row 37-38)
- Template selection triggers default service lists
- Templates: Federal Mobility Budget, Expense Reimbursement, Bike Budget, Custom

#### Section 2: Allowed Mobility Services (Row 40-61)
**The 19 Core Services**:
```
Transportation Services:
  - B-parking (Belgium-specific parking app)
  - Bike leasing, Bike purchase & Accessories, Bike rent
  - Bus, Public transport tickets, Public transport subscriptions
  - Car leasing (pillar 1), Car rental, Car sharing
  - Carpooling, Shared bike, Kickscooter, Scooter
  - Taxi, Fuel stations, Toll
  - Public parking

Special Categories:
  - Housing cost (requires additional validation rules)
    → If <10km from workplace
    → If >50% remote work
```

**Hidden Logic**:
- Each service has a "Default" column (from template) and "Customise" column (client override)
- The `MobilityServiceSelector.tsx` component reads these as Yes/No toggles
- Services marked "Yes" appear in employee's spending options

#### Section 2B: Allowances (Row 62-81)
**4 Distance-Based Reimbursement Types**:
```typescript
interface Allowance {
  type: 'bike' | 'car' | 'carpooling' | 'pedestrian';
  ratePerKm: number; // € per kilometer
  maxKmPerJourney: number;
  allowManualAdjustment: boolean;
  requireAdminValidation: boolean;
}
```

**Hidden Logic**:
- These are NOT services but calculated reimbursements
- Employees enter start/end addresses → system calculates distance → applies rate
- If `allowManualAdjustment = true`: employee can override calculated distance
- If `requireAdminValidation = true`: admin must approve before payment

**Future Implications**:
- This maps to a distance calculation API (likely Google Maps/Mapbox integration)
- The validation workflow requires an admin approval queue UI

#### Section 3: Budget Information (Row 82-103)
**Two Budget Modes**:

**Mode 1: GROUPS** (Most Common)
```
Example:
  Group: "Executives"
    - Budget: €800/month
    - Period: Monthly
    - Rollover: Yes (unused budget carries over)
    - Visibility: Hidden (employees don't see balance)
    - Pro rata: Yes (first month adjusted)
    - Mobility card: Yes
    - Refunds: Yes

  Group: "Field Workers"
    - Budget: €400/month
    - Period: Monthly
    - Rollover: No (resets each month)
    - Visibility: Visible
    - Mobility card: No (app-only)
    - Refunds: No
```

**Mode 2: CUSTOM BUDGETS**
- Individual budgets per employee
- Configured in bulk import file (`group_name` field differentiates)

**Hidden Logic**:
- The `group_name` field in "👥 Admin creation file" maps to groups defined here
- Budget periods trigger automated top-up jobs (cron-like system)
- Rollover behavior affects how unused funds are handled on period boundaries
- Pro rata calculation: `(budget_amount / days_in_period) * days_employee_active`

#### Section 4: Additional Information (Row 104-119)
**Critical Configuration Points**:
- **4.1 Geographical area**: Where budget can be spent (Belgium, Netherlands, EU-wide)
- **4.4 GO LIVE date**: First employee accounts active (triggers invitation emails)
- **4.5 Budget start date**: When budget top-ups begin (often same as GO LIVE)
- **4.6 Reimbursements**: Can employees claim expenses from private cards?
  - If yes → who validates? (CSM or Client validations team)
  - If yes → which services? (subset of allowed services)
- **4.7 Mobility cards**: Physical Mastercard issued to employees
- **4.8 Declaration of honor**: Legal agreement employees must accept

**Hidden Logic**:
- GO LIVE date cascades to "📢 GO LIVE planning" sheet (ADKAR timeline)
- Reimbursement validation settings map to "☑️ Validations Briefing" rules
- Declaration of honor → PDF upload requirement in onboarding flow

---

### 3. 📢 GO LIVE Planning (Execution Timeline)
**Purpose**: ADKAR change management model implementation

**ADKAR Phases**:

**A - Awareness** (Weeks -4 to -2)
- Info sessions scheduled
- Custom slidedeck created by Skipr
- Employees learn about mobility policy

**D - Desire** (Weeks -2 to -1)
- Eligible employees indicate interest
- Mobility budget amounts communicated
- Contract addendums signed (for Federal Mobility Budget)

**K - Knowledge** (Week -1)
- Admin training session
- Process documentation shared

**A - Ability** (GO LIVE Day)
- Employee user training
- First budgets activated
- Invitations sent

**R - Reinforcement** (Post GO LIVE)
- Support materials shared
- FAQ documents
- Ongoing CSM support

**Hidden Logic**:
- Dates auto-calculate backward from GO LIVE date
- Meeting invites sent by CLIENT (not Skipr) so recordings go to client mailbox
- This sheet is completed TOGETHER by CSM + Client (not solo)

---

### 4. ✅ KYC Documents (Compliance Layer)
**Purpose**: Know Your Customer regulatory requirements

**Document Types**:
- Articles of association
- UBO (Ultimate Beneficial Owner) declaration
- Company registration certificates
- Authorized signatories list

**Hidden Logic**:
- Required for payment processing (Skipr handles money)
- Blocks GO LIVE if incomplete
- Stored in secure document management system

---

### 5. 📚 CSM Overview (Planhat Integration)
**Purpose**: Customer success tracking and health metrics

**Sections**:
- Attention points (CSM notes critical items)
- Actionable objectives (derived from section 2.1 of Client Info)
- General client info summary

**Hidden Logic**:
- This data syncs to Planhat (customer success platform)
- Health scores calculated from objective progress
- Used for CSM renewal/upsell decisions

---

### 6. ✍️ CSM Notes (Internal Documentation)
**Purpose**: Free-form notes for CSM team

**Use Cases**:
- Client quirks or preferences
- Historical context
- Escalation notes

---

### 7. ☑️ Validations Briefing (Expense Approval Rules)
**Purpose**: Configure automated vs. manual validation workflows

**Key Rules**:
- **Bulk approve recurring expenses**: Auto-approve monthly subscriptions (e.g., bike lease)
- **Housing cost validations**:
  - Monthly proof of payment (rent receipt required)
  - <10km range proof (address verification)
- **Check dates**: First check, Second check (double-validation for high amounts)
- **Payroll export day**: When expense data sent to payroll system

**Hidden Logic**:
- These rules determine which expenses go to validation queue vs. auto-approved
- Validation team email: `teambackoffice.skipr+[clientname]@smartelia.com`
- Payroll export day must align with client's payroll cycle

---

### 8. 👥 Admin Creation File (User Bulk Import)
**Purpose**: Template for importing all employees at once

**24 Fields Structure**:
```typescript
interface EmployeeImport {
  // Personal
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  phone_number_country_code: string; // +32, +33, etc.
  language: 'nl' | 'fr' | 'en' | 'de';
  gender: 'M' | 'F' | 'X';
  
  // Identity (KYC)
  date_of_birth: Date; // YYYY-MM-DD
  place_of_birth: string;
  country_of_birth: string; // ISO code
  nationality: string; // ISO code
  
  // Work
  job_title: string;
  role: 'employee' | 'admin' | 'super_admin';
  start_on: Date; // Employment start date
  internal_payroll_id: string;
  cost_center: string;
  
  // Address (Required for distance calculations)
  address__street: string;
  address__postal_code: string;
  address__city: string;
  address__country_code: string; // ISO code
  
  // Program Assignment
  new_gen: boolean; // Use new UI/UX
  group_name: string; // Maps to budget group from sheet 2
  invite_on: Date; // When to send invitation email
  use_physical_card: boolean; // Issue Mastercard
}
```

**Hidden Logic**:
- `group_name` MUST match exactly a group defined in sheet 2 (🚀 Mobility program(s))
- `address__*` fields enable distance-based allowance calculations
- `invite_on` allows staggered rollouts (not everyone on GO LIVE day)
- `new_gen` flag for A/B testing new features

**Future Implications**:
- This CSV is uploaded via dashboard → triggers bulk user creation API
- Each user gets:
  - Email invitation (if `invite_on` ≤ today)
  - Budget allocation (from their `group_name`)
  - Mobility services access (from their group's program)
  - Physical card order (if `use_physical_card = true`)

---

### 9. 💰 Prepayment Notice (Financial Document)
**Purpose**: Invoice/prepayment documentation for client

**Content**:
- Skipr SA/NV details
- Client entity details
- Prepayment amount calculation
- VAT details

**Hidden Logic**:
- Generated after budget configuration complete
- Amount = (total eligible employees × average budget × payment period)
- Sent via Peppol (EU electronic invoicing standard)

---

### 10. 👾 RAW MAPPING (Data Integration Layer)
**Purpose**: Map Excel data to database fields and external systems

**Sections**:
- **Skipr team contacts** (Row 4-13)
  - Pre-filled with CSM team members
  - Phone numbers, emails
  - Maps to Row 92-94 in Client Information (counterpart contacts)
  
- **Entity name**: Legal entity for invoicing
- **IBAN wallet**: Bank account for mobility budget (client provides)

**Hidden Logic**:
- This sheet is the "Rosetta Stone" for data transformation
- CSM uses this to verify data before dashboard configuration
- Entity name + IBAN → payment processing setup

---

## 🔮 The Hidden Future - What This Enables

### Immediate Technical Implications

1. **skipr-onboarding App Mapping**:
```typescript
// The MobilityServiceSelector component you're building
// directly maps to Sheet 2, Section 2 (Row 40-61)

const services = [
  { key: 'b_parking', label: 'B-parking' },
  { key: 'bike_leasing', label: 'Bike leasing' },
  // ... 17 more services
];

// Each service toggle saves to:
// sessionId: unique per client onboarding session
// sheetName: '🚀 Mobility program(s)'
// fieldKey: 'b_parking'
// fieldValue: 'Yes' | 'No'
```

2. **Database Schema** (Inferred):
```sql
CREATE TABLE mobility_programs (
  id UUID PRIMARY KEY,
  client_id UUID,
  program_name VARCHAR(255),
  template_type ENUM('federal_budget', 'expense_reimbursement', 'bike_budget', 'custom'),
  created_at TIMESTAMP
);

CREATE TABLE program_services (
  program_id UUID,
  service_type ENUM('b_parking', 'bike_leasing', ...),
  enabled BOOLEAN,
  FOREIGN KEY (program_id) REFERENCES mobility_programs(id)
);

CREATE TABLE budget_groups (
  id UUID PRIMARY KEY,
  program_id UUID,
  group_name VARCHAR(255),
  top_up_amount DECIMAL(10,2),
  top_up_period ENUM('monthly', 'quarterly', 'yearly'),
  rollover_enabled BOOLEAN,
  budget_visible BOOLEAN,
  pro_rata_enabled BOOLEAN,
  mobility_card_allowed BOOLEAN,
  refunds_allowed BOOLEAN
);

CREATE TABLE allowances (
  program_id UUID,
  allowance_type ENUM('bike', 'car', 'carpooling', 'pedestrian'),
  rate_per_km DECIMAL(5,2),
  max_km_per_journey INT,
  manual_adjustment_allowed BOOLEAN,
  admin_validation_required BOOLEAN
);

CREATE TABLE employees (
  id UUID PRIMARY KEY,
  group_id UUID,
  first_name VARCHAR(255),
  email VARCHAR(255),
  -- all 24 fields from Admin Creation File
  FOREIGN KEY (group_id) REFERENCES budget_groups(id)
);
```

3. **API Endpoints** (Inferred):
```typescript
// The autosave endpoint in your app
POST /api/autosave
{
  sessionId: string,
  sheetName: string,
  fieldKey: string,
  fieldValue: string,
  fieldType: 'select' | 'text' | 'number' | 'date'
}

// Future endpoints the configurator data feeds into
POST /api/programs/create
POST /api/programs/:id/services
POST /api/programs/:id/budgets
POST /api/employees/bulk-import
POST /api/invitations/send
```

### Long-term Business Logic Implications

#### 1. **The Validation Engine**
```typescript
// Housing cost validation logic (from Sheet 7)
interface HousingCostValidation {
  requireMonthlyProof: boolean; // from Row 8
  requireDistanceProof: boolean; // from Row 9, if <10km
  
  async validate(expense: Expense): ValidationResult {
    if (this.requireMonthlyProof && !expense.hasAttachment('rent_receipt')) {
      return { approved: false, reason: 'Missing monthly proof' };
    }
    
    if (this.requireDistanceProof) {
      const distance = await calculateDistance(
        expense.employee.address,
        expense.employee.workAddress
      );
      
      if (distance < 10 && !expense.hasAttachment('address_proof')) {
        return { approved: false, reason: 'Missing <10km proof' };
      }
    }
    
    return { approved: true };
  }
}
```

#### 2. **The Budget Top-Up Engine**
```typescript
// Automated budget replenishment (from Sheet 2, Row 82-103)
interface BudgetTopUpJob {
  groupId: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  rolloverEnabled: boolean;
  
  async execute() {
    const employees = await getEmployeesInGroup(this.groupId);
    
    for (const employee of employees) {
      if (this.rolloverEnabled) {
        employee.budget += this.amount; // Add to existing
      } else {
        employee.budget = this.amount; // Reset
      }
      
      await employee.save();
      await sendNotification(employee, 'Budget topped up');
    }
  }
}

// Cron schedule based on period
monthly: '0 0 1 * *'    // 1st of each month
quarterly: '0 0 1 */3 *' // 1st of Jan, Apr, Jul, Oct
yearly: '0 0 1 1 *'      // 1st of January
```

#### 3. **The Distance Calculation Engine**
```typescript
// Allowance calculation (from Sheet 2, Row 62-81)
interface AllowanceCalculator {
  type: 'bike' | 'car' | 'carpooling' | 'pedestrian';
  ratePerKm: number;
  maxKmPerJourney: number;
  allowManualAdjustment: boolean;
  requireAdminValidation: boolean;
  
  async calculateReimbursement(
    fromAddress: Address,
    toAddress: Address,
    manualKm?: number
  ): Promise<Reimbursement> {
    let distance = await geocode.calculateDistance(fromAddress, toAddress);
    
    if (manualKm && this.allowManualAdjustment) {
      distance = manualKm;
    }
    
    if (distance > this.maxKmPerJourney) {
      distance = this.maxKmPerJourney; // Cap at max
    }
    
    const amount = distance * this.ratePerKm;
    const requiresApproval = 
      (manualKm && this.requireAdminValidation) ||
      amount > AUTO_APPROVAL_THRESHOLD;
    
    return {
      amount,
      distance,
      status: requiresApproval ? 'pending_approval' : 'approved'
    };
  }
}
```

#### 4. **The ADKAR Communication Engine**
```typescript
// Email automation (from Sheet 3, Row 41-42)
interface ADKARCommunicationPlan {
  goLiveDate: Date;
  
  async generateTimeline() {
    return {
      awareness: {
        date: subWeeks(this.goLiveDate, 4),
        action: 'Send info session invitations',
        recipients: 'all_eligible_employees'
      },
      desire: {
        date: subWeeks(this.goLiveDate, 2),
        action: 'Share individual budget amounts',
        recipients: 'interested_employees'
      },
      knowledge: {
        date: subWeeks(this.goLiveDate, 1),
        action: 'Conduct admin training',
        recipients: 'admin_users'
      },
      ability: {
        date: this.goLiveDate,
        action: 'Send employee training + activate accounts',
        recipients: 'confirmed_employees'
      },
      reinforcement: {
        date: addWeeks(this.goLiveDate, 1),
        action: 'Share support materials and FAQ',
        recipients: 'all_active_employees'
      }
    };
  }
}
```

---

## 🎓 Key Insights & Design Patterns

### 1. **The Template System**
- **Pattern**: Configuration by Convention
- **Logic**: Default service lists based on use case (Federal Budget vs Expense Reimbursement)
- **Hidden value**: Reduces client decision fatigue, ensures compliance with Belgian mobility budget law

### 2. **The Group-Based Architecture**
- **Pattern**: Hierarchical Access Control
- **Logic**: `Company → Entity → Program → Group → Employee`
- **Hidden value**: Enables complex org structures (multi-country, multi-entity) without custom code

### 3. **The Validation Rules Engine**
- **Pattern**: Configurable Business Rules
- **Logic**: Rules defined in Excel → Compiled into validation chain
- **Hidden value**: Each client can have unique compliance requirements without code changes

### 4. **The Pro Rata System**
- **Pattern**: Fair Financial Distribution
- **Logic**: Budget adjusted for partial periods (employee starts mid-month)
- **Formula**: `(monthly_budget / days_in_month) × days_employee_active`
- **Hidden value**: Prevents budget gaming, ensures cost accuracy

### 5. **The Dual-Mode Budget System**
- **Why Groups exist**: 95% of clients have standardized budgets (Executives, Managers, Staff)
- **Why Custom exists**: 5% need individual negotiations (VIPs, executives with special contracts)
- **Hidden value**: Scalability (process 1000 employees in groups) + Flexibility (handle edge cases)

---

## 🚨 Critical Dependencies & Risks

### Data Integrity Risks
1. **Group name mismatch**: If `group_name` in Admin Creation File doesn't match Sheet 2 → employee has no budget
2. **Date sequencing**: If `invite_on` < `budget_start_date` → employee invited but can't spend
3. **Service contradictions**: If service enabled but validation rules block it → employee confusion

### Integration Points (External Systems)
1. **Payroll export**: Must match client's payroll cycle day
2. **KYC validation**: Blocks payment processing if incomplete
3. **Geographic restrictions**: Some services only work in specific countries (B-parking = Belgium only)
4. **Physical card provisioning**: 2-3 week lead time, must order before GO LIVE

### Workflow Bottlenecks
1. **CSM review**: Human bottleneck between Excel → Dashboard configuration
2. **Client completion time**: Average 2-3 weeks to fill out configurator
3. **ADKAR timeline**: Minimum 4 weeks from completion to GO LIVE
4. **KYC processing**: Can take 1-2 weeks for legal review

---

## 🔗 How This Maps to Your skipr-onboarding App

### Current Implementation
```typescript
// MobilityServiceSelector.tsx (Your Component)
// Maps to: Sheet 2, Section 2 (Allowed Mobility Services)

const services = [
  { key: 'b_parking', label: 'B-parking' },
  { key: 'bike_leasing', label: 'Bike leasing' },
  // etc.
];

// When user toggles service:
POST /api/autosave {
  sessionId: "uuid",          // Unique per client configuration session
  sheetName: "🚀 Mobility program(s)",
  fieldKey: "b_parking",
  fieldValue: "Yes",
  fieldType: "select"
}
```

### What's Missing (Future Development)
1. **Budget Group Configuration UI**
   - Needs: Form to create groups (name, amount, period, rules)
   - Maps to: Sheet 2, Section 3 (Row 82-103)

2. **Allowance Rate Configuration UI**
   - Needs: Form for €/km rates, max km, validation rules
   - Maps to: Sheet 2, Section 2B (Row 62-81)

3. **GO LIVE Planning Calendar**
   - Needs: Timeline visualization with ADKAR phases
   - Maps to: Sheet 3 (entire sheet)

4. **Bulk User Import UI**
   - Needs: CSV upload with validation
   - Maps to: Sheet 8 (Admin creation file)

5. **Validation Rules Builder**
   - Needs: Toggle switches for approval rules
   - Maps to: Sheet 7 (Validations Briefing)

---

## 📈 Business Model Insights

### Revenue Model (Inferred)
```
License Fee = (# of employees) × (€X per employee per month)
Card Fee = (# of physical cards) × (€Y one-time + €Z per month)
Transaction Fee = (transaction volume) × (% commission on services)
```

### Why This Configurator Exists
1. **Standardization**: Turn messy client requirements into structured data
2. **Scalability**: CSM can onboard 10 clients/month with this system vs 2 without
3. **Self-Service**: Client does 70% of configuration work → reduces CSM labor cost
4. **Compliance**: Built-in guardrails ensure legal compliance (especially for Federal Mobility Budget)
5. **Upsell Path**: Complex configurations (multiple programs, custom budgets) → premium pricing

---

## 🎯 Final Synthesis: The Complete Picture

```
BUSINESS LAYER
  ↓ Client has mobility policy goals
  ↓ CSM sends Mobility Configurator.xlsx
  ↓ Client completes configuration
  ↓ CSM reviews and validates
  
PROCESS LAYER  
  ↓ GO LIVE planning (ADKAR)
  ↓ User bulk import
  ↓ KYC verification
  ↓ Validation rules setup
  
TECHNICAL LAYER
  ↓ Dashboard configuration (CSM action)
  ↓ Database records created
  ↓ Budget groups & allowances configured
  ↓ Services enabled per program
  
APPLICATION LAYER
  ↓ skipr-onboarding app (client-facing)
  ↓ Employee portal (end-user app)
  ↓ Admin dashboard (client admin)
  ↓ Validation queue (Skipr backoffice)
  
FINANCIAL LAYER
  ↓ Budget top-ups (automated cron jobs)
  ↓ Expense approvals (rules engine)
  ↓ Payroll export (integration)
  ↓ Payment processing (bank APIs)
```

---

## 💡 Recommended Next Steps for Development

1. **Create a Schema Validator**
   - Parse Excel → Validate all cross-references
   - Check: group names match, dates are logical, services align with templates
   
2. **Build a Configuration Preview**
   - Show client what their employees will experience BEFORE GO LIVE
   - Reduces post-launch changes

3. **Automate CSM Workflow**
   - Excel upload → Auto-populate dashboard configuration
   - Reduce manual CSM data entry (current bottleneck)

4. **Add Configuration Versioning**
   - Track changes over time (client edits budget groups mid-year)
   - Enable rollback if mistakes made

5. **Build a Template Library**
   - Pre-configured setups for common use cases
   - "Belgian Federal Mobility Budget - Standard"
   - "Netherlands Bike Budget - Basic"

---

This configurator is a **masterclass in translating business complexity into technical simplicity**. It's not just data collection - it's a complete onboarding orchestration system.
