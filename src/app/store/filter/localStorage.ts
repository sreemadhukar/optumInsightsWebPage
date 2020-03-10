import { INITIAL_STATE } from './reducer';
import { FILTER_MASTER_DATA } from '../kopFilter/kopFilterMasterData';
import { find as _find } from 'lodash';
import { APPLY_KOP_FILTER, RESET_KOP_FILTER } from '../kopFilter/actions';

// Get default filter of KOP
const defaultKOPFilter = _find(FILTER_MASTER_DATA, { default: true });

// Initialze the initial state of KOP
export const KOP_INITIAL_STATE = {
  timePeriod: defaultKOPFilter['title'],
  ...defaultKOPFilter
};

export const loadState = () => {
  const serializedState = sessionStorage.getItem('state');
  return serializedState ? JSON.parse(serializedState) : INITIAL_STATE;
};

// Load KOP state Either from default or session storage
export const loadKOPState = () => {
  const kopFilterState = sessionStorage.getItem('kopFilterState');
  return kopFilterState ? JSON.parse(kopFilterState) : KOP_INITIAL_STATE;
};

export const saveState = state => {
  return function(next) {
    return function(action) {
      if (action.type === 'RESET_FILTER') {
        const serializedState = JSON.stringify(INITIAL_STATE);
        sessionStorage.setItem('state', serializedState);
      } else if (action.type === 'APPLY_FILTER') {
        const serializedState = JSON.stringify(action.filterData);
        sessionStorage.setItem('state', serializedState);
      } else if (action.type === 'REMOVE_FILTER') {
        const serializedState = JSON.parse(sessionStorage.getItem('state'));
        for (const key in action.filterData) {
          if (action.filterData.hasOwnProperty(key) && serializedState.hasOwnProperty(key)) {
            serializedState[key] = INITIAL_STATE[key];
            sessionStorage.setItem('state', JSON.stringify(serializedState));
          }
        }
      } else if (action.type === RESET_KOP_FILTER) {
        sessionStorage.setItem('kopFilterState', JSON.stringify(KOP_INITIAL_STATE));
      } else if (action.type === APPLY_KOP_FILTER) {
        // Get Current state of KOP FIlter store
        const currentState = state.getState()['kop'];

        // Calculate next state
        const currentKOPState = {
          ...currentState,
          timePeriod: action['timePeriod'],
          ..._find(FILTER_MASTER_DATA, { title: action['timePeriod'] })
        };

        // Store it in session storage
        sessionStorage.setItem('kopFilterState', JSON.stringify(currentKOPState));
      }
      return next(action);
    };
  };
};
