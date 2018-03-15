import * as types from '../actions/actionTypes';

const initialState = {
  loading: false,
  isRefreshing:false,
  error: false,
  detail: null
};

export default function financeDetail(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_FINANCE_DETAIL:
      return Object.assign({}, state, action);
    case types.RECEIVE_FINANCE_DETAIL:
      if (action.error) {
        return Object.assign({}, state, {
          loading: false,
          isRefreshing:false,
          error: action.error,
          msg: action.msg
        });
      }
      return Object.assign({}, state, {
        loading: false,
        isRefreshing:false,
        error: false,
        detail: action.detail
      });
    case types.CLEAR_FINANCE_CACHE:
      return Object.assign({}, state, {detail: null});
    default:
      return state;
  }
}