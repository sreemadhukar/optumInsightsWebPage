import { lobName } from '../../../modals/lob-name';

export const TimePeriod = [
  { name: 'Last30Days', value: 'Last 30 Days', disable: false },
  { name: 'Rolling3Months', value: 'Rolling 3 Months', disable: false },
  { name: 'Last3Months', value: 'Last 3 Months', disable: false },
  { name: 'Last6Months', value: 'Last 6 Months', disable: false },
  { name: 'Last12Months', value: 'Last 12 Months', disable: false },
  { name: 'YTD', value: 'Year to Date', disable: false },
  { name: '2019', value: '2019', disable: false },
  { name: '2018', value: '2018', disable: false }
];

export const LineOfBusiness = [
  { name: 'All', value: lobName.all, disable: false },
  { name: 'CS', value: lobName.cAndSMedicaid, disable: false },
  { name: 'EI', value: lobName.eAndICommerCial, disable: false },
  { name: 'MR', value: lobName.mAndRMedicare, disable: false },
  { name: 'UN', value: lobName.unCategorized, disable: true }
];

export const Commercial = [
  { name: 'All', value: 'All', disable: false },
  { name: 'FULLY_INSURED', value: 'FI (Fully Insured)', disable: false },
  { name: 'ASO', value: 'ASO (Administrative Services Only)', disable: false }
];

export const ClaimsFilter = [
  { name: 'All', value: 'All', disable: false },
  { name: 'PROFESSIONAL', value: 'HCFA (Health Care Finance Administration)', disable: false },
  { name: 'INSTITUTIONAL', value: 'UB (Universal Billing)', disable: false }
];

export const AppealsFilter = [
  { name: 'Received Date', value: 'Received Date', disable: false },
  { name: 'Closed Date', value: 'Closed Date', disable: false }
];
export const ViewClaimsByFilter = [
  { name: 'DOS', value: 'Date of Service', disable: false },
  { name: 'DOP', value: 'Date of Processing', disable: false }
];

export const ServiceSetting = [
  { name: 'All', value: 'All', disable: false },
  { name: 'Inpatient', value: 'Inpatient', disable: false },
  { name: 'Outpatient', value: 'Outpatient', disable: false },
  { name: 'Outpatient Facility', value: 'Outpatient Facility', disable: false }
];

export const ServiceCategory = [
  { name: 'All', value: 'All', disable: false },
  { name: 'Medical', value: 'Medical', disable: false },
  { name: 'Surgical', value: 'Surgical', disable: false },
  { name: 'Maternity', value: 'Maternity', disable: false },
  { name: 'Transplant', value: 'Transplant', disable: false },
  { name: 'Cosmetic', value: 'Cosmetic / Reconstructive', disable: false },
  { name: 'MentalHealth', value: 'Mental Health', disable: false },
  { name: 'AmbulanceAir', value: 'Ambulance Air/Water', disable: false },
  { name: 'Chiropractic', value: 'Chiropractic', disable: false },
  { name: 'Dental', value: 'Dental', disable: false },
  { name: 'DiagnosticTesting', value: 'Diagnostic Testing', disable: false },
  { name: 'MedicalEquipment', value: 'Durable Medical Equipment', disable: false },
  { name: 'Hospice', value: 'Hospice', disable: false },
  { name: 'Imaging', value: 'Imaging', disable: false },
  { name: 'Infertility', value: 'Infertility Benefit Interpretation', disable: false },
  { name: 'InfusionServices', value: 'Infusion Services', disable: false },
  { name: 'Lab', value: 'Lab', disable: false },
  { name: 'LongTermCare', value: 'Long Term Care', disable: false },
  { name: 'Medications', value: 'Medications', disable: false },
  { name: 'NICU', value: 'NICU', disable: false },
  { name: 'OccupationalTherapy', value: 'Occupational Therapy', disable: false },
  { name: 'Orthotics', value: 'Orthotics', disable: false },
  { name: 'PainManagement', value: 'Pain Management', disable: false },
  { name: 'Pharmacy', value: 'Pharmacy', disable: false },
  { name: 'PhysicalTherapy', value: 'Physical Therapy', disable: false },
  { name: 'Podiatry', value: 'Podiatry', disable: false },
  { name: 'PrivateDutyNursing', value: 'Private Duty Nursing', disable: false },
  { name: 'Prosthetics', value: 'Prosthetics', disable: false },
  { name: 'Rehabilitation', value: 'Rehabilitation', disable: false },
  { name: 'RespiratoryTherapy', value: 'Respiratory Therapy', disable: false },
  { name: 'SkilledNursing', value: 'Skilled Nursing', disable: false },
  { name: 'SpeechTherapy', value: 'Speech Therapy', disable: false },
  { name: 'SubUseDisorder', value: 'Substance Use Disorder', disable: false },
  { name: 'Supplies', value: 'Supplies', disable: false },
  { name: 'TherapyServices', value: 'Therapy Services', disable: false },
  { name: 'Transport', value: 'Transport', disable: false },
  { name: 'UnprovenExpInvst', value: 'Unproven, Experimental, Investigational', disable: false },
  { name: 'TransplantServices', value: 'Transplant Services', disable: false },
  { name: 'Vision', value: 'Vision', disable: false },
  { name: 'WellBaby', value: 'Well Baby (eNtf Only)', disable: false },
  { name: 'HomeServices', value: 'Home Services', disable: false },
  { name: 'AcuteCare', value: 'Long Term Acute Care', disable: false },
  { name: 'ServiceDelivery', value: 'Intensive Service Delivery', disable: false },
  { name: 'CardiacRehabilitation', value: 'Cardiac Rehabilitation', disable: false },
  { name: 'Dialysis', value: 'Dialysis', disable: false },
  { name: 'PATNursing', value: 'PAT Skilled Nursing', disable: false },
  { name: 'HomeCommunityServices', value: 'Home and Community Based Services', disable: false },
  { name: 'AmbulatorySurgical', value: 'Ambulatory Surgical Center', disable: false },
  { name: 'FacilityService', value: 'Facility Based Service', disable: false },
  { name: 'Custodial', value: 'Custodial', disable: false },
  { name: 'WeightManagement', value: 'Weight Management', disable: false },
  { name: 'Uncategorized', value: 'Uncategorized', disable: false }
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
  toggleDate: false,
  toggleClaim: false,
  toggleAppeals: false,
  toggleViewClaimsBy: false
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
