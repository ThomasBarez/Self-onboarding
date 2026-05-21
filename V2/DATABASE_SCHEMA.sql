-- ============================================================================
-- MOBILITY CONFIGURATOR DATABASE SCHEMA
-- Complete schema for implementing all Excel configurator logic
-- ============================================================================

-- ============================================================================
-- CONFIGURATION SESSION (Main Entry Point)
-- ============================================================================

CREATE TABLE configuration_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('CLIENT', 'INTERNAL')),
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'launched')),

  -- CSM Assignment
  assigned_csm_name VARCHAR(255),
  assigned_csm_email VARCHAR(255),
  assigned_csm_phone VARCHAR(50),

  -- Progress Tracking
  completed_client_information BOOLEAN DEFAULT FALSE,
  completed_mobility_programs BOOLEAN DEFAULT FALSE,
  completed_go_live_planning BOOLEAN DEFAULT FALSE,
  completed_kyc_documents BOOLEAN DEFAULT FALSE,
  completed_validation_rules BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT valid_email CHECK (user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_sessions_email ON configuration_sessions(user_email);
CREATE INDEX idx_sessions_status ON configuration_sessions(status);

-- ============================================================================
-- CLIENT INFORMATION (Sheet 1)
-- ============================================================================

-- Business Objectives
CREATE TABLE business_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES configuration_sessions(id) ON DELETE CASCADE,
  objective VARCHAR(100) NOT NULL CHECK (objective IN (
    'ensure_compliance',
    'reduce_mobility_cost',
    'centralize_data',
    'measure_co2',
    'attract_talent',
    'increase_options',
    'reduce_workload',
    'increase_retention',
    'provide_insights',
    'reduce_car_fleet'
  )),
  sort_order INT NOT NULL,

  CONSTRAINT max_three_objectives UNIQUE (session_id, sort_order),
  CHECK (sort_order BETWEEN 1 AND 3)
);

CREATE TABLE success_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES configuration_sessions(id) ON DELETE CASCADE,
  metric_description TEXT NOT NULL,
  sort_order INT NOT NULL
);

-- Company Entities
CREATE TABLE company_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES configuration_sessions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  parent_entity_id UUID REFERENCES company_entities(id) ON DELETE SET NULL,
  vat_number VARCHAR(50) NOT NULL,

  -- Address
  street VARCHAR(255) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,

  employee_count INT NOT NULL CHECK (employee_count >= 0),

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_entities_session ON company_entities(session_id);
CREATE INDEX idx_entities_parent ON company_entities(parent_entity_id);

-- Points of Contact
CREATE TABLE points_of_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES configuration_sessions(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  phone_number VARCHAR(50),
  is_main_spoc BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contacts_session ON points_of_contact(session_id);

-- ============================================================================
-- MOBILITY PROGRAMS (Sheet 2)
-- ============================================================================

CREATE TABLE mobility_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES configuration_sessions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  template VARCHAR(100) NOT NULL CHECK (template IN (
    'federal_mobility_budget',
    'expense_reimbursement',
    'bike_budget',
    'custom'
  )),

  -- Budget Configuration
  budget_mode VARCHAR(50) NOT NULL DEFAULT 'groups' CHECK (budget_mode IN ('groups', 'custom')),

  -- Additional Info (Row 104-119)
  geographical_area VARCHAR(255),
  eligible_employees INT,
  estimated_starters INT,
  go_live_date DATE,
  budget_start_date DATE,

  -- Reimbursements
  refunds_enabled BOOLEAN DEFAULT FALSE,
  refunds_validated_by VARCHAR(50) CHECK (refunds_validated_by IN ('csm', 'client_admin', 'auto')),

  -- Declaration of Honor
  declaration_of_honor_enabled BOOLEAN DEFAULT FALSE,
  declaration_of_honor_document_url TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_programs_session ON mobility_programs(session_id);

-- Mobility Services (checkboxes for the 19 services)
CREATE TABLE program_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES mobility_programs(id) ON DELETE CASCADE,
  service_type VARCHAR(100) NOT NULL CHECK (service_type IN (
    'b_parking',
    'bike_leasing',
    'bike_purchase',
    'bike_rent',
    'bus',
    'car_leasing',
    'car_rental',
    'car_sharing',
    'carpooling',
    'shared_bike',
    'kickscooter',
    'scooter',
    'public_parking',
    'public_transport_tickets',
    'public_transport_subscriptions',
    'taxi',
    'fuel_stations',
    'toll',
    'housing_cost'
  )),
  enabled BOOLEAN DEFAULT FALSE,
  default_from_template BOOLEAN DEFAULT FALSE,

  UNIQUE(program_id, service_type)
);

