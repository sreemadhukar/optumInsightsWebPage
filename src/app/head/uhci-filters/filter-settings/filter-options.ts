export const TimePeriod = [
  { name: 'Last30Days', value: 'Last 30 Days', disable: false },
  { name: 'Last3Months', value: 'Last 3 Months', disable: false },
  { name: 'Last6Months', value: 'Last 6 Months', disable: false },
  { name: 'Last12Months', value: 'Last 12 Months', disable: false },
  { name: 'YTD', value: 'Year to Date', disable: false },
  { name: '2018', value: '2018', disable: false },
  { name: '2017', value: '2017', disable: false }
];

export const LineOfBusiness = [
  { name: 'All', value: 'All', disable: false },
  { name: 'CS', value: 'Community & State', disable: false },
  { name: 'EI', value: 'Employer & Individual', disable: false },
  { name: 'MR', value: 'Medicare & Retirement', disable: false },
  { name: 'Un', value: 'Uncategorized', disable: true }
];

export const ServiceSetting = [
  { name: 'All', value: 'All', disable: false },
  { name: 'Inpatient', value: 'Inpatient', disable: false },
  { name: 'Outpatient', value: 'Outpatient', disable: false },
  { name: 'Outpatient Facility', value: 'Outpatient Facility', disable: false }
];

export const ServiceCategory = [
  { name: 'All', value: 'All' },
  { name: 'Medical', value: 'Medical' },
  { name: 'Surgical', value: 'Surgical' },
  { name: 'Maternity', value: 'Maternity' },
  { name: 'Transplant', value: 'Transplant' },
  { name: 'Cosmetic', value: 'Cosmetic / Reconstructive' },
  { name: 'MentalHealth', value: 'Mental Health' },
  { name: 'AmbulanceAir', value: 'Ambulance Air/Water' },
  { name: 'Chiropractic', value: 'Chiropractic' },
  { name: 'Dental', value: 'Dental' },
  { name: 'DiagnosticTesting', value: 'Diagnostic Testing' },
  { name: 'MedicalEquipment', value: 'Durable Medical Equipment' },
  { name: 'Hospice', value: 'Hospice' },
  { name: 'Imaging', value: 'Imaging' },
  { name: 'Infertility', value: 'Infertility Benefit Interpretation' },
  { name: 'InfusionServices', value: 'Infusion Services' },
  { name: 'Lab', value: 'Lab' },
  { name: 'LongTermCare', value: 'Long Term Care' },
  { name: 'Medications', value: 'Medications' },
  { name: 'NICU', value: 'NICU' },
  { name: 'OccupationalTherapy', value: 'Occupational Therapy' },
  { name: 'Orthotics', value: 'Orthotics' },
  { name: 'PainManagement', value: 'Pain Management' },
  { name: 'Pharmacy', value: 'Pharmacy' },
  { name: 'PhysicalTherapy', value: 'Physical Therapy' },
  { name: 'Podiatry', value: 'Podiatry' },
  { name: 'PrivateDutyNursing', value: 'Private Duty Nursing' },
  { name: 'Prosthetics', value: 'Prosthetics' },
  { name: 'Rehabilitation', value: 'Rehabilitation' },
  { name: 'RespiratoryTherapy', value: 'Respiratory Therapy' },
  { name: 'SkilledNursing', value: 'Skilled Nursing' },
  { name: 'SpeechTherapy', value: 'Speech Therapy' },
  { name: 'SubUseDisorder', value: 'Substance Use Disorder' },
  { name: 'Supplies', value: 'Supplies' },
  { name: 'TherapyServices', value: 'Therapy Services' },
  { name: 'Transport', value: 'Transport' },
  { name: 'UnprovenExpInvst', value: 'Unproven, Experimental, Investigational' },
  { name: 'TransplantServices', value: 'Transplant Services' },
  { name: 'Vision', value: 'Vision' },
  { name: 'WellBaby', value: 'Well Baby (eNtf Only)' },
  { name: 'HomeServices', value: 'Home Services' },
  { name: 'AcuteCare', value: 'Long Term Acute Care' },
  { name: 'ServiceDelivery', value: 'Intensive Service Delivery' },
  { name: 'CardiacRehabilitation', value: 'Cardiac Rehabilitation' },
  { name: 'Dialysis', value: 'Dialysis' },
  { name: 'PATNursing', value: 'PAT Skilled Nursing' },
  { name: 'HomeCommunityServices', value: 'Home and Community Based Services' },
  { name: 'AmbulatorySurgical', value: 'Ambulatory Surgical Center' },
  { name: 'FacilityService', value: 'Facility Based Service' },
  { name: 'Custodial', value: 'Custodial' },
  { name: 'WeightManagement', value: 'Weight Management' }
];

export const PriorAuthDecisionType = [
  { name: 'All', value: 'All' },
  { name: 'Administrative', value: 'Administrative' },
  { name: 'Clinical', value: 'Clinical' }
];

export const TrendMetrics = [
  { name: 'GettingReimbursed', value: 'Getting Reimbursed' },
  { name: 'Appeals', value: 'Appeals' },
  { name: 'IssueResolution', value: 'Issue Resolution' },
  { name: 'SelfService', value: 'Self Service' },
  { name: 'PriorAuthorization', value: 'Prior Authorization' }
];

export const filterToggles = {
  toggleTimePeriod: false,
  toggleTaxId: false,
  toggleLob: false,
  toggleServiceSetting: false,
  toggleServiceCategory: false,
  togglePriorAuthType: false,
  toggleMetric: false,
  toggleDate: false
};

export interface TaxId {
  Tin: string;
  Tinname: string;
}

export interface MetricPropType {
  name: string;
  value: string;
  disable?: boolean;
}
