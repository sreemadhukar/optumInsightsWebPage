import { CURRENT_PAGE, APPLY_FILTER, RESET_FILTER, REMOVE_FILTER } from './actions';
import { IAppState } from '../store';

export const INITIAL_STATE: IAppState = {
  currentPage: 'overviewPage',
  timePeriod: 'Last6Months',
  taxId: [{ Tin: 'All', Tinname: 'All' }],
  lineOfBusiness: 'All',
  serviceSetting: 'All',
  serviceCategory: '',
  priorAuthType: 'All',
  trendMetric: 'GettingReimbursed',
  trendDate: new Date()
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
        serviceCategory: action.filterData.serviceCategory,
        priorAuthType: action.filterData.priorAuthType,
        trendMetric: action.filterData.trendMetric,
        trendDate: action.filterData.trendDate
      };
    case REMOVE_FILTER:
      return {
        ...state,
        lineOfBusiness: action.filterData.lineOfBusiness ? INITIAL_STATE.lineOfBusiness : state.lineOfBusiness,
        serviceSetting: action.filterData.serviceSetting ? INITIAL_STATE.serviceSetting : state.serviceSetting,
        serviceCategory: action.filterData.serviceCategory ? INITIAL_STATE.serviceCategory : state.serviceCategory,
        priorAuthType: action.filterData.priorAuthType ? INITIAL_STATE.priorAuthType : state.priorAuthType,
        taxId: action.filterData.taxId ? INITIAL_STATE.taxId : state.taxId
      };
    case RESET_FILTER:
      return {
        ...state,
        timePeriod: INITIAL_STATE.timePeriod,
        taxId: INITIAL_STATE.taxId,
        lineOfBusiness: INITIAL_STATE.lineOfBusiness,
        serviceSetting: INITIAL_STATE.serviceSetting,
        serviceCategory: INITIAL_STATE.serviceCategory,
        priorAuthType: INITIAL_STATE.priorAuthType,
        trendMetric: INITIAL_STATE.trendMetric,
        trendDate: INITIAL_STATE.trendDate
      };
    default:
      return state;
  }
}
