import { TaxId } from '../head/uhci-filters/filter-settings/filter-options';

export class IAppState {
  currentPage: string;
  timePeriod: string;
  taxId: TaxId[];
  lineOfBusiness: string;
  serviceSetting: string;
  serviceCategory: string;
  priorAuthType: string;
  trendMetric: string;
  trendDate: Date;
  claimsFilter: string;
}
