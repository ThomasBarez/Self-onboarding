/**
 * Complete type definitions for Mobility Configurator
 * Maps directly to the Excel structure
 */

// ============================================================================
// MOBILITY SERVICES (Sheet 2, Row 40-61)
// ============================================================================

export type MobilityServiceType =
  | 'b_parking'
  | 'bike_leasing'
  | 'bike_purchase'
  | 'bike_rent'
  | 'bus'
  | 'car_leasing'
  | 'car_rental'
  | 'car_sharing'
  | 'carpooling'
  | 'shared_bike'
  | 'kickscooter'
  | 'scooter'
  | 'public_parking'
  | 'public_transport_tickets'
  | 'public_transport_subscriptions'
  | 'taxi'
  | 'fuel_stations'
  | 'toll'
  | 'housing_cost';

export interface MobilityService {
  key: MobilityServiceType;
  label: string;
  enabled: boolean;
  defaultFromTemplate?: boolean; // From template selection
}

// ============================================================================
// ALLOWANCES (Sheet 2, Row 62-81)
// ============================================================================

export type AllowanceType = 'bike' | 'car' | 'carpooling' | 'pedestrian';

export interface Allowance {
  type: AllowanceType;
  ratePerKm: number; // € per kilometer
  maxKmPerJourney: number;
  allowManualAdjustment: boolean; // Can employee override calculated distance?
  requireAdminValidation: boolean; // Must admin approve manual adjustments?
}

// ============================================================================
// BUDGET GROUPS (Sheet 2, Row 82-103)
// ============================================================================

export type BudgetPeriod = 'monthly' | 'quarterly' | 'yearly';
export type RolloverBehavior = 'rollover' | 'reset';

export interface BudgetGroup {
  id: string; // UUID
  name: string; // "Executives", "Field Workers", etc.
  topUpAmount: number; // € amount
  topUpPeriod: BudgetPeriod;
  rolloverBehavior: RolloverBehavior; // What happens to unused budget
  budgetVisible: boolean; // Can employee see their balance?
  proRataEnabled: boolean; // Adjust first period for partial month?
  mobilityCardAllowed: boolean; // Issue physical Mastercard?
  refundsAllowed: boolean; // Can claim expenses from private card?
  visibleToAdminsOnly: boolean; // Group name hidden from employees
}

// ============================================================================
// MOBILITY PROGRAM (Sheet 2, Complete)
// ============================================================================

export type ProgramTemplate =
  | 'federal_mobility_budget'
  | 'expense_reimbursement'
  | 'bike_budget'
  | 'custom';

export interface MobilityProgram {
  id: string; // UUID
  name: string; // "Executive Mobility Program"
  template: ProgramTemplate;

  // Services Configuration
  services: MobilityService[];
  allowances: Allowance[];

  // Budget Configuration
  budgetMode: 'groups' | 'custom';
  budgetGroups: BudgetGroup[];

  // Additional Info (Row 104-119)
  geographicalArea: string; // "Belgium", "EU-wide", etc.
  eligibleEmployees: number;
  estimatedStarters: number;
  goLiveDate: Date;
  budgetStartDate: Date;

  // Reimbursements
  refundsEnabled: boolean;
  refundsValidatedBy: 'csm' | 'client_admin' | 'auto';
  refundsOnlyForServices?: MobilityServiceType[]; // Subset if not all

  // Declaration of Honor
  declarationOfHonor?: {
    enabled: boolean;
    documentUrl?: string;
  };
}

// ============================================================================
// COMPANY PROFILE (Sheet 1, Row 70-94)
// ============================================================================

export interface CompanyEntity {
  id: string;
  name: string;
  parentEntityId?: string; // For hierarchical structures
  vatNumber: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  employeeCount: number;
}

export interface PointOfContact {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  isMainSpoc: boolean; // Single Point of Contact
}

export type BusinessObjective =
  | 'ensure_compliance'
  | 'reduce_mobility_cost'
  | 'centralize_data'
  | 'measure_co2'
  | 'attract_talent'
  | 'increase_options'
  | 'reduce_workload'
  | 'increase_retention'
  | 'provide_insights'
  | 'reduce_car_fleet';

export interface ClientInformation {
  // Business Objectives (Row 44-64)
  objectives: BusinessObjective[]; // Pick 3
  successMetrics: string[]; // At least 1

  // Company Profile (Row 70-94)
  entities: CompanyEntity[];
  contacts: PointOfContact[];
}

// ============================================================================
// GO LIVE PLANNING (Sheet 3, ADKAR Model)
// ============================================================================

export type ADKARPhase = 'awareness' | 'desire' | 'knowledge' | 'ability' | 'reinforcement';

export interface ADKARMilestone {
  phase: ADKARPhase;
  date: Date;
  action: string;
  recipients: 'all_eligible' | 'interested' | 'admin_users' | 'confirmed' | 'all_active';
  completed: boolean;
}

export interface GOLivePlan {
  goLiveDate: Date;
  milestones: ADKARMilestone[];
}

// ============================================================================
// VALIDATION RULES (Sheet 7)
// ============================================================================

export interface ValidationRules {
  bulkApproveRecurring: boolean; // Auto-approve monthly subscriptions

