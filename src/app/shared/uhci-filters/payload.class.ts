import { TaxId } from '../../head/uhci-filters/filter-settings/filter-options';

export class PayLoad {
  currentPage: string;
  timePeriod: string;
  taxId?: TaxId[];
  lineOfBusiness?: string;
  serviceSetting?: string;
  priorAuthType?: string;
  trendMetric?: string;
  trendDate?: Date;
}
