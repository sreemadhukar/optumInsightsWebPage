import { LobOptions } from './lob-options';

export class FilterOptions {
  public timePeriod: 'last30Days' | 'Last3Months';
  public taxId: LobOptions[] | null;
  public lineOfBusiness: 'CS' | 'All';
  public serviceSetting: string;

  constructor() {}

  getDefaultFilter() {
    this.timePeriod = 'Last3Months';
    this.taxId = null;
    this.lineOfBusiness = 'All';
    this.serviceSetting = null;
    return {
      timePeriod: this.timePeriod,
      taxId: this.taxId,
      lineOfBusiness: this.lineOfBusiness,
      serviceSetting: this.serviceSetting
    };
  }

  setFilter() {}
}

export const TimePeriod = [
  { name: 'Last30Days', value: 'Last 30 Days' },
  { name: 'Last3Months', value: 'Last 3 Months' },
  { name: 'Last6Months', value: 'Last 6 Months' },
  { name: 'Last12Months', value: 'Last 12 Months' },
  { name: 'YTD', value: 'Year to Date' },
  { name: '2018', value: '2018' },
  { name: '2017', value: '2017' }
];

export const LineOfBusiness = [
  { name: 'All', value: 'All', disable: false },
  { name: 'CS', value: 'Community & State', disable: false },
  { name: 'EI', value: 'Employer & Individual', disable: false },
  { name: 'MR', value: 'Medicare & Retirement', disable: false },
  { name: 'Uncategorized', value: 'Uncategorized', disable: true }
];

export const ServiceSetting = [
  { name: 'All', value: 'All', disable: false },
  { name: 'CS', value: 'Inpatient', disable: false },
  { name: 'EI', value: 'Outpatient', disable: false },
  { name: 'MR', value: 'Outpatient Facility', disable: false }
];

// export const ServiceCategory = [
//   {name:'All', value: "All"
//   'Medical',
//   'Surgical',
//   'Maternity',
//   'Transplant',
//   'Cosmetic / Reconstructive',
//   'Mental Health',
//   'Ambulance Air/Water',
//   'Chiropractic',
//   'Dental',
//   'Diagnostic Testing',
//   'Durable Medical Equipment',
//   'Hospice',
//   'Imaging',
//   'Infertility Benefit Interpretation',
//   'Infusion Services',
//   'Lab',
//   'Long Term Care',
//   'Medications',
//   'NICU',
//   'Occupational Therapy',
//   'Orthotics',
//   'Pain Management',
//   'Pharmacy',
//   'Physical Therapy',
//   'Podiatry',
//   'Private Duty Nursing',
//   'Prosthetics',
//   'Rehabilitation',
//   'Respiratory Therapy',
//   'Skilled Nursing',
//   'Speech Therapy',
//   'Substance Use Disorder',
//   'Supplies',
//   'Therapy Services',
//   'Transport',
//   'Unproven, Experimental, Investigational',
//   'Transplant Services',
//   'Vision',
//   'Well Baby (eNtf Only)',
//   'Home Services',
//   'Long Term Acute Care',
//   'Intensive Service Delivery',
//   'Cardiac Rehabilitation',
//   'Dialysis',
//   'PAT Skilled Nursing',
//   'Home and Community Based Services',
//   'Ambulatory Surgical Center',
//   'Facility Based Service',
//   'Custodial',
//   'Weight Management'
// ];
