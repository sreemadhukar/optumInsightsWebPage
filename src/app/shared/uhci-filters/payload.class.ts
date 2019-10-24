import { TaxId } from '../../head/uhci-filters/filter-settings/filter-options';

export class PayLoad {
  timePeriod: string;
  taxId?: TaxId[];
  lob?: string;
  serviceSetting?: string;
  priorAuthType?: string;
  trendMetric?: string;
  trendDate?: Date;
}