CREATE INDEX idx_services_program ON program_services(program_id);
CREATE INDEX idx_services_enabled ON program_services(program_id, enabled);

-- Allowances (distance-based reimbursements)
CREATE TABLE program_allowances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES mobility_programs(id) ON DELETE CASCADE,
  allowance_type VARCHAR(50) NOT NULL CHECK (allowance_type IN ('bike', 'car', 'carpooling', 'pedestrian')),
  rate_per_km DECIMAL(5,2) NOT NULL CHECK (rate_per_km >= 0),
  max_km_per_journey INT NOT NULL CHECK (max_km_per_journey > 0),
  allow_manual_adjustment BOOLEAN DEFAULT FALSE,
  require_admin_validation BOOLEAN DEFAULT FALSE,

  UNIQUE(program_id, allowance_type)
);

CREATE INDEX idx_allowances_program ON program_allowances(program_id);

-- Services allowed for refunds (if refunds only apply to subset)
CREATE TABLE program_refund_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES mobility_programs(id) ON DELETE CASCADE,
  service_type VARCHAR(100) NOT NULL,

  UNIQUE(program_id, service_type)
);

-- Budget Groups
CREATE TABLE budget_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES mobility_programs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  top_up_amount DECIMAL(10,2) NOT NULL CHECK (top_up_amount >= 0),
  top_up_period VARCHAR(50) NOT NULL CHECK (top_up_period IN ('monthly', 'quarterly', 'yearly')),
  rollover_behavior VARCHAR(50) NOT NULL CHECK (rollover_behavior IN ('rollover', 'reset')),
  budget_visible BOOLEAN DEFAULT TRUE,
  pro_rata_enabled BOOLEAN DEFAULT TRUE,
  mobility_card_allowed BOOLEAN DEFAULT TRUE,
  refunds_allowed BOOLEAN DEFAULT TRUE,
  visible_to_admins_only BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),

  -- CRITICAL: group name must be unique within a program
  UNIQUE(program_id, name)
);

CREATE INDEX idx_groups_program ON budget_groups(program_id);
CREATE INDEX idx_groups_name ON budget_groups(program_id, name);

-- ============================================================================
-- GO LIVE PLANNING (Sheet 3 - ADKAR Model)
-- ============================================================================

CREATE TABLE go_live_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES configuration_sessions(id) ON DELETE CASCADE,
  go_live_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(session_id)
);

CREATE TABLE adkar_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES go_live_plans(id) ON DELETE CASCADE,
  phase VARCHAR(50) NOT NULL CHECK (phase IN ('awareness', 'desire', 'knowledge', 'ability', 'reinforcement')),
  date DATE NOT NULL,
  action TEXT NOT NULL,
  recipients VARCHAR(50) NOT NULL CHECK (recipients IN (
    'all_eligible',
    'interested',
    'admin_users',
    'confirmed',
    'all_active'
  )),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,

  UNIQUE(plan_id, phase)
);

CREATE INDEX idx_milestones_plan ON adkar_milestones(plan_id);
CREATE INDEX idx_milestones_date ON adkar_milestones(plan_id, date);

-- ============================================================================
-- KYC DOCUMENTS (Sheet 4)
-- ============================================================================

CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES configuration_sessions(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL CHECK (document_type IN (
    'articles_of_association',
    'ubo_declaration',
    'company_registration',
    'authorized_signatories',
    'other'
  )),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size_bytes INT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,

  uploaded_by VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMP
);

CREATE INDEX idx_kyc_session ON kyc_documents(session_id);
CREATE INDEX idx_kyc_status ON kyc_documents(session_id, status);

-- ============================================================================
-- VALIDATION RULES (Sheet 7)
-- ============================================================================

