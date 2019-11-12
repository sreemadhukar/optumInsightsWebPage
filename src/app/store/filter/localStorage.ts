import { INITIAL_STATE } from './reducer';

export const loadState = () => {
  const serializedState = sessionStorage.getItem('state');
  return serializedState ? JSON.parse(serializedState) : INITIAL_STATE;
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
      }
      return next(action);
    };
  };
};
