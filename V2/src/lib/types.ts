export type FieldType = 'text' | 'textarea' | 'select' | 'multiselect' | 'date' | 'number' | 'checkbox' | 'email' | 'phone' | 'url';

export interface FormFieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  description?: string;
  section?: string;
}

export interface SheetDefinition {
  name: string;
  title: string;
  emoji: string;
  sections: {
    title: string;
    description?: string;
    fields: FormFieldDefinition[];
  }[];
  visibleToClient: boolean;
}

export const SHEET_DEFINITIONS: SheetDefinition[] = [
  {
    name: 'client-information',
    title: 'Client Information',
    emoji: '🤝',
    visibleToClient: true,
    sections: [
      {
        title: 'Company Profile',
        description: 'Basic information about your organization',
        fields: [
          {
            key: 'company_name',
            label: 'Company Name',
            type: 'text',
            placeholder: 'Enter company name',
            required: true,
            section: 'Company Info'
          },
          {
            key: 'company_address',
            label: 'Company Address',
            type: 'textarea',
            placeholder: 'Street, City, Postal Code, Country',
            required: true,
            section: 'Company Info'
          },
          {
            key: 'vat_number',
            label: 'VAT Number',
            type: 'text',
            placeholder: 'BE0123456789',
            required: true,
            section: 'Company Info'
          },
          {
            key: 'number_of_employees',
            label: 'Number of Employees',
            type: 'number',
            placeholder: '0',
            required: true,
            section: 'Company Info'
          },
        ]
      },
      {
        title: 'Primary Contact',
        fields: [
          {
            key: 'contact_name',
            label: 'Contact Person Name',
            type: 'text',
            placeholder: 'Full name',
            required: true,
            section: 'Contact'
          },
          {
            key: 'contact_email',
            label: 'Contact Email',
            type: 'email',
            placeholder: 'email@company.com',
            required: true,
            section: 'Contact'
          },
          {
            key: 'contact_phone',
            label: 'Contact Phone',
            type: 'phone',
            placeholder: '+32 123 45 67 89',
            required: true,
            section: 'Contact'
          },
        ]
      },
    ]
  },
  {
    name: 'mobility-programs',
    title: 'Mobility Program(s)',
    emoji: '🚀',
    visibleToClient: true,
    sections: [
      {
        title: 'Program Configuration',
        description: 'Set up your mobility program',
        fields: [
          {
            key: 'program_name',
            label: 'Program Name',
            type: 'text',
            placeholder: 'e.g., Employee Mobility Program',
            required: true,
            section: 'Program Setup'
          },
          {
            key: 'program_description',
            label: 'Description',
            type: 'textarea',
            placeholder: 'Describe the purpose of this mobility program',
            section: 'Program Setup'
          },
          {
            key: 'program_template',
            label: 'Program Template',
            type: 'select',
            options: [
              'Federal Mobility Budget',
              'Commute',
              'Professional Travel',
              'EV Charging & Fuel'
            ],
            required: true,
            description: 'Select a template to pre-configure services',
            section: 'Program Setup'
          },
        ]
      },
      {
        title: 'Group & Budget Configuration',
        description: 'Configure budget groups and limits',
        fields: [
          {
            key: 'has_budget_groups',
            label: 'Use Budget Groups',
            type: 'select',
            options: ['Yes - Create groups', 'No - Individual budgets per employee'],
            required: true,
            description: 'Group employees with similar budget rules',
            section: 'Budget'
          },
          {
            key: 'budget_distribution',
            label: 'Budget Distribution',
            type: 'select',
            options: ['Monthly', 'Quarterly', 'Yearly (Full)'],
            required: true,
            description: 'How often should budgets be distributed?',
            section: 'Budget'
          },
          {
            key: 'budget_amount',
            label: 'Budget Amount per Employee',
            type: 'number',
            placeholder: '0.00',
            description: 'Amount in EUR per period',
            required: true,
            section: 'Budget'
          },
          {
            key: 'display_budget_limit',
            label: 'Display Budget Limit to Employees',
            type: 'checkbox',
            description: 'Show remaining budget in the employee app',
            section: 'Budget'
          },
          {
            key: 'carry_over',
            label: 'Allow Budget Carry Over',
            type: 'checkbox',
            description: 'Unused budget rolls over to next period',
            section: 'Budget'
          },
          {
            key: 'prorata_in',
            label: 'Prorata on Joining',
            type: 'checkbox',
            description: 'Calculate prorated budget when employee joins mid-period',
            section: 'Budget'
          },
          {
            key: 'prorata_out',
            label: 'Prorata on Leaving',
            type: 'checkbox',
            description: 'Calculate prorated budget when employee leaves mid-period',
            section: 'Budget'
          },
        ]
      },
      {
        title: 'Allowed Mobility Services',
        description: 'Select which services are available in this program',
        fields: [
          {
            key: 'service_b_parking',
            label: 'B-parking',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_bike_leasing',
            label: 'Bike leasing',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_bike_purchase',
            label: 'Bike purchase & Accessories',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_bike_rent',
            label: 'Bike rent',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_bus',
            label: 'Bus',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_car_leasing',
            label: 'Car leasing (pillar 1)',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_car_rental',
            label: 'Car rental',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_car_sharing',
            label: 'Car sharing',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_carpooling',
            label: 'Carpooling',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_shared_bike',
            label: 'Shared bike',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_kickscooter',
            label: 'Kickscooter',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_scooter',
            label: 'Scooter',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_public_parking',
            label: 'Public parking',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_public_transport_tickets',
            label: 'Public transport tickets',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_public_transport_subscriptions',
            label: 'Public transport subscriptions',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_taxi',
            label: 'Taxi',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_fuel_stations',
            label: 'Fuel stations',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_toll',
            label: 'Toll',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_housing_cost',
            label: 'Housing cost',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_bike_allowance',
            label: 'Bike allowance',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_car_allowance',
            label: 'Car allowance',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_carpooling_allowance',
            label: 'Carpooling allowance',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
          {
            key: 'service_pedestrian_allowance',
            label: 'Pedestrian allowance',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Services'
          },
        ]
      },
      {
        title: 'Approval Policies',
        description: 'Configure automatic approval rules',
        fields: [
          {
            key: 'auto_approve_expense',
            label: 'Auto-approve Expenses',
            type: 'checkbox',
            description: 'Automatically approve employee expense claims',
            section: 'Approval'
          },
          {
            key: 'auto_approve_refund',
            label: 'Auto-approve Refunds',
            type: 'checkbox',
            description: 'Automatically approve refund requests',
            section: 'Approval'
          },
          {
            key: 'auto_approve_subscription',
            label: 'Auto-approve Subscriptions',
            type: 'checkbox',
            description: 'Automatically approve subscription services',
            section: 'Approval'
          },
          {
            key: 'is_refund_enabled',
            label: 'Enable Refunds',
            type: 'checkbox',
            description: 'Allow employees to request refunds in this program',
            section: 'Approval'
          },
        ]
      },
    ]
  },
  {
    name: 'employees',
    title: 'Employees',
    emoji: '👥',
    visibleToClient: true,
    sections: [
      {
        title: 'Employee Management',
        description: 'Add employees manually or import via CSV',
        fields: []
      },
    ]
  },
  {
    name: 'go-live-planning',
    title: 'GO LIVE Planning',
    emoji: '📢',
    visibleToClient: true,
    sections: [
      {
        title: 'Communication Plan',
        description: 'Plan your internal communication strategy',
        fields: [
          {
            key: 'go_live_date',
            label: 'Planned GO LIVE Date',
            type: 'date',
            required: true,
            section: 'Timeline'
          },
          {
            key: 'announcement_date',
            label: 'Internal Announcement Date',
            type: 'date',
            section: 'Timeline'
          },
        ]
      },
      {
        title: 'Stakeholders',
        fields: [
          {
            key: 'hr_contact',
            label: 'HR Contact',
            type: 'text',
            placeholder: 'Name and email',
            section: 'Stakeholders'
          },
          {
            key: 'it_contact',
            label: 'IT Contact',
            type: 'text',
            placeholder: 'Name and email',
            section: 'Stakeholders'
          },
        ]
      },
    ]
  },
  {
    name: 'kyc-documents',
    title: 'KYC Documents',
    emoji: '✅',
    visibleToClient: false,
    sections: [
      {
        title: 'Required Documents',
        fields: [
          {
            key: 'company_registration',
            label: 'Company Registration Certificate',
            type: 'checkbox',
            section: 'Documents'
          },
          {
            key: 'vat_certificate',
            label: 'VAT Certificate',
            type: 'checkbox',
            section: 'Documents'
          },
          {
            key: 'bank_details',
            label: 'Bank Account Details',
            type: 'checkbox',
            section: 'Documents'
          },
        ]
      },
    ]
  },
  {
    name: 'csm-overview',
    title: 'CSM Overview',
    emoji: '📚',
    visibleToClient: false,
    sections: [
      {
        title: 'Customer Success',
        fields: [
          {
            key: 'csm_name',
            label: 'Assigned CSM',
            type: 'text',
            section: 'CSM Info'
          },
          {
            key: 'onboarding_status',
            label: 'Onboarding Status',
            type: 'select',
            options: ['Not Started', 'In Progress', 'Review', 'Completed'],
            section: 'CSM Info'
          },
        ]
      },
    ]
  },
  {
    name: 'csm-notes',
    title: 'CSM Notes',
    emoji: '✍️',
    visibleToClient: false,
    sections: [
      {
        title: 'Internal Notes',
        fields: [
          {
            key: 'internal_notes',
            label: 'Notes',
            type: 'textarea',
            placeholder: 'Add internal notes here...',
            section: 'Notes'
          },
        ]
      },
    ]
  },
];

export const TEMPLATE_PRESETS: Record<string, Record<string, string>> = {
  "Federal Mobility Budget": {
    "service_b_parking": "Yes",
    "service_bike_leasing": "Yes",
    "service_bike_purchase": "Yes",
    "service_bike_rent": "Yes",
    "service_bus": "Yes",
    "service_car_leasing": "Yes",
    "service_car_rental": "Yes",
    "service_car_sharing": "Yes",
    "service_carpooling": "Yes",
    "service_shared_bike": "Yes",
    "service_kickscooter": "Yes",
    "service_scooter": "Yes",
    "service_public_parking": "No",
    "service_public_transport_tickets": "Yes",
    "service_public_transport_subscriptions": "Yes",
    "service_taxi": "Yes",
    "service_fuel_stations": "No",
    "service_toll": "No",
    "service_housing_cost": "Yes",
    "service_bike_allowance": "Yes",
    "service_car_allowance": "Yes",
    "service_carpooling_allowance": "Yes",
    "service_pedestrian_allowance": "Yes",
  },
  "Commute": {
    "service_b_parking": "Yes",
    "service_bike_leasing": "Yes",
    "service_bike_purchase": "No",
    "service_bike_rent": "Yes",
    "service_bus": "No",
    "service_car_leasing": "No",
    "service_car_rental": "No",
    "service_car_sharing": "No",
    "service_carpooling": "No",
    "service_shared_bike": "Yes",
    "service_kickscooter": "Yes",
    "service_scooter": "No",
    "service_public_parking": "No",
    "service_public_transport_tickets": "Yes",
    "service_public_transport_subscriptions": "Yes",
    "service_taxi": "No",
    "service_fuel_stations": "No",
    "service_toll": "No",
    "service_housing_cost": "No",
    "service_bike_allowance": "Yes",
    "service_car_allowance": "Yes",
    "service_carpooling_allowance": "No",
    "service_pedestrian_allowance": "Yes",
  },
  "Professional Travel": {
    "service_b_parking": "Yes",
    "service_bike_leasing": "No",
    "service_bike_purchase": "No",
    "service_bike_rent": "No",
    "service_bus": "No",
    "service_car_leasing": "No",
    "service_car_rental": "No",
    "service_car_sharing": "Yes",
    "service_carpooling": "No",
    "service_shared_bike": "Yes",
    "service_kickscooter": "Yes",
    "service_scooter": "No",
    "service_public_parking": "Yes",
    "service_public_transport_tickets": "Yes",
    "service_public_transport_subscriptions": "Yes",
    "service_taxi": "Yes",
    "service_fuel_stations": "No",
    "service_toll": "No",
    "service_housing_cost": "No",
    "service_bike_allowance": "Yes",
    "service_car_allowance": "Yes",
    "service_carpooling_allowance": "No",
    "service_pedestrian_allowance": "No",
  },
  "EV Charging & Fuel": {
    "service_b_parking": "No",
    "service_bike_leasing": "No",
    "service_bike_purchase": "No",
    "service_bike_rent": "No",
    "service_bus": "No",
    "service_car_leasing": "No",
    "service_car_rental": "No",
    "service_car_sharing": "No",
    "service_carpooling": "No",
    "service_shared_bike": "No",
    "service_kickscooter": "No",
    "service_scooter": "No",
    "service_public_parking": "No",
    "service_public_transport_tickets": "No",
    "service_public_transport_subscriptions": "No",
    "service_taxi": "No",
    "service_fuel_stations": "Yes",
    "service_toll": "No",
    "service_housing_cost": "No",
    "service_bike_allowance": "No",
    "service_car_allowance": "No",
    "service_carpooling_allowance": "No",
    "service_pedestrian_allowance": "No",
  },
};
