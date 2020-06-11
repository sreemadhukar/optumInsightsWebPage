import { CURRENT_PAGE, APPLY_FILTER, RESET_FILTER, REMOVE_FILTER } from './actions';
import { GetCurrentFilterOptionByPage } from 'src/app/head/uhci-filters/filter-settings/filter-methods';

import { IAppState } from '../store';

export const INITIAL_STATE: IAppState = {
  currentPage: 'overviewPage',
  timePeriod: 'Last6Months',
  taxId: [{ Tin: 'All', Tinname: 'All' }],
  lineOfBusiness: 'All',
  commercial: 'All',
  serviceSetting: 'All',
  serviceCategory: 'All',
  priorAuthType: 'All',
  trendMetric: 'GettingReimbursed',
  trendDate: new Date(),
  claimsFilter: 'All',
  appealsFilter: 'Received Date',
  viewClaimsByFilter: 'DOS'
};

export const loadState = () => {
  const serializedState = sessionStorage.getItem('state');
  return serializedState ? JSON.parse(serializedState) : INITIAL_STATE;
};

export function FilterReducer(state = loadState(), action) {
  switch (action.type) {
    case CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.currentPage,
        timePeriod: switchTimePeriodValues(state.timePeriod, action.currentPage)
      };
    case APPLY_FILTER:
      return {
        ...state,
        timePeriod: switchTimePeriodValues(action.filterData.timePeriod, action.currentPage || state.currentPage),
        taxId: action.filterData.taxId,
        lineOfBusiness: action.filterData.lineOfBusiness,
        commercial: action.filterData.commercial,
        serviceSetting: action.filterData.serviceSetting,
        serviceCategory: action.filterData.serviceCategory,
        priorAuthType: action.filterData.priorAuthType,
        trendMetric: action.filterData.trendMetric,
        trendDate: action.filterData.trendDate,
        claimsFilter: action.filterData.claimsFilter,
        appealsFilter: action.filterData.appealsFilter,
        viewClaimsByFilter: action.filterData.viewClaimsByFilter
      };
    case REMOVE_FILTER:
      return {
        ...state,
        timePeriod: switchTimePeriodValues(state.timePeriod, action.currentPage || state.currentPage),
        lineOfBusiness: action.filterData.lineOfBusiness ? INITIAL_STATE.lineOfBusiness : state.lineOfBusiness,
        commercial: action.filterData.commercial ? INITIAL_STATE.commercial : state.commercial,
        serviceSetting: action.filterData.serviceSetting ? INITIAL_STATE.serviceSetting : state.serviceSetting,
        serviceCategory: action.filterData.serviceCategory ? INITIAL_STATE.serviceCategory : state.serviceCategory,
        priorAuthType: action.filterData.priorAuthType ? INITIAL_STATE.priorAuthType : state.priorAuthType,
        taxId: action.filterData.taxId ? INITIAL_STATE.taxId : state.taxId,
        claimsFilter: action.filterData.claimsFilter ? INITIAL_STATE.claimsFilter : state.claimsFilter,
        appealsFilter: action.filterData.appealsFilter ? INITIAL_STATE.appealsFilter : state.appealsFilter,
        viewClaimsByFilter: action.filterData.viewClaimsByFilter
          ? INITIAL_STATE.viewClaimsByFilter
          : state.viewClaimsByFilter
      };
    case RESET_FILTER:
      return {
        ...state,
        timePeriod: switchTimePeriodValues(INITIAL_STATE.timePeriod, action.currentPage || state.currentPage),
        taxId: INITIAL_STATE.taxId,
        lineOfBusiness: INITIAL_STATE.lineOfBusiness,
        commercial: INITIAL_STATE.commercial,
        serviceSetting: INITIAL_STATE.serviceSetting,
        serviceCategory: INITIAL_STATE.serviceCategory,
        priorAuthType: INITIAL_STATE.priorAuthType,
        trendMetric: INITIAL_STATE.trendMetric,
        trendDate: INITIAL_STATE.trendDate,
        claimsFilter: INITIAL_STATE.claimsFilter,
        appealsFilter: INITIAL_STATE.appealsFilter,
        viewClaimsByFilter: INITIAL_STATE.viewClaimsByFilter
      };
    default:
      return state;
  }
}

function switchTimePeriodValues(timePeriod: string, currentPage: string) {
  const state = loadState();
  timePeriod = state.timePeriod;
  const timePeriodObj = GetCurrentFilterOptionByPage(currentPage, 'timeperiod', timePeriod);
  state.timePeriod = timePeriodObj.name;
  sessionStorage.setItem('state', JSON.stringify(state));
  return timePeriodObj;
}
