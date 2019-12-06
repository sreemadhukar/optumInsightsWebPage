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
  trendDate: new Date(),
  claimsFilter: 'All',
  appealsFilter: 'Received Date'
};

export function FilterReducer(state, action) {
  console.log(action);
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
        timePeriod: action.filterData.timePeriod,
        taxId: action.filterData.taxId,
        lineOfBusiness: action.filterData.lineOfBusiness,
        serviceSetting: action.filterData.serviceSetting,
        serviceCategory: action.filterData.serviceCategory,
        priorAuthType: action.filterData.priorAuthType,
        trendMetric: action.filterData.trendMetric,
        trendDate: action.filterData.trendDate,
        claimsFilter: action.filterData.claimsFilter,
        appealsFilter: action.filterData.appealsFilter
      };
    case REMOVE_FILTER:
      return {
        ...state,
        lineOfBusiness: action.filterData.lineOfBusiness ? INITIAL_STATE.lineOfBusiness : state.lineOfBusiness,
        serviceSetting: action.filterData.serviceSetting ? INITIAL_STATE.serviceSetting : state.serviceSetting,
        serviceCategory: action.filterData.serviceCategory ? INITIAL_STATE.serviceCategory : state.serviceCategory,
        priorAuthType: action.filterData.priorAuthType ? INITIAL_STATE.priorAuthType : state.priorAuthType,
        taxId: action.filterData.taxId ? INITIAL_STATE.taxId : state.taxId,
        claimsFilter: action.filterData.claimsFilter ? INITIAL_STATE.claimsFilter : state.claimsFilter,
        appealsFilter: action.filterData.appealsFilter ? INITIAL_STATE.appealsFilter : state.appealsFilter
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
        trendDate: INITIAL_STATE.trendDate,
        claimsFilter: INITIAL_STATE.claimsFilter,
        appealsFilter: INITIAL_STATE.appealsFilter
      };
    default:
      return state;
  }
}

function switchTimePeriodValues(timePeriod, currentPageAction) {
  if (
    currentPageAction === 'paymentsPage' ||
    currentPageAction === 'nonPaymentsPage' ||
    currentPageAction === 'gettingReimbursedSummary'
  ) {
    if (timePeriod === 'Last12Months' || timePeriod === '2018' || timePeriod === '2017') {
      timePeriod = 'Last6Months';
    }
  } else {
    const serializedState = JSON.parse(sessionStorage.getItem('state'));
    if (serializedState && serializedState.timePeriod) {
      timePeriod = serializedState.timePeriod;
    }
  }
  return timePeriod;
}
