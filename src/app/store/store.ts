import { LobOptions } from '../head/uhci-filters/filter-settings/lob-options';

export class IAppState {
  currentPage: string;
  timePeriod: string;
  taxId: LobOptions[];
  lineOfBusiness: string;
  serviceSetting: string;
  serviceCategory: string;
}
