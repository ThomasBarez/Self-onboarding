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
        title: 'Strategic Business Objectives',
        description: 'Please select your 3 main strategic business objectives',
        fields: [
          {
            key: 'objective_1',
            label: 'Business Objective 1',
            type: 'select',
            options: [
              'Ensure compliance with legislation',
              'Reduce cost linked to mobility',
              'Centralise mobility data',
              'Measure CO2 emissions',
              'Attract new talent on the job market',
              'Increase available mobility options',
              'Reduce workload linked to mobility',
              'Increase employee retention',
              'Provide insights to executive team',
              'Reduce car fleet'
            ],
            required: true,
            section: 'Objectives'
          },
          {
            key: 'objective_2',
            label: 'Business Objective 2',
            type: 'select',
            options: [
              'Ensure compliance with legislation',
              'Reduce cost linked to mobility',
              'Centralise mobility data',
              'Measure CO2 emissions',
              'Attract new talent on the job market',
              'Increase available mobility options',
              'Reduce workload linked to mobility',
              'Increase employee retention',
              'Provide insights to executive team',
              'Reduce car fleet'
            ],
            required: true,
            section: 'Objectives'
          },
          {
            key: 'objective_3',
            label: 'Business Objective 3',
            type: 'select',
            options: [
              'Ensure compliance with legislation',
              'Reduce cost linked to mobility',
              'Centralise mobility data',
              'Measure CO2 emissions',
              'Attract new talent on the job market',
              'Increase available mobility options',
              'Reduce workload linked to mobility',
              'Increase employee retention',
              'Provide insights to executive team',
              'Reduce car fleet'
            ],
            required: true,
            section: 'Objectives'
          },
        ]
      },
      {
        title: 'Company Information',
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
          {
            key: 'contact_role',
            label: 'Contact Role',
            type: 'text',
            placeholder: 'e.g., HR Manager',
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
        title: 'Mobility Program Configuration',
        description: 'Configure your mobility program settings',
        fields: [
          {
            key: 'program_name',
            label: 'Program Name',
            type: 'text',
            placeholder: 'Choose a name for your mobility program',
            required: true,
            section: 'Program Setup'
          },
          {
            key: 'program_template',
            label: 'Mobility Program Template',
            type: 'select',
            options: [
              'Federal Mobility Budget',
              'Commute',
              'Professional Travel',
              'EV Charging & Fuel'
            ],
            required: true,
            section: 'Program Setup'
          },
        ]
      },
      {
        title: 'Allowed Mobility Services',
        description: 'Select which mobility services should be available',
        fields: [
          {
            key: 'service_b_parking',
            label: 'B-parking',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_bike_leasing',
            label: 'Bike leasing',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_bike_purchase',
            label: 'Bike purchase & Accessories',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_bike_rent',
            label: 'Bike rent',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_bus',
            label: 'Bus',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_car_leasing',
            label: 'Car leasing (pillar 1)',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_car_rental',
            label: 'Car rental',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_car_sharing',
            label: 'Car sharing',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_carpooling',
            label: 'Carpooling',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_shared_bike',
            label: 'Shared bike',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_kickscooter',
            label: 'Kickscooter',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_scooter',
            label: 'Scooter',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_public_parking',
            label: 'Public parking',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_public_transport_tickets',
            label: 'Public transport tickets',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_public_transport_subscriptions',
            label: 'Public transport subscriptions',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_taxi',
            label: 'Taxi',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_fuel_stations',
            label: 'Fuel stations',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_toll',
            label: 'Toll',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_housing_cost',
            label: 'Housing cost',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
          {
            key: 'service_bike_allowance',
            label: 'Bike allowance',
            type: 'select',
            options: ['Yes', 'No', 'Often'],
            section: 'Services'
          },
        ]
      },
      {
        title: 'Budget Configuration',
        fields: [
          {
            key: 'budget_groups',
            label: 'Budget Groups',
            type: 'select',
            options: ['Yes groups', 'No - Custom budgets per employee'],
            section: 'Budget'
          },
          {
            key: 'monthly_budget',
            label: 'Monthly Budget per Employee',
            type: 'number',
            placeholder: '0.00',
            description: 'Amount in EUR',
            section: 'Budget'
          },
          {
            key: 'budget_rollover',
            label: 'Allow Budget Rollover',
            type: 'select',
            options: ['Yes', 'No'],
            section: 'Budget'
          },
        ]
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
          {
            key: 'communication_channels',
            label: 'Communication Channels',
            type: 'multiselect',
            options: ['Email', 'Intranet', 'Team Meetings', 'Town Hall', 'Slack/Teams', 'Posters'],
            section: 'Communication'
          },
          {
            key: 'training_sessions',
            label: 'Training Sessions Planned',
            type: 'select',
            options: ['Yes', 'No', 'To be determined'],
            section: 'Communication'
          },
          {
            key: 'training_date',
            label: 'Training Date',
            type: 'date',
            section: 'Communication'
          },
        ]
      },
      {
        title: 'Stakeholders',
        fields: [
          {
            key: 'project_sponsor',
            label: 'Project Sponsor',
            type: 'text',
            placeholder: 'Name and role',
            section: 'Stakeholders'
          },
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
    "service_bike_leasing": "Often",
    "service_bike_purchase": "Yes",
    "service_bike_rent": "Yes",
    "service_bus": "Yes",
    "service_car_leasing": "Often",
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
  },
  "Commute": {
    "service_b_parking": "Yes",
    "service_bike_leasing": "Often",
    "service_bike_purchase": "No",
    "service_bike_rent": "Often",
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
  },
};
