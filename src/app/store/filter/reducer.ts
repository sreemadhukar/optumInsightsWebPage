import { CURRENT_PAGE, APPLY_FILTER, RESET_FILTER } from './actions';
import { IAppState } from '../store';

export const INITIAL_STATE: IAppState = {
  currentPage: 'overviewPage',
  timePeriod: 'Last6Months',
  taxId: [],
  lineOfBusiness: 'All',
  serviceSetting: 'All',
  serviceCategory: 'All'
};

export function FilterReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.currentPage
      };
    case APPLY_FILTER:
      return {
        ...state,
        timePeriod: action.filterData.timePeriod,
        taxId: action.filterData.taxId,
        lineOfBusiness: action.filterData.lineOfBusiness,
        serviceSetting: action.filterData.serviceSetting,
        serviceCategory: action.filterData.serviceCategory
      };
    case RESET_FILTER:
      return {
        ...INITIAL_STATE
      };
    default:
      return state;
  }
}