CREATE TABLE validation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES configuration_sessions(id) ON DELETE CASCADE,

  -- General Rules
  bulk_approve_recurring BOOLEAN DEFAULT FALSE,

  -- Housing Cost Validation
  housing_require_monthly_proof BOOLEAN DEFAULT FALSE,
  housing_require_distance_proof BOOLEAN DEFAULT FALSE,

  -- Check Dates (double validation)
  first_check_date DATE,
  second_check_date DATE,

  -- Payroll Integration
  payroll_export_day INT CHECK (payroll_export_day BETWEEN 1 AND 31),

  -- Validation Team
  validation_team_email VARCHAR(255),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(session_id)
);

-- ============================================================================
-- CSM METADATA (Sheets 5, 6)
-- ============================================================================

CREATE TABLE csm_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES configuration_sessions(id) ON DELETE CASCADE,
  planhat_id VARCHAR(255),
  health_score INT CHECK (health_score BETWEEN 0 AND 100),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(session_id)
);

CREATE TABLE csm_attention_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metadata_id UUID NOT NULL REFERENCES csm_metadata(id) ON DELETE CASCADE,
  point TEXT NOT NULL,
  sort_order INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE csm_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metadata_id UUID NOT NULL REFERENCES csm_metadata(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notes_metadata ON csm_notes(metadata_id);

-- ============================================================================
-- EMPLOYEE BULK IMPORT (Sheet 8)
-- ============================================================================

CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES configuration_sessions(id) ON DELETE CASCADE,
  program_id UUID REFERENCES mobility_programs(id) ON DELETE SET NULL,
  budget_group_id UUID REFERENCES budget_groups(id) ON DELETE SET NULL,

  -- Personal Info
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  phone_number_country_code VARCHAR(10),
  language VARCHAR(10) CHECK (language IN ('nl', 'fr', 'en', 'de')),
  gender VARCHAR(1) CHECK (gender IN ('M', 'F', 'X')),

  -- Identity (KYC)
  date_of_birth DATE,
  place_of_birth VARCHAR(100),
  country_of_birth VARCHAR(10),
  nationality VARCHAR(10),

  -- Work Info
  job_title VARCHAR(100),
  role VARCHAR(50) CHECK (role IN ('employee', 'admin', 'super_admin')),
  start_on DATE,
  internal_payroll_id VARCHAR(100),
  cost_center VARCHAR(100),

  -- Address (for distance calculations)
  address_street VARCHAR(255),
  address_postal_code VARCHAR(20),
  address_city VARCHAR(100),
  address_country_code VARCHAR(10),

  -- Program Assignment
  new_gen BOOLEAN DEFAULT FALSE,
  group_name VARCHAR(255), -- Must match budget_groups.name
  invite_on DATE,
  use_physical_card BOOLEAN DEFAULT FALSE,

  -- Status
  invitation_sent BOOLEAN DEFAULT FALSE,
  invitation_sent_at TIMESTAMP,
  account_activated BOOLEAN DEFAULT FALSE,
  account_activated_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT valid_employee_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_employees_session ON employees(session_id);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_group ON employees(budget_group_id);
CREATE INDEX idx_employees_invite_date ON employees(invite_on);

-- ============================================================================
-- BUDGET CALCULATIONS (Runtime Data)
-- ============================================================================

CREATE TABLE budget_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  budget_group_id UUID NOT NULL REFERENCES budget_groups(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  base_amount DECIMAL(10,2) NOT NULL,
  pro_rata_adjustment DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL,

  current_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  spent_amount DECIMAL(10,2) NOT NULL DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_allocations_employee ON budget_allocations(employee_id);
CREATE INDEX idx_allocations_period ON budget_allocations(employee_id, period_start, period_end);

-- ============================================================================
-- EXPENSE TRACKING (Runtime Data)
-- ============================================================================

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  budget_allocation_id UUID REFERENCES budget_allocations(id) ON DELETE SET NULL,

  expense_type VARCHAR(50) NOT NULL CHECK (expense_type IN ('service', 'allowance', 'refund')),
  service_type VARCHAR(100), -- For service expenses
  allowance_type VARCHAR(50), -- For allowance expenses

  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(10) DEFAULT 'EUR',

  -- Distance-based allowance data
  from_address TEXT,
  to_address TEXT,
  calculated_distance_km DECIMAL(10,2),
  manual_distance_km DECIMAL(10,2),

  -- Attachments
  has_attachments BOOLEAN DEFAULT FALSE,

  -- Validation
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'pending_approval', 'approved', 'rejected')),
  requires_manual_review BOOLEAN DEFAULT FALSE,
  assigned_to VARCHAR(50) CHECK (assigned_to IN ('admin', 'csm', 'validation_team')),

  -- Approval
  approved_by VARCHAR(255),
  approved_at TIMESTAMP,
  rejection_reason TEXT,

  expense_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_expenses_employee ON expenses(employee_id);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_date ON expenses(expense_date);

