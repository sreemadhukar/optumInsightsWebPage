import { APPLY_KOP_FILTER, RESET_KOP_FILTER } from './actions';
import { FILTER_MASTER_DATA } from './kopFilterMasterData';
import { find as _find } from 'lodash';
import { loadKOPState } from '../filter/localStorage';

// Get default filter
const defaultFilter = _find(FILTER_MASTER_DATA, { default: true });

/**
 * Reducer function handle the state update of KOP FILTER
 * @param state  Current state if not provided INITIAL_STATE
 * @param action Dispatched action to process the state
 */
export function KopFilterReducer(state = loadKOPState(), action) {
  switch (action.type) {
    case APPLY_KOP_FILTER:
      return {
        ...state,
        timePeriod: action['timePeriod'],
        ..._find(FILTER_MASTER_DATA, { title: action['timePeriod'] })
      };
    case RESET_KOP_FILTER:
      return {
        ...state,
        timePeriod: defaultFilter['title'],
        ...defaultFilter
      };
    default:
      return state;
  }
}