  housingCost: {
    requireMonthlyProof: boolean; // Rent receipt required
    requireDistanceProof: boolean; // Address verification if <10km
  };

  checkDates: {
    firstCheck?: Date;
    secondCheck?: Date; // Double validation for high amounts
  };

  payrollExportDay: number; // Day of month (1-31)
  validationTeamEmail: string; // teambackoffice.skipr+clientname@smartelia.com
}

// ============================================================================
// EMPLOYEE BULK IMPORT (Sheet 8)
// ============================================================================

export type EmployeeRole = 'employee' | 'admin' | 'super_admin';
export type Gender = 'M' | 'F' | 'X';
export type Language = 'nl' | 'fr' | 'en' | 'de';

export interface EmployeeImport {
  // Personal
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneNumberCountryCode: string; // +32, +33, etc.
  language: Language;
  gender: Gender;

  // Identity (KYC)
  dateOfBirth: Date; // YYYY-MM-DD
  placeOfBirth: string;
  countryOfBirth: string; // ISO code
  nationality: string; // ISO code

  // Work
  jobTitle: string;
  role: EmployeeRole;
  startOn: Date; // Employment start date
  internalPayrollId: string;
  costCenter: string;

  // Address (Required for distance calculations)
  address: {
    street: string;
    postalCode: string;
    city: string;
    countryCode: string; // ISO code
  };

  // Program Assignment
  newGen: boolean; // Use new UI/UX
  groupName: string; // MUST match BudgetGroup.name
  inviteOn: Date; // When to send invitation email
  usePhysicalCard: boolean; // Issue Mastercard
}

// ============================================================================
// KYC DOCUMENTS (Sheet 4)
// ============================================================================

export type KYCDocumentType =
  | 'articles_of_association'
  | 'ubo_declaration'
  | 'company_registration'
  | 'authorized_signatories'
  | 'other';

export interface KYCDocument {
  id: string;
  type: KYCDocumentType;
  fileName: string;
  uploadedAt: Date;
  uploadedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

// ============================================================================
// CSM METADATA (Sheet 5, 6)
// ============================================================================

export interface CSMMetadata {
  planhatId?: string;
  attentionPoints: string[];
  healthScore?: number; // 0-100
  notes: {
    id: string;
    content: string;
    createdAt: Date;
    createdBy: string;
  }[];
}

// ============================================================================
// COMPLETE CONFIGURATION SESSION
// ============================================================================

export interface ConfigurationSession {
  id: string; // UUID
  clientName: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'in_review' | 'approved' | 'launched';

  // All configuration data
  clientInformation: ClientInformation;
  mobilityPrograms: MobilityProgram[]; // Can have multiple programs
  goLivePlan: GOLivePlan;
  validationRules: ValidationRules;
  kycDocuments: KYCDocument[];
  csmMetadata: CSMMetadata;

  // Tracking
  completedSections: {
    clientInformation: boolean;
    mobilityPrograms: boolean;
    goLivePlanning: boolean;
    kycDocuments: boolean;
    validationRules: boolean;
  };

  // CSM Assignment
  assignedCsm: {
    name: string;
    email: string;
    phone: string;
  };
}

// ============================================================================
// API PAYLOADS
// ============================================================================

export interface AutosavePayload {
  sessionId: string;
  sheetName: string;
  fieldKey: string;
  fieldValue: string | number | boolean | Date;
  fieldType: 'text' | 'number' | 'select' | 'date' | 'boolean';
}

export interface BulkImportPayload {
  sessionId: string;
  programId: string;
  employees: EmployeeImport[];
}

export interface ProgramCreationPayload {
  sessionId: string;
  program: Omit<MobilityProgram, 'id'>;
}

// ============================================================================
// VALIDATION LOGIC TYPES
// ============================================================================

export interface ExpenseValidationContext {
  expense: {
    id: string;
    amount: number;
    serviceType: MobilityServiceType;
    employeeId: string;
    hasAttachments: boolean;
    attachmentTypes: string[];
  };
  employee: {
    address: {
      street: string;
      city: string;
      postalCode: string;
    };
    workAddress: {
      street: string;
      city: string;
      postalCode: string;
    };
  };
  program: MobilityProgram;
  validationRules: ValidationRules;
}

export interface ValidationResult {
  approved: boolean;
  reason?: string;
  requiresManualReview: boolean;
  assignedTo?: 'admin' | 'csm' | 'validation_team';
}

// ============================================================================
// BUDGET CALCULATION TYPES
// ============================================================================

export interface BudgetCalculation {
  employeeId: string;
  groupId: string;
  period: BudgetPeriod;
  baseAmount: number;
  proRataAdjustment?: number; // For partial periods
  finalAmount: number;
  startDate: Date;
  endDate: Date;
}

export interface ReimbursementCalculation {
  allowanceType: AllowanceType;
  fromAddress: string;
  toAddress: string;
  calculatedDistance: number; // km
  manualDistance?: number; // If employee overrode
  ratePerKm: number;
  cappedDistance: number; // After maxKmPerJourney cap
  amount: number;
  requiresApproval: boolean;
}