CREATE TABLE expense_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(100),
  file_size_bytes INT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attachments_expense ON expense_attachments(expense_id);

-- ============================================================================
-- AUTO-SAVE TRACKING (For session state)
-- ============================================================================

CREATE TABLE autosave_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES configuration_sessions(id) ON DELETE CASCADE,
  sheet_name VARCHAR(255) NOT NULL,
  field_key VARCHAR(255) NOT NULL,
  field_value TEXT NOT NULL,
  field_type VARCHAR(50) NOT NULL CHECK (field_type IN ('text', 'number', 'select', 'date', 'boolean', 'json')),

  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(session_id, sheet_name, field_key)
);

CREATE INDEX idx_autosave_session ON autosave_fields(session_id);
CREATE INDEX idx_autosave_sheet ON autosave_fields(session_id, sheet_name);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON configuration_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON mobility_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON go_live_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rules_updated_at BEFORE UPDATE ON validation_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_allocations_updated_at BEFORE UPDATE ON budget_allocations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Complete session overview
CREATE VIEW v_session_overview AS
SELECT
  s.id AS session_id,
  s.client_name,
  s.status,
  s.user_email,
  s.assigned_csm_name,
  COUNT(DISTINCT p.id) AS program_count,
  COUNT(DISTINCT e.id) AS employee_count,
  COUNT(DISTINCT k.id) AS kyc_document_count,
  (s.completed_client_information AND
   s.completed_mobility_programs AND
   s.completed_go_live_planning AND
   s.completed_kyc_documents AND
   s.completed_validation_rules) AS fully_completed,
  s.created_at,
  s.updated_at
FROM configuration_sessions s
LEFT JOIN mobility_programs p ON p.session_id = s.id
LEFT JOIN employees e ON e.session_id = s.id
LEFT JOIN kyc_documents k ON k.session_id = s.id
GROUP BY s.id;

-- Employee budget overview
CREATE VIEW v_employee_budget_overview AS
SELECT
  e.id AS employee_id,
  e.first_name,
  e.last_name,
  e.email,
  bg.name AS group_name,
  bg.top_up_amount,
  bg.top_up_period,
  ba.current_balance,
  ba.spent_amount,
  ba.period_start,
  ba.period_end
FROM employees e
LEFT JOIN budget_groups bg ON e.budget_group_id = bg.id
LEFT JOIN budget_allocations ba ON ba.employee_id = e.id
  AND ba.period_start <= CURRENT_DATE
  AND ba.period_end >= CURRENT_DATE;

-- ============================================================================
-- SAMPLE QUERIES FOR VALIDATION LOGIC
-- ============================================================================

-- Check for employees with invalid group names
CREATE VIEW v_invalid_employee_groups AS
SELECT
  e.id AS employee_id,
  e.first_name,
  e.last_name,
  e.group_name,
  e.session_id
FROM employees e
WHERE e.budget_group_id IS NULL
  AND e.group_name IS NOT NULL;

-- Expenses pending validation
CREATE VIEW v_pending_validations AS
SELECT
  ex.id AS expense_id,
  e.first_name || ' ' || e.last_name AS employee_name,
  ex.service_type,
  ex.amount,
  ex.status,
  ex.assigned_to,
  ex.expense_date,
  ex.has_attachments
FROM expenses ex
JOIN employees e ON ex.employee_id = e.id
WHERE ex.status IN ('pending', 'pending_approval')
ORDER BY ex.expense_date DESC;
